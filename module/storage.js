"use strict"
import obj_manip from "/module/obj_manip.js"
export function get(key) {
	try {
		return JSON.parse(localStorage.getItem(key))
	} catch {
		return null
	}
}
export function set(key, value) {
	if (key === undefined) {
		throw new Error("|Storage module| Not enough arguments")
	}
	localStorage.setItem(key, JSON.stringify(value))
	return
}
export function modify(key, path, value) {
	if (key === undefined || path === undefined) {
		throw new Error("|Storage module| Not enough arguments")
	}
	set(key, obj_manip.modify(get(key), path, value))
	return
}
export function remove(key, path) {
	if (key === undefined) {
		throw new Error("|Storage module| Not enough arguments")
	}
	if (path === undefined) {
		localStorage.removeItem(key)
		return
	}
	localStorage.setItem(key, JSON.stringify(obj_manip.remove(JSON.parse(localStorage.getItem(key)), path)))
	return
}

export default { get, set, modify, remove }
