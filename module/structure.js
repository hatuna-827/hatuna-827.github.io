"use strict"
import obj_manip from "/module/obj_manip.js"
let structs = {}
let structs_UUID = {}
document.head.insertAdjacentHTML('afterbegin', `<link rel="stylesheet" href="${URL.parse("./structure.css", import.meta.url)}">`)
function def_struct(name, struct) {
	if (struct === undefined) { throw new Error("|Structure module| Not enough arguments") }
	structs[name] = struct
}
function set(id, struct_name, change_func) {
	const render_box = document.getElementById(id)
	if (!render_box) { throw new Error(`|Structure module| No element found with this id (${id})`) }
	const struct = structs[struct_name]
	render_box.classList.add("structure")
	add_field(render_box, struct, [id, struct_name], change_func)
}
function add_field(pos, struct, path, change_func) {
	Object.keys(struct).forEach((name) => {
		const value = struct[name]
		const type = value.type
		if (type == "string" || type == "number") {
			const min = value.min
			const max = value.max
			const default_value = value.default
			const pattern = value.pattern
			const field_UUID = crypto.randomUUID()
			const field = document.createElement('label')
			field.id = name
			field.className = `${type} field`
			const title = document.createElement('span')
			title.className = `${type} title`
			title.textContent = name
			const input = document.createElement('input')
			input.id = field_UUID
			input.className = `${type} input`
			input.addEventListener('input', function () {
				if (this.checkValidity()) {
					this.classList.remove("invalid")
					change_func()
				} else {
					this.classList.add("invalid")
				}
			})
			if (default_value !== undefined) { input.value = default_value }
			if (pattern !== undefined) { input.pattern = pattern }
			if (type == "string") {
				input.type = "text"
				input.spellcheck = false
				if (min !== undefined) { input.minLength = min }
				if (max !== undefined) { input.maxLength = max }
			} else if (type == "number") {
				const step = value.step
				input.type = "number"
				if (min !== undefined) { input.min = min }
				if (max !== undefined) { input.max = max }
				if (step !== undefined) { input.step = step }
			}
			obj_manip.set(structs_UUID, [...path, name], field_UUID)
			field.appendChild(title)
			field.appendChild(input)
			pos.appendChild(field)
		} else if (type == "boolean") {
			const default_value = value.default
			const field_UUID = crypto.randomUUID()
			const field = document.createElement('div')
			field.id = name
			field.className = "boolean field"
			const title = document.createElement('span')
			title.className = "boolean title"
			title.textContent = name
			const input = document.createElement('input')
			input.id = field_UUID
			input.className = "boolean input"
			input.type = "checkbox"
			if (default_value !== undefined) { input.checked = default_value }
			const true_btn = document.createElement('div')
			true_btn.className = "true-btn"
			true_btn.addEventListener('click', function () {
				this.parentElement.querySelector('input').checked = true
			})
			const false_btn = document.createElement('div')
			false_btn.className = "false-btn"
			false_btn.addEventListener('click', function () {
				this.parentElement.querySelector('input').checked = false
			})
			obj_manip.set(structs_UUID, [...path, name], field_UUID)
			field.appendChild(title)
			field.appendChild(input)
			field.appendChild(true_btn)
			field.appendChild(false_btn)
			pos.appendChild(field)
		} else if (type == "list") {
			const field = document.createElement('div')
			field.id = name
			field.className = "list field"
			const title_add = document.createElement('div')
			title_add.className = "list title-add"
			const title = document.createElement('span')
			title.className = "list title"
			title.textContent = name
			const nest = document.createElement('div')
			nest.className = "list nest"
			const add_btn = document.createElement('div')
			add_btn.className = "list add-btn"
			add_btn.addEventListener('click', function () {
				const remove_btn = document.createElement('div')
				const index = nest.childElementCount / 2
				remove_btn.className = "list remove-btn"
				nest.appendChild(remove_btn)
				obj_manip.set(structs_UUID, [...path, name, index], {})
				add_field(nest, { [Object.keys(value.children)[0]]: Object.values(value.children)[0] }, [...path, name, index], change_func)
			})
			obj_manip.set(structs_UUID, [...path, name], [])
			title_add.appendChild(title)
			title_add.appendChild(add_btn)
			field.appendChild(title_add)
			field.appendChild(nest)
			pos.appendChild(field)
		} else if (type == "object") {
			const field = document.createElement('div')
			field.id = name
			field.className = "object field"
			const title = document.createElement('span')
			title.className = "object title"
			title.textContent = name
			const nest = document.createElement('div')
			nest.className = "object nest"
			field.appendChild(title)
			field.appendChild(nest)
			pos.appendChild(field)
			add_field(nest, value.children, [...path, name], change_func)
		} else if (type == "select") {
		} else if (type == "reference") {
			const field = document.createElement('div')
			field.id = name
			field.className = "reference"
			pos.appendChild(field)
			add_field(field, structs[value.name], path, change_func)
		} else {
			console.error(`type is not defined (in ${path},${name})`)
		}
	})
}
function get(id) {
	let struct = JSON.parse(JSON.stringify(structs_UUID[id]))
	return replace_UUID(struct)
}
function replace_UUID(struct) {
	Object.keys(struct).forEach((name) => {
		const value = struct[name]
		if (typeof (value) == "string") {
			const target = document.getElementById(value)
			const type = target.type
			if (type == "text") {
				struct[name] = target.value
			} else if (type == "number") {
				struct[name] = Number(target.value)
			} else if (type == "checkbox") {
				struct[name] = target.checked
			} else {
				struct[name] = null
			}
		} else {
			struct[name] = replace_UUID(value)
		}
	})
	return struct
}
export default { set, def_struct, get }

// const struct = [
// 	{ type: "string", min: 0, max: 0, default: "", pattern: "" },
// 	{ type: "number", min: 0, max: 0, step: 0, default: 0, pattern: "" },
// 	{ type: "boolean", default: true },
// 	{ type: "list", children: struct, max: 0, min: 0 },
// 	{ type: "object", children: { name: struct } },
// 	{ type: "select", option: { name: struct } },
// 	{ type: "reference", name: struct_name }
// ]
// const example = { name: struct }