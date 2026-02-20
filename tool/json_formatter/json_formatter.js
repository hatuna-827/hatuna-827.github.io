/* - import ------------------------------------------------------------------------------------ */
import { structure } from "/module/structure.js"
/* - const ------------------------------------------------------------------------------------- */
const format_structure = {
	indent_type: {
		display_name: "インデントの種類", type: "select", option: {
			space: { display_name: "スペース", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, max: 10, step: 1, default: 2, placeholder: "0~10" } } },
			tab: { display_name: "タブ", children: { indent_count: { display_name: "インデントの数", type: "number", min: 0, max: 10, step: 1, default: 1, placeholder: "0~10" } } },
			no_indent: { display_name: "インデントしない" },
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
	type: {
		type: "select", display_name: "トップレベルの構造", option: {
			object: { display_name: "オブジェクト", children: { object: { type: "reference", name: "object_children" } } },
			array: { display_name: "リスト", children: { array: { type: "reference", name: "array_children" } } }
		}
	},
}
const select_type_structure = {
	type: {
		type: "select", display_name: "型", option: {
			string: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "string" } } } },
			number: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "number" } } } },
			bool: { children: { default: { type: "toggle", display_name: "デフォルトの値", children: { type: "boolean" } } } },
			object: {
				children: {
					default: { type: "boolean", display_name: "デフォルトで空オブジェクトを設定する" },
					object: { type: "reference", name: "object_children" }
				}
			},
			array: {
				children: {
					default: { type: "boolean", display_name: "デフォルトで空配列を設定する" },
					array: { type: "reference", name: "array_children" }
				}
			},
			null: {}
		}
	}
}
const object_children_structure = {
	sort: { type: "boolean", display_name: "自動ソート" },
	entry: {
		type: "list", display_name: "エントリー", children: {
			type: "object", children: {
				key: { type: "string", display_name: "プロパティ名", placeholder: "(必須)" },
				type: { type: "reference", name: "select_type" }
			}
		}
	}
}
const array_children_structure = {
	element: {
		type: "object", display_name: "要素", children: {
			type: {
				type: "select", display_name: "要素の型", option: {
					string: {}, number: {}, bool: {},
					object: { children: { object: { type: "reference", name: "object_children" } } },
					array: {
						children: {
							default: { type: "boolean", display_name: "デフォルトで空配列を設定する" },
							array: { type: "reference", name: "array_children" }
						}
					}, null: {}
				}
			}
		}
	}
}
/* - init -------------------------------------------------------------------------------------- */
// set input file
set_input_file()
set_format_input_file()
// structure
structure.def_struct("format", format_structure)
structure.def_struct("gui", gui_structure)
structure.def_struct("select_type", select_type_structure)
structure.def_struct("object_children", object_children_structure)
structure.def_struct("array_children", array_children_structure)
structure.set("input-format-structure", "format", change_format)
structure.set("input-format-gui-structure", "gui", change_format_gui)
change_format()
change_format_gui()
// add copy and download button
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
		download("download.json", element.value || element.textContent)
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
// change input json
document.getElementById("input-json-area").addEventListener('input', set_input_file_name)
// generate format from json
document.getElementById("generate-format-text-button").addEventListener('click', generate_format_from_input_json)
// execute
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
	const format = structure.get("input-format-structure").format.structure
	const text_format = document.getElementById("input-format-text")
	const gui_format = document.getElementById("input-format-gui")
	text_format.style.display = "none"
	gui_format.style.display = "none"
	if (format === "no") {
	} else if (format === "text") {
		text_format.style.display = "block"
	} else if (format === "gui") {
		gui_format.style.display = "block"

	}
}
function change_format_gui() {
	document.getElementById("input-format-gui-area").textContent =
		JSON.stringify(structure.get("input-format-gui-structure").gui, null, 2)
}
function generate_format_from_input_json() {
	reset_output()
	const json = parse_json(document.getElementById("input-json-area").value, "入力されたJSON")
	if (json.status === "error") { return }
	const format = generate_format(json.value)
	document.getElementById("input-format-area").value = JSON.stringify(format, null, 2)
	log("フォーマットの生成が完了しました！")
	set_result("sucess")
}
function generate_format(target) {
	let result = {}
	const type = typeof (target)
	if (type === "object") {
		if (Array.isArray(target)) {
			result.type = "array"
			result.element = generate_format(target[0])
		} else {
			result.type = "object"
			result.entry = []
			Object.entries(target).forEach(([key, value]) => {
				result.entry.push({ key: key, ...generate_format(value) })
			})
		}
	} else { result.type = type }
	return result
}
// output
function execute() {
	reset_output()
	const json = parse_json(document.getElementById("input-json-area").value, "入力されたJSON")
	if (json.status === "error") { return }

	const format_data = structure.get("input-format-structure").format
	let result = {}

	const structure_type = format_data.structure
	if (structure_type === "no") {
		result = json.value
		log("フォーマット : なし")
	} else if (structure_type === "text") {
		log("フォーマット : TEXT")
		const format_text_data = parse_json(document.getElementById("input-format-area").value, "入力されたフォーマット")
		if (format_text_data.status === "error") { return }
		try {
			result = format_json(json.value, format_text_data.value)
		} catch (err) {
			set_result("error")
			log("フォーマットに失敗しました")
			log(err)
			return
		}
	} else if (structure_type === "gui") {
		const format_gui_data = structure.get("input-format-gui-structure").gui
		log("フォーマット : GUI")
		result = format_json(json.value, format_gui_data)
	}

	const indent_type = format_data.indent_type
	if (indent_type === "space") {
		log(`インデント : スペース × ${format_data.indent_count}`)
		result = JSON.stringify(result, null, format_data.indent_count)
	} else if (indent_type === "tab") {
		log(`インデント : タブ × ${format_data.indent_count}`)
		result = JSON.stringify(result, null, "\t".repeat(format_data.indent_count))
	} else if (indent_type === "other") {
		log(`インデント : ${format_data.indent_text}`)
		result = JSON.stringify(result, null, format_data.indent_text)
	} else if (indent_type === "no_indent") {
		log(`インデント : なし`)
		result = JSON.stringify(result)
	}
	set_result("sucess")
	log("フォーマットが完了しました！")
	document.getElementById("output-field").textContent = result
}
function format_json(target, format) {
	const type = format.type
	if (["string", "number", "boolean", "null"].includes(type)) {
		if (target === undefined) { if (format.default === undefined) { return undefined } else { return format_json(format.default, format) } }
		try {
			if (type === "string") {
				return String(target)
			} else if (type === "number") {
				return Number(target)
			} else if (type === "boolean") {
				return Boolean(target)
			} else if (type === "null") {
				return null
			}
		} catch {
			throw new Error(`${target} ${type}型への変換に失敗しました`)
		}
	} else if (["object", "array"].includes(type)) {
		if (type === "object") {
			if (target === undefined) { if (format.default === true) { return {} } else { return undefined } }
			if (typeof (target) !== "object" || target === null || Array.isArray(target)) { throw new Error(`type:object フォーマット対象がオブジェクトではありません`) }
			const sort = format.sort
			const entry = format.entry
			if (entry === undefined) { throw new Error(`type:object entryの値が見つかりません`) }
			if (!Array.isArray(entry)) { throw new Error(`type:object entryが配列ではありません`) }
			if (sort === true) {
				entry.sort((a, b) => {
					const nameA = a.name.toUpperCase()
					const nameB = b.name.toUpperCase()
					if (nameA < nameB) { return -1 } if (nameA > nameB) { return 1 } return 0
				})
			}
			let result = {}
			entry.forEach((entry_format, i) => {
				const key = entry_format.key
				if (key === undefined) { throw new Error(`type:object entryの${i}番目 keyが見つかりません`) }
				const value = format_json(target[key], entry_format)
				delete target[key]
				if (value !== undefined) { result[key] = value }
			})
			Object.keys(target).forEach((key) => { log(`key:${key} を削除しました`) })
			return result
		} else if (type === "array") {
			if (target === undefined) { if (format.default === true) { return [] } else { return undefined } }
			if (!Array.isArray(target)) { throw new Error(`type:array フォーマット対象が配列ではありません`) }
			let result = []
			target.forEach((element) => {
				const value = format_json(element, format.element)
				if (value !== undefined) { result.push(value) }
			})
			return result
		}
	} else {
		throw new Error(`${type} フォーマットのtypeの値が見つかりません`)
	}
}
function parse_json(json, title) {
	let result = {}
	try {
		if (!/\S*\{/.test(json)) {
			result = { status: "error", value: "JSONは'{'または'['で始まる必要があります。" }
		}
		result = { status: "success", value: JSON.parse(json) }
	} catch (err) {
		result = { status: "error", value: err }
	}
	if (result.status === "error") {
		set_result("error")
		log(`${title} : 無効`)
		log(result.value)
	} else {
		log(`${title} : 有効`)
	}
	return result
}
// result log
function log(content) {
	const log_field = document.getElementById("log-field")
	const new_log = document.createElement('div')
	new_log.className = "log-text"
	new_log.textContent = content
	log_field.appendChild(new_log)
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
	document.getElementById("result").style.color = ""
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
// download
function download(title, value) {
	const download = document.createElement("a")
	download.setAttribute('href', URL.createObjectURL(new Blob([value], { type: "text/plain" })))
	download.setAttribute('download', title)
	download.click()
}
/* --------------------------------------------------------------------------------------------- */