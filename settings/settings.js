// window.open("/settings/?p=***", '_blank', 'top=100,left=200,height=500,width=400,popup')
"use strict"
import reflect_setting from "/hatuna-827.js"
import query from "/module/query.js"
import storage from "/module/storage.js"
const page = query("p")
if (!window.opener) {
	window.open("/link", "_self")
}
if (page && page == "svg_editor") {
	/* - const ------------------------------------------------------------------------------------- */
	const storage_key = "svg-editor-setting"
	const setting = document.getElementById("setting")
	const default_settings = { hide_homebar: false }
	let settings = { ...default_settings, ...storage.get(storage_key) }
	/* - init -------------------------------------------------------------------------------------- */
	storage.set(storage_key, settings)
	document.querySelector('title').textContent = "設定 - SVGエディター | hatuna-827"
	setting.innerHTML = "<label><span class='reco'>ホームバーを非表示</span><input type='checkbox' id='hide-homebar'></label><br><hr><br><button class='center' id='all-reset'>全てリセット</button>"
	document.getElementById("hide-homebar").checked = settings.hide_homebar
	/* - add eventListener ------------------------------------------------------------------------- */
	document.getElementById("hide-homebar").addEventListener('click', function () {
		storage.modify(storage_key, "hide_homebar", this.checked)
	})
	document.getElementById("all-reset").addEventListener('click', () => {
		storage.set(storage_key, default_settings)
		window.location.reload()
	})
	/* --------------------------------------------------------------------------------------------- */
} else {
	/* - const ------------------------------------------------------------------------------------- */
	const storage_key = "site-setting"
	const default_settings = { theme: "device" }
	let settings = { ...default_settings, ...storage.get(storage_key) }
	/* - init -------------------------------------------------------------------------------------- */
	reflect_setting()
	storage.set(storage_key, settings)
	document.getElementById("theme-" + settings.theme).checked = true
	/* - add eventListener ------------------------------------------------------------------------- */
	document.querySelectorAll("[name=theme]").forEach(radio => {
		radio.addEventListener('click', function () {
			storage.modify(storage_key, "theme", this.dataset.value)
			reflect_setting()
		})
	})
	document.getElementById("all-reset").addEventListener('click', () => {
		storage.set(storage_key, default_settings)
		reflect_setting()
		window.location.reload()
	})
	/* --------------------------------------------------------------------------------------------- */
}
