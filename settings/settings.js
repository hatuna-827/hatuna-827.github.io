// window.open("/settings/", '_blank', 'top=100,left=200,height=500,width=400,popup')
"use strict"
/* - import ------------------------------------------------------------------------------------ */
import { reflect_setting } from "/hatuna-827.js"
import { storage } from "/module/storage.js"
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
