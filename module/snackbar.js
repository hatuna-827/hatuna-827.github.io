"use strict"
if (!document.getElementById("snackbar_box")) {
	const snackbar_box = document.createElement('div')
	snackbar_box.id = "snackbar_box"
	const css_url = URL.parse("./snackbar.css", import.meta.url).toString()
	snackbar_box.innerHTML = '<link rel="stylesheet" href="' + css_url + '">'
	document.body.appendChild(snackbar_box)
}
export default function snackbar({
	type = "Suc",
	context,
	color,
	bg_color,
	icon,
	close = false,
	timer = 3000
} = {}) {
	if (!color || !bg_color || !icon) {
		if (!["Suc", "Warn", "Err", "Info"].includes(type)) { type = "Suc" }
		if (!context) { context = type }
		let design = { color: "", icon: "" }
		if (type == "Suc") {
			design = { color: "#28A745", icon: '<path d="M5,13 10,18 19,8" />' }
		} else if (type == "Warn") {
			design = { color: "#FFC107", icon: '<path d="M12,5v9M12,19v0" />' }
		} else if (type == "Err") {
			design = { color: "#DC3545", icon: '<path d="M7,7L17,17M7,17L17,7" />' }
		} else if (type == "Info") {
			design = { color: "#17A2B8", icon: '<path d="M12,5v0M12,10v9" />' }
		}
		color = "var(--snackbar-color-" + type.toLowerCase() + "," + design.color + ")"
		bg_color = "var(--snackbar-bg-color-" + type.toLowerCase() + ",var(--snackbar-bg-color,#fff))"
		icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="white"><circle cx="12" cy="12" r="12" fill="currentColor" stroke-width="2"	stroke="none" />' + design.icon + '</svg>'
	}
	if (!context) { context = "context" }
	const snackbar_box = document.getElementById("snackbar_box")
	// snackbar
	const snackbar = document.createElement('div')
	snackbar.className = "snackbar"
	snackbar.style.backgroundColor = bg_color
	// color bar
	const color_bar = document.createElement('div')
	color_bar.className = "color-bar"
	color_bar.style.backgroundColor = color
	// icon
	const ico = document.createElement('div')
	ico.className = "icon"
	ico.innerHTML = icon
	ico.style.color = color
	// context
	const content = document.createElement('div')
	content.className = "content"
	content.textContent = context
	// appned
	snackbar.appendChild(color_bar)
	snackbar.appendChild(ico)
	snackbar.appendChild(content)
	// close
	if (close) {
		const close_btn = document.createElement('div')
		close_btn.className = "close"
		close_btn.style.backgroundColor = bg_color
		close_btn.addEventListener('click', function () {
			this.parentElement.remove()
		})
		snackbar.appendChild(close_btn)
	}
	snackbar_box.insertAdjacentElement('afterbegin', snackbar)
	setTimeout(() => {
		snackbar.remove()
	}, timer)
}