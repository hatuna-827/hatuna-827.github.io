// window.open("/settings/", '_blank', 'top=100,left=200,height=500,width=400,popup')
"use strict"
/* - import ------------------------------------------------------------------------------------ */
import { storage } from "/module/storage.js"
/* - const ------------------------------------------------------------------------------------- */
const storage_key = "svg-editor-setting"
const default_settings = { hide_homebar: false, views: "easy" }
let settings = { ...default_settings, ...storage.get(storage_key) }
/* - init -------------------------------------------------------------------------------------- */
storage.set(storage_key, settings)
document.querySelector('title').textContent = "設定 - SVGエディター | hatuna-827"
document.getElementById("hide-homebar").checked = settings.hide_homebar
document.getElementById("views").selectedIndex = settings.views === "easy" ? 0 : 1
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("hide-homebar").addEventListener('click', function () {
	storage.modify(storage_key, "hide_homebar", this.checked)
})
document.getElementById("views").addEventListener('change', function () {
	storage.modify(storage_key, "views", this.value)
})
document.getElementById("all-reset").addEventListener('click', () => {
	storage.set(storage_key, default_settings)
	window.location.reload()
})
/* --------------------------------------------------------------------------------------------- */