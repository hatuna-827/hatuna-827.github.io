"use strict"
import obj_manip from "/module/obj_manip.js"
let structs = {}
let structs_UUID = {}
document.head.insertAdjacentHTML('afterbegin', `<link rel="stylesheet" href="${URL.parse("./structure.css", import.meta.url)}">`)
function def_struct(name, struct) {
	if (name === undefined) { error(`|Structure module| Not enough arguments (def_struct > name)`) }
	if (struct === undefined) { error(`|Structure module| Not enough arguments (def_struct > struct name:${name})`) }
	structs[name] = struct
}
function set(id, struct_name, change_func) {
	if (id === undefined) { error(`|Structure module| Not enough arguments (set > id)`) }
	if (struct_name === undefined) { error(`|Structure module| Not enough arguments (set > struct_name id:${id})`) }
	const pos = document.getElementById(id)
	if (pos === null) { error(`|Structure module| No element found with this id (${id})`) }
	const struct = structs[struct_name]
	if (struct === undefined) { error(`|Structure module| No struct found with this struct name (${struct_name})`) }
	const render_box = document.createElement('div')
	render_box.className = "structure"
	if (change_func === undefined) { change_func = function () { } }
	add_field(render_box, struct, [id, struct_name], change_func)
	pos.appendChild(render_box)
}
function generate_field(tag, type) {
	const field = document.createElement(tag)
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
			const field = generate_field('label', type)
			add_title(field, type, name, display_name)
			add_input(field, value, [...path, name], change_func)
			pos.appendChild(field)
		} else if (["boolean", "toggle", "list", "object", "select"].includes(type)) {
			const field = generate_field('div', type)
			add_title(field, type, name, display_name)
			add_input(field, value, [...path, name], change_func)
			pos.appendChild(field)
		} else if (type === "reference") {
			if (value.name === undefined) { error(`|Structure module| No name found in reference`) }
			if (structs[value.name] === undefined) { error(`|Structure module| No struct found with this name (${value.name})`) }
			const field = generate_field('div', type)
			add_field(field, structs[value.name], path, change_func)
			pos.appendChild(field)
		} else {
			error(`|Structure module| No type found in this name (${name})`, value)
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
				this.classList.remove("structure-invalid")
			} else {
				this.classList.add("structure-invalid")
			}
			change_func()
		})
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
		if (default_value !== undefined) { input.value = default_value }
		if (pattern !== undefined) { input.pattern = pattern }
		if (placeholder !== undefined) { input.placeholder = placeholder }
		obj_manip.set(structs_UUID, path, field_UUID)
		pos.appendChild(input)
	} else if (type === "boolean") {
		const field_UUID = crypto.randomUUID()
		const default_value = value.default
		const input = document.createElement('div')
		input.className = "structure-boolean structure-input"
		const checkbox = document.createElement('input')
		checkbox.id = field_UUID
		checkbox.className = "structure-boolean structure-checkbox"
		checkbox.type = "checkbox"
		if (default_value !== undefined) { checkbox.checked = default_value }
		const true_btn = document.createElement('div')
		true_btn.className = "structure-true-btn"
		true_btn.textContent = "True"
		true_btn.addEventListener('click', function () {
			checkbox.checked = true
			change_func()
		})
		const false_btn = document.createElement('div')
		false_btn.className = "structure-false-btn"
		false_btn.textContent = "false"
		false_btn.addEventListener('click', function () {
			checkbox.checked = false
			change_func()
		})
		obj_manip.set(structs_UUID, path, field_UUID)
		input.appendChild(checkbox)
		input.appendChild(true_btn)
		input.appendChild(false_btn)
		pos.appendChild(input)
	} else if (type === "toggle") {
		const children = value.children
		if (children === undefined) { error(`|Structure module| No children found in toggle`, value) }
		const default_value = value.default
		const field = document.createElement('div')
		field.className = "structure-toggle structure-input"
		const input = document.createElement('input')
		input.className = "structure-toggle structure-checkbox"
		input.type = "checkbox"
		if (default_value !== undefined) { input.checked = default_value }
		const btn = document.createElement('div')
		btn.className = "structure-toggle structure-toggle-btn"
		btn.addEventListener('click', function () {
			input.checked = !input.checked
			if (input.checked) {
				add_input(field, children, path, change_func)
			} else {
				field.innerHTML = ""
				obj_manip.set(structs_UUID, path, null)
			}
			change_func()
		})
		obj_manip.set(structs_UUID, path, null)
		if (default_value === true) { add_input(field, children, path, change_func) }
		pos.appendChild(input)
		pos.appendChild(btn)
		pos.appendChild(field)
	} else if (type === "list") {
		const children = value.children
		if (children === undefined) { error(`|Structure module| No children found in list`, value) }
		const field_UUID = crypto.randomUUID()
		const min = value.min
		const max = value.max
		const nest = document.createElement('div')
		nest.className = "structure-list structure-nest"
		const btn_data = [
			{ class: "begin", where: "afterbegin" },
			{ class: "end", where: "beforeend" },
		]
		btn_data.forEach((data) => {
			data.element = document.createElement('div')
			data.element.className = `structure-list structure-add-btn structure-add-${data.class}`
			data.element.addEventListener('click', function () {
				if (nest.childElementCount >= max) { return }
				const remove_field = document.createElement('div')
				remove_field.className = `structure-${children.type} structure-field`
				const remove_btn = document.createElement('div')
				remove_btn.className = `structure-${children.type} structure-remove-btn structure-title`
				remove_btn.addEventListener('click', function () {
					if (nest.childElementCount <= min) { return }
					const target_UUID = obj_manip.get(structs_UUID, field_UUID).splice(Array.from(nest.children).indexOf(remove_field), 1)
					remove_UUID(target_UUID)
					remove_field.remove()
					change_func()
				})
				remove_field.appendChild(remove_btn)
				if (data.class === "begin") { obj_manip.get(structs_UUID, field_UUID).splice(0, 0, "") }
				add_input(remove_field, children, [field_UUID, data.class === "begin" ? 0 : nest.childElementCount], change_func)
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
		const children = value.children
		if (children === undefined) { error(`|Structure module| No children found in object`, value) }
		const nest = document.createElement('div')
		nest.className = "structure-object structure-nest"
		pos.appendChild(nest)
		obj_manip.set(structs_UUID, path, {})
		add_field(nest, children, path, change_func)
	} else if (type === "select") {
		const field_UUID = crypto.randomUUID()
		let options = value.option
		if (options === undefined) { error(`|Structure module| No option found in select`, value) }
		if (Array.isArray(options)) { options = Object.fromEntries(options.map(key => [key, {}])) }
		const option_keys = Object.keys(options)
		if (option_keys.length === 0) { error(`|Structure module| No option found in select`, value) }
		const field = document.createElement('div')
		field.className = "structure-select structure-field"
		obj_manip.set(structs_UUID, [...path, "children"], {})
		if (option_keys.length === 1) {
			const children = options[option_keys[0]].children
			if (children === undefined) { error(`|Structure module| No children found in option`, value) }
			const default_value = value.default
			const input = document.createElement('input')
			input.id = field_UUID
			input.className = "structure-select structure-checkbox"
			input.type = "checkbox"
			if (default_value !== undefined) { input.checked = default_value }
			const btn = document.createElement('div')
			btn.className = "structure-select structure-select-btn"
			btn.addEventListener('click', function () {
				input.checked = !input.checked
				obj_manip.set(structs_UUID, [...path, "children"], {})
				field.innerHTML = ""
				if (input.checked === true) { add_field(field, children.children, [...path, "children"], change_func) }
				change_func()
			})
			if (default_value === true) { add_field(field, children.children, [...path, "children"], change_func) }
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
				obj_manip.set(structs_UUID, [...path, "children"], {})
				field.innerHTML = ""
				if (options[this.value].children !== undefined) { add_field(field, options[this.value].children, [...path, "children"], change_func) }
				change_func()
			})
			if (options[input.value].children !== undefined) { add_field(field, options[input.value].children, [...path, "children"], change_func) }
			pos.appendChild(input)
		}
		obj_manip.set(structs_UUID, [...path, "STRUCTURE_FLAG"], "select")
		obj_manip.set(structs_UUID, [...path, "value"], field_UUID)
		pos.appendChild(field)
	} else if (type === "reference") {
		const name = value.name
		if (name === undefined) { error(`|Structure module| No name found in reference`, value) }
		if (structs[name] === undefined) { error(`|Structure module| No struct found with this name (${name})`) }
		const field = document.createElement('div')
		field.className = "structure-reference structure-field"
		add_input(field, { type: "object", children: structs[name] }, path, change_func)
		pos.appendChild(field)
	} else {
		error(`|Structure module| No type found in children`, value)
	}
}
function remove_UUID(target) {
	Object.values(target).forEach((value) => {
		if (typeof (value) === "string") {
			if (Object.keys(structs_UUID).includes(value)) {
				remove_UUID(structs_UUID[value])
				obj_manip.remove(structs_UUID, value)
			}
		} else if (value !== null) {
			remove_UUID(value)
		}
	})
}
function get(id) {
	if (id === undefined) { error(`|Structure module| Not enough arguments (get > id)`) }
	const structs = JSON.parse(JSON.stringify(structs_UUID))
	const list_keys = Object.keys(structs)
	if (!list_keys.includes(id)) { error(`|Structure module| No id found (get > ${id})`) }
	return replace_UUID(structs, structs[id], list_keys, id)
}
function replace_UUID(structs, struct, list_keys) {
	Object.keys(struct).forEach((name) => {
		const value = struct[name]
		if (value === null) {
			delete struct[name]
			return
		}
		if (typeof (value) === "string") {
			if (list_keys.includes(value)) {
				struct[name] = replace_UUID(structs, structs[value], list_keys)
				return
			}
			const target = document.getElementById(value)
			struct[name] = replace_UUID_value(target)
		} else {
			const STRUCTURE_FLAG = value.STRUCTURE_FLAG
			if (STRUCTURE_FLAG !== undefined) {
				if (STRUCTURE_FLAG === "select") {
					struct[name] = replace_UUID_value(document.getElementById(value.value))
					if (value.children !== undefined) {
						const children = replace_UUID(structs, value.children, list_keys)
						struct = { ...struct, ...children }
					}
				}
				return
			}
			struct[name] = replace_UUID(structs, value, list_keys)
		}
	})
	return struct
}
function replace_UUID_value(target) {
	const type = target.type
	if (target.tagName === "SELECT" || type === "text") {
		return target.value
	} else if (type === "number") {
		return Number(target.value)
	} else if (type === "checkbox") {
		return target.checked
	}
}
function error(...message) {
	console.error(...message)
	throw new Error()
}
export default { set, def_struct, get }

// const struct = [
// 	{ type: "string", display_name: "", min: 0, max: 0, default: "", pattern: "", placeholder: "" },
// 	{ type: "number", display_name: "", min: 0, max: 0, step: 0, default: 0, pattern: "", placeholder: "" },
// 	{ type: "boolean", display_name: "", default: false },
// 	{ type: "toggle", display_name: "", children: struct, default: false },
// 	{ type: "list", display_name: "", children: struct, min: 0, max: 0 },
// 	{ type: "object", display_name: "", children: { name: struct } },
// 	{ type: "select", display_name: "", default: false, option: { option_name: { display_name: "", children: { name: struct } } } },
// 	{ type: "select", display_name: "", option: [option_name] },
// 	{ type: "reference", name: struct_name }
// ]
// const example = { name: struct }

// This name cannot be used : STRUCTURE_FLAG