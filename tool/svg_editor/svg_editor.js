"use strict"
/* - import ------------------------------------------------------------------------------------ */
import storage from "/module/storage.js"
/* - const ------------------------------------------------------------------------------------- */
// img drag
let scale = 1
let originX = 0
let originY = 0
let startX, startY
let isDragging = false
let zoom_min = 0.2
let zoom_max = 5
let opening_window = null
const img_view = document.getElementById("img-view")
const default_xml_value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"
\ \ stroke-linecap="round" stroke-linejoin="round">
</svg>`
/* - init -------------------------------------------------------------------------------------- */
reflect_setting()
set_views("xml", "none")
/* - add eventListener ------------------------------------------------------------------------- */
window.addEventListener('beforeunload', () => {
	if (opening_window) { opening_window.close() }
})
document.getElementById("settings").addEventListener('click', () => {
	nurunu_open("/settings/?p=svg_editor", '_blank', 'top=100,left=200,height=500,width=400,popup')
})
document.getElementById("img-home").addEventListener('click', () => {
	scale = 1
	originX = 0
	originY = 0
	update_img_view()
})
document.getElementById("add-doc").addEventListener('change', function () {
	const fileReader = new FileReader()
	fileReader.addEventListener('load', function () {
		const img_doc = document.getElementById('img-doc')
		const doc = document.createElement('img')
		doc.id = "doc"
		doc.src = this.result
		img_doc.innerHTML = ""
		img_doc.appendChild(doc)
		update_img_view()
	})
	fileReader.readAsDataURL(this.files[0])
})
// img_view
img_view.addEventListener('mousedown', (e) => {
	isDragging = true
	img_view.style.cursor = 'grabbing'
	startX = e.clientX - originX
	startY = e.clientY - originY
})
img_view.addEventListener('mousemove', (e) => {
	if (!isDragging) return
	originX = e.clientX - startX
	originY = e.clientY - startY
	update_img_view()
})
img_view.addEventListener('mouseup', () => {
	isDragging = false
	img_view.style.cursor = 'grab'
})
img_view.addEventListener('wheel', (e) => {
	e.preventDefault()
	const zoomIntensity = 0.1
	const delta = e.deltaY < 0 ? 1 : -1
	const newScale = scale + delta * zoomIntensity * scale
	scale = Math.min(Math.max(newScale, zoom_min), zoom_max)
	update_img_view()
})
window.addEventListener('storage', reflect_setting)
/* - function ---------------------------------------------------------------------------------- */
function update_img_view() {
	const content = document.getElementById("img-box")
	content.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`
	const doc = document.getElementById("img-doc")
	if (doc) {
		const img = document.getElementById("img-content")
		doc.style.height = img.offsetHeight + "px"
		doc.style.width = img.offsetWidth + "px"
	}
}
function nurunu_open(url, target, features) {
	if (opening_window) { opening_window.close() }
	opening_window = window.open(url, target, features)
	opening_window.addEventListener('beforeunload', () => {
		opening_window.close()
		opening_window = null
	})
	return opening_window
}
function reflect_setting() {
	const setting = storage.get("svg-editor-setting")
	if (!setting) { return }
	const homebar = document.getElementById("homebar")
	if (setting.hide_homebar) { homebar.style.display = "none" } else { homebar.style.display = "block" }
}
function set_views(main, sub) {
	// const
	const main_editor = document.getElementById("main-content")
	const sub_view = document.getElementById("sub-view")
	const img_content = document.getElementById("img-content")
	// reset
	main_editor.innerHTML = ""
	sub_view.innerHTML = ""
	if (main == "xml") {
		const line_numbers = document.createElement('div')
		const textarea = document.createElement('textarea')
		line_numbers.className = "line-numbers"
		textarea.id = "xml-textarea"
		textarea.className = "xml"
		textarea.spellcheck = false
		textarea.textContent = default_xml_value
		textarea.addEventListener('input', function () {
			if (this.value == "") { this.value = default_xml_value }
			line_numbers.innerHTML = ""
			let line_count = this.value.match(/\n/g)
			if (line_count) { line_count = line_count.length + 1 } else { line_count = 1 }
			for (let i = 0; i < line_count; i++) { line_numbers.insertAdjacentElement('beforeend', document.createElement('span')) }
			img_content.innerHTML = this.value
			update_img_view()
		})
		textarea.dispatchEvent(new Event('input', { bubbles: true }))
		main_editor.appendChild(line_numbers)
		main_editor.appendChild(textarea)
	}
}
/* --------------------------------------------------------------------------------------------- */
