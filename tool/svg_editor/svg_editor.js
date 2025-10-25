"use strict"
/* - import ------------------------------------------------------------------------------------ */
import storage from "/storage.js"
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
const img_home = document.getElementById("img-home")
const img_view = document.getElementById("img-view")
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
img_home.addEventListener('click', () => {
	scale = 1
	originX = 0
	originY = 0
	update_img_view()
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
	const content = document.getElementById("img-content")
	content.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`
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
		textarea.addEventListener('input', () => {
			line_numbers.innerHTML = ""
			let line_count = textarea.value.match(/\n/g)
			if (line_count) { line_count = line_count.length + 1 } else { line_count = 1 }
			for (let i = 0; i < line_count; i++) { line_numbers.insertAdjacentElement('beforeend', document.createElement('span')) }
			img_content.innerHTML = textarea.value
		})
		line_numbers.insertAdjacentElement('beforeend', document.createElement('span'))
		main_editor.appendChild(line_numbers)
		main_editor.appendChild(textarea)
	}
}
/* --------------------------------------------------------------------------------------------- */
