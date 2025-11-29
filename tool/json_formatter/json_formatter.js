/* - import ------------------------------------------------------------------------------------ */
import structure from "/module/structure.js"
/* - const ------------------------------------------------------------------------------------- */
const format_structure = {
	indent_type: {
		display_name: "インデントの種類", type: "select", option: {
			space: { display_name: "スペース", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, default: 2 } } },
			tab: { display_name: "タブ", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, default: 1 } } },
			other: { display_name: "その他の文字", children: { indent_text: { display_name: "文字", type: "string" } } },
			no_indent: { display_name: "インデントしない", children: {} }
		}
	}
}
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
/* - init -------------------------------------------------------------------------------------- */
set_input_file()
structure.def_struct("format", format_structure)
structure.set("input-format-structure", "format")
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("input-json-area").addEventListener('input', set_input_file_name)
document.getElementById("execute").addEventListener('click', execute)
/* - function ---------------------------------------------------------------------------------- */
// input
function file_to_json() {
	const file = this.files[0]
	if (!file) return
	const reader = new FileReader()
	reader.readAsText(file)
	reader.addEventListener('load', function () {
		document.getElementById("input-json-area").value = this.result
		set_input_file_name(file.name)
	})
	this.remove()
	set_input_file()
}
function set_input_file() {
	const input_json_file = document.createElement('input')
	input_json_file.id = "input-json-file"
	input_json_file.type = "file"
	input_json_file.accept = ".json"
	input_json_file.addEventListener('change', file_to_json)
	document.getElementById("input-json-label").appendChild(input_json_file)
}
function set_input_file_name(name) {
	if (typeof (name) !== "string") { name = "" }
	document.getElementById("input-json-file-name").textContent = name
}
// output
function execute() {
	const input_validity = document.getElementById("input-validity")
	const output_field = document.getElementById("output-field")
	reset_output()
	const json = parse_json(document.getElementById("input-json-area").value)
	if (json.status === "error") {
		input_validity.textContent = "Error"
		output_field.textContent = json.value
		return
	}
	const format_data = structure.get("input-format-structure").format
	const indent_type = format_data.indent_type
	let result
	if (indent_type === "space") {
		result = JSON.stringify(json.value, null, format_data.indent_count)
	} else if (indent_type === "tab") {
		result = JSON.stringify(json.value, null, "\t".repeat(format_data.indent_count))
	} else if (indent_type === "other") {
		result = JSON.stringify(json.value, null, format_data.indent_text)
	} else if (indent_type === "no_indent") {
		result = JSON.stringify(json.value)
	}
	input_validity.textContent = "OK"
	output_field.innerText = result
}
function parse_json(json) {
	try {
		return { status: "success", value: JSON.parse(json) }
	} catch (err) {
		return { status: "error", value: err }
	}
}
function reset_output() {
	document.getElementById("input-validity").textContent = ""
	document.getElementById("output-field").textContent = ""
}
/* --------------------------------------------------------------------------------------------- */