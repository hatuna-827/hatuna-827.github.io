"use strict"
document.addEventListener('DOMContentLoaded', function () {
	const content = document.createElement('div')
	content.id = "main-content"
	const contents_list = Array.from(document.getElementById("main").children)
	contents_list.forEach((element) => {
		content.appendChild(element)
	})
	document.getElementById("main").appendChild(content)

	document.querySelectorAll('img').forEach((img) => {
		img.setAttribute('alt', '画像の読み込みに失敗しました。')
		const imgbox = document.createElement('div')
		imgbox.className = "img-box"
		img.insertAdjacentElement('afterend', imgbox)
		imgbox.appendChild(img)
	})
	img_fit()

	document.querySelectorAll('#main a').forEach((link) => {
		if (!link.getAttribute('target')) {
			if (!link.getAttribute('href').startsWith("#")) {
				link.setAttribute('target', '_blank')
			}
		}
	})

	const tag_container = document.createElement('div')
	tag_container.id = "tag-container"
	const tag_wrapper = document.createElement('div')
	tag_wrapper.id = "tag-wrapper"
	const tag_content = document.createElement('div')
	tag_content.id = "tag-content"
	const tag_list = document.createElement('ol')
	tag_list.id = "tag-list"
	const tag_title = document.createElement('h2')
	tag_title.id = "tag-title"
	tag_title.textContent = "目次"
	document.querySelectorAll('h2').forEach((subtitle, i) => {
		const esc_text = subtitle.innerText.replace(/"/g, "'")
		const link_target = document.createElement('hr')
		const list = document.createElement('li')
		const link = document.createElement('a')
		link_target.id = esc_text
		link.textContent = subtitle.innerText
		link.setAttribute('href', "#" + esc_text)
		subtitle.insertAdjacentElement('beforebegin', link_target)
		list.appendChild(link)
		tag_list.appendChild(list)
	})
	tag_content.appendChild(tag_list)
	tag_wrapper.appendChild(tag_title)
	tag_wrapper.appendChild(tag_content)
	tag_container.appendChild(tag_wrapper)
	document.querySelector("h1").insertAdjacentElement("afterend", tag_container)

	document.querySelectorAll('pre').forEach((target, i) => {
		if (Array.from(target.classList).includes("no-copy")) {
			const pre_box = document.createElement('div')
			pre_box.className = "pre-box"
			target.insertAdjacentElement('afterend', pre_box)
			pre_box.appendChild(target)
			return
		}
		target.id = "code" + i
		const pre_box = document.createElement('div')
		pre_box.className = "pre-box"
		const sticky_box = document.createElement('div')
		sticky_box.className = "sticky-box"
		const copy_button = document.createElement('div')
		copy_button.className = "copy-btn"
		const copy_button_icon = document.createElement('div')
		copy_button_icon.className = "copy-btn-icon"
		copy_button_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"><path d="M8,8v-2a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v7a3,3 0 0 1-3,3h-2v2a3,3 0 0 1-3,3h-7a3,3 0 0 1-3-3v-7a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v5" /></svg>'
		const copy_button_text = document.createElement('div')
		copy_button_text.className = "copy-btn-text"
		copy_button_text.textContent = "コードをコピー"
		copy_button.addEventListener('click', function () {
			navigator.clipboard.writeText(target.textContent)
			copy_button_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4,13 10,19 21,7" /></svg>'
			copy_button_text.textContent = "コピーしました"
			setTimeout(() => {
				copy_button_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"><path d="M8,8v-2a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v7a3,3 0 0 1-3,3h-2v2a3,3 0 0 1-3,3h-7a3,3 0 0 1-3-3v-7a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v5" /></svg>'
				copy_button_text.textContent = "コードをコピー"
			}, 1000)
		})
		target.insertAdjacentElement('afterend', pre_box)
		copy_button.appendChild(copy_button_text)
		copy_button.appendChild(copy_button_icon)
		sticky_box.appendChild(copy_button)
		pre_box.appendChild(target)
		pre_box.appendChild(sticky_box)
	})
})
window.addEventListener('resize', img_fit)
function img_fit() {
	document.querySelectorAll('img').forEach((img) => {
		img.parentElement.style.height = "50vh"
		img.parentElement.style.width = "calc(100% - 60px)"
		img.style.height = "auto"
		img.style.width = img.parentElement.offsetWidth + "px"
		if (img.parentElement.offsetHeight < img.offsetHeight) {
			img.style.width = "auto"
			img.style.height = img.parentElement.offsetHeight + "px"
		}
		img.parentElement.style.height = "auto"
		img.parentElement.style.width = "auto"
	})
}