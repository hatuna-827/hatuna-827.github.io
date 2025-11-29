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
	const pos = document.getElementById(id)
	if (!pos) { throw new Error(`|Structure module| No element found with this id (${id})`) }
	const struct = structs[struct_name]
	if (struct === undefined) { throw new Error(`|Structure module| No struct found with this struct name (${struct_name})`) }
	const render_box = document.createElement('div')
	render_box.className = "structure"
	if (change_func === undefined) { change_func = function () { } }
	add_field(render_box, struct, [id, struct_name], change_func)
	pos.appendChild(render_box)
}
function generate_field(tag, type, name) {
	const field = document.createElement(tag)
	field.id = name
	field.className = `structure-${type} structure-field`
	return field
}
function add_title(field, type, name, display_name) {
	const title = document.createElement('span')
	title.className = `structure-${type} structure-title`
	title.textContent = display_name === undefined ? name : display_name
	field.appendChild(title)
}
function add_field(pos, struct, path, change_func) {
	Object.keys(struct).forEach((name) => {
		const value = struct[name]
		const type = value.type
		const display_name = value.display_name
		if (["string", "number"].includes(type)) {
			const field = generate_field('label', type, name)
			add_title(field, type, name, display_name)
			add_input(field, value, [...path, name], change_func)
			pos.appendChild(field)
		} else if (["boolean", "toggle", "list", "object", "select"].includes(type)) {
			const field = generate_field('div', type, name)
			add_title(field, type, name, display_name)
			add_input(field, value, [...path, name], change_func)
			pos.appendChild(field)
		} else if (type === "reference") {
			const field = generate_field('div', type, name)
			add_field(field, structs[value.name], path, change_func)
			pos.appendChild(field)
		} else {
			console.error(`type is not defined (in ${name})`, value)
		}
	})
}
function add_input(pos, value, path, change_func) {
	const type = value.type
	if (["string", "number"].includes(type)) {
		const field_UUID = crypto.randomUUID()
		const min = value.min
		const max = value.max
		const default_value = value.default
		const pattern = value.pattern
		const placeholder = value.placeholder
		const input = document.createElement('input')
		input.id = field_UUID
		input.className = `structure-${type} structure-input`
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
		if (placeholder !== undefined) { input.placeholder = placeholder }
		if (type === "string") {
			input.type = "text"
			input.spellcheck = false
			if (min !== undefined) { input.minLength = min }
			if (max !== undefined) { input.maxLength = max }
		} else if (type === "number") {
			const step = value.step
			input.type = "number"
			if (min !== undefined) { input.min = min }
			if (max !== undefined) { input.max = max }
			if (step !== undefined) { input.step = step }
		}
		obj_manip.set(structs_UUID, path, field_UUID)
		pos.appendChild(input)
	} else if (type === "boolean") {
		const field_UUID = crypto.randomUUID()
		const default_value = value.default
		const input = document.createElement('div')
		input.className = "structure-boolean structure-input"
		const checkbox = document.createElement('input')
		checkbox.id = field_UUID
		checkbox.className = "structure-checkbox"
		checkbox.type = "checkbox"
		if (default_value !== undefined) { input.checked = default_value }
		const true_btn = document.createElement('div')
		true_btn.className = "structure-true-btn"
		true_btn.addEventListener('click', function () {
			this.parentElement.querySelector('input').checked = true
			change_func()
		})
		const false_btn = document.createElement('div')
		false_btn.className = "structure-false-btn"
		false_btn.addEventListener('click', function () {
			this.parentElement.querySelector('input').checked = false
			change_func()
		})
		obj_manip.set(structs_UUID, path, field_UUID)
		input.appendChild(checkbox)
		input.appendChild(true_btn)
		input.appendChild(false_btn)
		pos.appendChild(input)
	} else if (type === "toggle") {
		const default_value = value.default
		const field = document.createElement('div')
		field.className = "structure-toggle structure-field"
		const input = document.createElement('input')
		input.className = "structure-toggle structure-checkbox"
		input.type = "checkbox"
		if (default_value !== undefined) { input.checked = default_value }
		const btn = document.createElement('div')
		btn.className = "structure-toggle structure-toggle-btn"
		btn.addEventListener('click', function () {
			input.checked = !input.checked
			if (input.checked) {
				add_input(field, value.children, path, change_func)
			} else {
				field.innerHTML = ""
				obj_manip.set(structs_UUID, path, null)
			}
			change_func()
		})
		obj_manip.set(structs_UUID, path, null)
		pos.appendChild(input)
		pos.appendChild(btn)
		pos.appendChild(field)
		if (input.checked) { add_input(field, value.children, path, change_func) }
	} else if (type === "list") {
		const field_UUID = crypto.randomUUID()
		const min = value.min
		const max = value.max
		const nest = document.createElement('div')
		nest.className = "structure-list structure-nest"
		const btn_data = [
			{ class: "begin", unshift: true, where: "afterbegin" },
			{ class: "end", unshift: false, where: "beforeend" },
		]
		btn_data.forEach((data) => {
			data.element = document.createElement('div')
			data.element.className = `structure-list structure-add-btn structure-add-${data.class}`
			data.element.addEventListener('click', function () {
				if (nest.childElementCount >= max) { return }
				const remove_field = document.createElement('div')
				remove_field.className = `structure-${value.children.type} structure-field`
				const remove_btn = document.createElement('div')
				remove_btn.className = `structure-${value.children.type} structure-remove-btn structure-title`
				remove_btn.addEventListener('click', function () {
					if (nest.childElementCount <= min) { return }
					obj_manip.remove(structs_UUID, [field_UUID, Array.from(nest.children).indexOf(remove_field)])
					this.parentElement.remove()
					change_func()
				})
				remove_field.appendChild(remove_btn)
				if (data.unshift) { obj_manip.get(structs_UUID, field_UUID).unshift("") }
				add_input(remove_field, value.children, [field_UUID, data.class === "begin" ? 0 : nest.childElementCount], change_func)
				nest.insertAdjacentElement(data.where, remove_field)
				change_func()
			})
		})
		obj_manip.set(structs_UUID, path, field_UUID)
		obj_manip.set(structs_UUID, [field_UUID], [])
		pos.appendChild(btn_data[0].element)
		pos.appendChild(nest)
		pos.appendChild(btn_data[1].element)
		for (let i = 0; i < min; i++) { btn_data[1].element.click() }
	} else if (type === "object") {
		const nest = document.createElement('div')
		nest.className = "structure-object structure-nest"
		pos.appendChild(nest)
		obj_manip.set(structs_UUID, path, {})
		add_field(nest, value.children, path, change_func)
	} else if (type === "select") {
		const field_UUID = crypto.randomUUID()
		let options = value.option
		if (Array.isArray(options)) { options = Object.fromEntries(options.map(key => [key, {}])) }
		const option_keys = Object.keys(options)
		const field = document.createElement('div')
		field.className = "structure-select structure-field"
		if (option_keys.length === 1) {
			const input = document.createElement('input')
			input.id = field_UUID
			input.className = "structure-select structure-checkbox"
			input.type = "checkbox"
			const btn = document.createElement('div')
			btn.className = "structure-select structure-select-btn"
			btn.addEventListener('click', function () {
				input.checked = !input.checked
				if (input.checked) {
					add_field(field, options[option_keys[0]].children, path.slice(0, -1), change_func)
				} else {
					field.innerHTML = ""
				}
				change_func()
			})
			pos.appendChild(input)
			pos.appendChild(btn)
		} else {
			const input = document.createElement('select')
			input.id = field_UUID
			input.className = "structure-select structure-input"
			option_keys.forEach((name) => {
				const display_name = options[name].display_name
				const option = document.createElement('option')
				option.className = "structure-option"
				option.value = name
				option.textContent = name
				if (display_name !== undefined) { option.textContent = display_name }
				input.appendChild(option)
			})
			input.addEventListener('change', function () {
				field.innerHTML = ""
				if (options[this.value].children) { add_field(field, options[this.value].children, path.slice(0, -1), change_func) }
				change_func()
			})
			if (options[input.value].children) { add_field(field, options[input.value].children, path.slice(0, -1), change_func) }
			pos.appendChild(input)
		}
		obj_manip.set(structs_UUID, path, field_UUID)
		pos.appendChild(field)
	} else if (type === "reference") {
		const field = document.createElement('div')
		field.id = value.name
		field.className = "structure-reference structure-field"
		pos.appendChild(field)
		add_input(field, { type: "object", children: structs[value.name] }, path, change_func)
	} else {
		console.error("type is not defined", value)
	}
}
function get(id) {
	const structs = JSON.parse(JSON.stringify(structs_UUID))
	const list_keys = Object.keys(structs)
	let struct = JSON.parse(JSON.stringify(structs[id]))
	return replace_UUID(structs, struct, list_keys)
}
function replace_UUID(structs, struct, list_keys) {
	Object.keys(struct).forEach((name) => {
		const value = struct[name]
		if (typeof (value) === "string" || value === null) {
			if (list_keys.includes(value)) {
				struct[name] = replace_UUID(structs, structs[value], list_keys)
				return
			}
			const target = document.getElementById(value)
			if (target === null) {
				struct[name] = null
				return
			}
			const type = target.type
			if (target.tagName === "SELECT" || type === "text") {
				struct[name] = target.value
			} else if (type === "number") {
				struct[name] = Number(target.value)
			} else if (type === "checkbox") {
				struct[name] = target.checked
			}
		} else {
			struct[name] = replace_UUID(structs, value, list_keys)
		}
	})
	return struct
}
export default { set, def_struct, get }

// const struct = [
// 	{ type: "string", display_name: "", min: 0, max: 0, default: "", pattern: "", placeholder: "" },
// 	{ type: "number", display_name: "", min: 0, max: 0, step: 0, default: 0, pattern: "", placeholder: "" },
// 	{ type: "boolean", display_name: "", default: false },
// 	{ type: "toggle", display_name: "", children: struct, default: false },
// 	{ type: "list", display_name: "", children: struct, min: 0, max: 0 },
// 	{ type: "object", display_name: "", children: { name: struct } },
// 	{ type: "select", display_name: "", option: { option_name: { display_name: "", children: { name: struct } } } },
// 	{ type: "select", display_name: "", option: [option_name] },
// 	{ type: "reference", name: struct_name }
// ]
// const example = { name: struct }