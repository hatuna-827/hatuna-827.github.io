/* - import ------------------------------------------------------------------------------------ */
import structure from "/module/structure.js"
/* - const ------------------------------------------------------------------------------------- */
const format_structure = {
	indent_type: {
		display_name: "インデントの種類", type: "select", option: {
			space: { display_name: "スペース", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, max: 10, default: 2, placeholder: "0~10" } } },
			tab: { display_name: "タブ", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, max: 10, default: 1, placeholder: "0~10" } } },
			no_indent: { display_name: "インデントしない", children: {} },
			other: { display_name: "その他の文字列", children: { indent_text: { display_name: "インデント文字列", max: 10, type: "string", placeholder: "0~10文字" } } }
		}
	},
	structure: {
		display_name: "構造", type: "select", option: {
			no: { display_name: "指定しない" },
			text: { display_name: "指定する (TEXT/推奨)" },
			gui: { display_name: "指定する (GUI)" }
		}
	}
}
const gui_structure = {
	top_type: {
		type: "select", display_name: "トップレベルの構造", option: {
			object: {
				display_name: "オブジェクト", children: {
					object: { type: "reference", name: "object_children" }
				}
			},
			array: {
				display_name: "リスト", children: {
					array: { type: "reference", name: "array_children" }
				}
			}
		}
	},
}
const entry_structure = {
	entry: {
		type: "list", display_name: "エントリー", children: {
			type: "object", children: {
				key: { type: "string", display_name: "プロパティ名", placeholder: "(必須)" },
				type: { type: "reference", name: "select_type" }
			}
		}
	}
}
const select_type_structure = {
	type: {
		type: "select", display_name: "型", option: {
			string: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "string" } } } },
			number: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "number" } } } },
			object: { children: { object: { type: "reference", name: "object_children" } } },
			array: {
				children: {
					defalut: { type: "boolean", display_name: "デフォルトで空配列を設定する" },
					array: { type: "reference", name: "array_children" }
				}
			},
			bool: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "boolean" } } } },
			null: { children: {} }
		}
	}
}
const object_children_structure = {
	sort: { type: "boolean", display_name: "自動ソート" },
	entry: { type: "reference", name: "entry" }
}
const array_children_structure = {
	children: {
		type: "object", display_name: "要素", children: {
			entry: { type: "reference", name: "select_type" }
		}
	}
}
/* - init -------------------------------------------------------------------------------------- */
set_input_file()
set_format_input_file()
structure.def_struct("format", format_structure)
structure.def_struct("gui", gui_structure)
structure.def_struct("entry", entry_structure)
structure.def_struct("select_type", select_type_structure)
structure.def_struct("object_children", object_children_structure)
structure.def_struct("array_children", array_children_structure)
structure.set("input-format-structure", "format", change_format)
structure.set("input-format-gui-structure", "gui", change_format_gui)
change_format()
change_format_gui()

document.querySelectorAll(".textarea-copy-download").forEach((element) => {
	const button_box = document.createElement('div')
	button_box.className = "copy-download-box"
	const download_button = document.createElement('div')
	download_button.className = "download-button button"
	download_button.textContent = "ダウンロード"
	const copy_button = document.createElement('div')
	copy_button.className = "copy-button button"
	copy_button.textContent = "コピー"
	download_button.addEventListener('click', function () {
		const download = document.createElement('a')
		download.setAttribute('download', "download.json")
		const content = `data:application/json;base64,${btoa(element.value || element.textContent)}`
		download.setAttribute('href', content)
		download.click()
		clicked(this)
	})
	copy_button.addEventListener('click', function () {
		navigator.clipboard.writeText(element.value || element.textContent)
		clicked(this)
	})
	button_box.appendChild(download_button)
	button_box.appendChild(copy_button)
	element.insertAdjacentElement('beforebegin', button_box)
})
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
// format
function file_to_format() {
	const file = this.files[0]
	if (!file) return
	const reader = new FileReader()
	reader.readAsText(file)
	reader.addEventListener('load', function () {
		document.getElementById("input-format-area").value = this.result
	})
	this.remove()
	set_format_input_file()
}
function set_format_input_file() {
	const input_format_file = document.createElement('input')
	input_format_file.id = "input-format-text-file"
	input_format_file.type = "file"
	input_format_file.accept = ".txt,.json"
	input_format_file.addEventListener('change', file_to_format)
	document.getElementById("input-format-text-label").appendChild(input_format_file)
}
function change_format() {
	const format = structure.get("input-format-structure").format
	const text_format = document.getElementById("input-format-text")
	const gui_format = document.getElementById("input-format-gui")
	text_format.style.display = "none"
	gui_format.style.display = "none"
	if (format.structure === "no") {
	} else if (format.structure === "text") {
		text_format.style.display = "block"
	} else if (format.structure === "gui") {
		gui_format.style.display = "block"

	}
}
function change_format_gui() {
	document.getElementById("input-format-gui-area").textContent = JSON.stringify(structure.get("input-format-gui-structure").gui, null, 2)
}
// output
function execute() {
	const output_field = document.getElementById("output-field")
	reset_output()
	const json = parse_json(document.getElementById("input-json-area").value)
	if (json.status === "error") {
		set_result("error")
		log("入力されたJSONが無効です。")
		log(json.value)
		return
	}
	log("入力されたJSON：OK")

	const format_data = structure.get("input-format-structure").format
	let result = {}

	const structure_type = format_data.structure
	if (structure_type === "no") {
		result = json.value
	} else if (structure_type === "text") {
		const format_text_data = parse_json(document.getElementById("input-format-area").value)
		if (format_text_data.status === "error") {
			set_result("error")
			log("入力されたJSONの構造が無効です。")
			log(format_text_data.value)
			return
		}
		log("入力されたJSONの構造：有効")
	} else if (structure_type === "gui") {
		const format_gui_data = structure.get("input-format-gui-structure").gui
		console.log(format_gui_data)
	}

	const indent_type = format_data.indent_type
	if (indent_type === "space") {
		result = JSON.stringify(result, null, format_data.indent_count)
	} else if (indent_type === "tab") {
		result = JSON.stringify(result, null, "\t".repeat(format_data.indent_count))
	} else if (indent_type === "other") {
		result = JSON.stringify(result, null, format_data.indent_text)
	} else if (indent_type === "no_indent") {
		result = JSON.stringify(result)
	}
	set_result("sucess")
	output_field.textContent = result
}
function parse_json(json) {
	try {
		if (!/\S*\{/.test(json)) {
			return { status: "error", value: "JSONは'{'または'['で始まる必要があります。" }
		}
		return { status: "success", value: JSON.parse(json) }
	} catch (err) {
		return { status: "error", value: err }
	}
}
function filter_format_data(obj) {
	let result = {}
	const keys = Object.keys(obj)
	keys.forEach((key) => {
		const value = obj[key]
		if (value !== undefined && value !== null){
			result
		}
	})
}
function log(content) {
	const log_field = document.getElementById("log-field")
	log_field.textContent += content
	log_field.textContent += "\n"
}
function set_result(result) {
	const result_element = document.getElementById("result")
	if (result === "error") {
		result_element.innerHTML = "Error"
		result_element.style.color = "var(--red-color)"
	} else if (result === "sucess") {
		result_element.innerHTML = "OK"
		result_element.style.color = "var(--main-dark-color)"
	}
}
function reset_output() {
	document.getElementById("result").textContent = ""
	document.getElementById("output-field").textContent = ""
	document.getElementById("log-field").textContent = ""
}
// download copy
function clicked(target) {
	target.classList.add("clicked")
	setTimeout(() => {
		target.classList.remove("clicked")
	}, 0)
}
/* --------------------------------------------------------------------------------------------- */