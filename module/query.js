"use strict"
export function query(name) {
	const src = location.href
	const result = new Object()
	if (!src.includes('?')) {
		if (name != null) { return result[name] }
		return result
	}
	const query = src.substring(src.indexOf('?') + 1)
	const parameters = query.split('&')
	parameters.forEach((parameter) => {
		const element = parameter.split('=')
		const key = decodeURIComponent(element[0])
		const value = decodeURIComponent(element[1])
		result[key] = value
	})
	if (name != null) { return result[name] }
	return result
}
// Object.fromEntries(new URLSearchParams(window.location.search).entries())