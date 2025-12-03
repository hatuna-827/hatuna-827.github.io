"use strict"

/* - import ------------------------------------------------------------------------------------ */

import storage from "/module/storage.js"
import obj_manip from "/module/obj_manip.js"
import dialog from "/module/dialog.js"
import snackbar from "/module/snackbar.js"

/* - const ------------------------------------------------------------------------------------- */

const storage_key = "wordbook"

const default_wordbook_data = [
	{
		name: "使い方", words: [
			{ word: "新規作成", description: "aa" },
			{ word: "編集", description: "bb" },
			{ word: "削除", description: "cc" }
		]
	}
]

const load_data = storage.get(storage_key)

const main_title = document.getElementById("main-title")
const generate_box = document.getElementById("generate-box")

let hover_index = -1
let dragEl = null
let card_data = { book: { index: 0, name: "", length: 0 }, card_index: 0, is_front: true }
let wordbook_data

/* - init -------------------------------------------------------------------------------------- */

if (load_data !== null && load_data.length !== 0) {
	wordbook_data = storage.get(storage_key)
} else {
	wordbook_data = default_wordbook_data
}

display_title()

/* - add eventListener ------------------------------------------------------------------------- */

document.getElementById("export-execute-button").addEventListener('click', function () {
	const remove = document.getElementById("export-remove-checkbox").checked
	let result = []
	let count = 0
	document.querySelectorAll("#export-select-box .export-checkbox").forEach((checkbox) => {
		if (!checkbox.checked) { return }
		result.push(wordbook_data[checkbox.dataset.index - count])
		if (remove) { wordbook_data.splice(checkbox.dataset.index - count, 1) }
		count++
	})
	save_wordbook_data()
	result = JSON.stringify(result)
	const download = document.createElement("a")
	download.setAttribute('href', URL.createObjectURL(new Blob([result], { type: "text/plain" })))
	download.setAttribute('download', "download.json")
	download.click()
	document.getElementById("export").style.display = "none"
	display_title()
})

document.getElementById("export-all-checkbox").addEventListener('change', function () {
	document.querySelectorAll("#export-select-box .export-checkbox").forEach((checkbox) => {
		checkbox.checked = this.checked
	})
})

document.getElementById("export-button").addEventListener('click', function () {
	document.getElementById("export").style.display = "flex"
	const select_box = document.getElementById("export-select-box")
	select_box.innerHTML = ""
	wordbook_data.forEach((book_data, i) => {
		const book_name = book_data.name
		const label = document.createElement('label')
		label.className = "export-label"
		const checkbox = document.createElement('input')
		checkbox.className = "export-checkbox"
		checkbox.type = "checkbox"
		checkbox.dataset.index = i
		const name = document.createElement('div')
		name.className = "export-book-name"
		name.textContent = book_name
		label.appendChild(checkbox)
		label.appendChild(name)
		select_box.appendChild(label)
	})
})

document.getElementById("import-file").addEventListener('change', function () {
	const file = this.files[0]
	if (!file) return
	const reader = new FileReader()
	reader.readAsText(file)
	reader.addEventListener('load', function () {
		try {
			const new_books = JSON.parse(this.result)
			wordbook_data = [...wordbook_data, ...new_books]
			save_wordbook_data()
			display_title()
		} catch (err) {
			snackbar({ type: "err", context: "無効なJSONファイル" })
			display_title()
		}
	})
})

generate_box.addEventListener("dragstart", (e) => {
	if (e.target.classList && e.target.classList.contains("title-move")) {
		dragEl = e.target.closest(".title-block")
		dragEl.classList.add("dragging")
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setDragImage(new Image(), 0, 0)
	} else {
		e.preventDefault()
	}
})

generate_box.addEventListener("dragend", (e) => {
	if (!dragEl) return
	const afterIndex = getDragAfterElement(generate_box, e.clientY).index
	const [data] = wordbook_data.splice(dragEl.dataset.index, 1)
	wordbook_data.splice(afterIndex, 0, data)
	save_wordbook_data()
	display_title()
	dragEl.classList.remove("dragging")
	dragEl = null
})

generate_box.addEventListener("dragover", (e) => {
	e.preventDefault()
	if (!dragEl) return
	const afterElement = getDragAfterElement(generate_box, e.clientY).element
	generate_box.insertBefore(dragEl, afterElement)
	generate_box.appendChild(document.getElementById('add-button'))
})

/* - function ---------------------------------------------------------------------------------- */

function getDragAfterElement(container, y) {
	const elements = [...container.querySelectorAll(".title-block:not(.dragging)")]
	return elements.reduce((closest, child, i) => {
		const size = child.getBoundingClientRect()
		const offset = y - size.top - size.height / 2
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: child, index: i }
		} else {
			return closest
		}
	}, { offset: Number.NEGATIVE_INFINITY, index: wordbook_data.length })
}

function update_card() {
	if (card_data.book.length <= card_data.card_index) {
		display_title()
		return
	}
	const main_text = document.getElementById("card-main-text")
	const front_word = document.getElementById("front-word")
	let card = wordbook_data[card_data.book.index].words[card_data.card_index]
	let text, sub_text = ""
	if (card_data.is_front) {
		text = card.word
	} else {
		text = card.description
		sub_text = card.word
	}
	main_text.textContent = text
	front_word.textContent = sub_text
}

function next_card() {
	if (card_data.is_front) {
		card_data.is_front = false
	} else {
		card_data.is_front = true
		++card_data.card_index
	}
	update_card()
}

function open_wordbook(index) {
	const book = wordbook_data[index]
	main_title.textContent = book.name
	set_back_button("title")
	generate_box.innerHTML = ""
	card_data = { book: { index: index, name: book.name, length: book.words.length }, card_index: 0, is_front: true }
	const card = document.createElement('div')
	card.id = "card"
	card.addEventListener('click', next_card)
	const card_main_text = document.createElement('div')
	card_main_text.id = "card-main-text"
	const front_word = document.createElement('div')
	front_word.id = "front-word"
	card.appendChild(front_word)
	card.appendChild(card_main_text)
	generate_box.appendChild(card)
	update_card()
}

function display_title() {
	hover_index = -1
	main_title.textContent = "デジタル単語帳"
	set_back_button("none")
	generate_box.innerHTML = ""
	wordbook_data.forEach((wordbook, i) => {
		const title = document.createElement("div")
		title.id = `title${i}`
		title.dataset.index = i
		title.className = "title-block"
		title.addEventListener('click', () => { open_wordbook(hover_index) })
		title.addEventListener('mouseover', () => { hover_index = i })
		title.addEventListener('mouseleave', () => { hover_index = -1 })
		const title_name = document.createElement('div')
		title_name.className = "title-name"
		const title_name_text = document.createElement('div')
		title_name_text.className = "title-name-text"
		title_name_text.textContent = wordbook.name
		const dots = document.createElement("div")
		dots.className = "dots"
		dots.addEventListener('click', dots_click)
		const title_move = document.createElement("div")
		title_move.className = "title-move"
		title_move.draggable = true
		title_name.appendChild(title_name_text)
		title.appendChild(title_name)
		title.appendChild(title_move)
		title.appendChild(dots)
		generate_box.appendChild(title)
	})
	// add add_button
	const add_button = document.createElement("div")
	add_button.className = "title-block"
	add_button.id = "add-button"
	add_button.addEventListener('click', add_new_title)
	generate_box.appendChild(add_button)
}

function display_words(index) {
	main_title.textContent = wordbook_data[index].name
	generate_box.innerHTML = ""
	set_back_button("title")
	const words_list_table = document.createElement('table')
	words_list_table.id = "words-list-table"
	const line = document.createElement('tr')
	const th_no = document.createElement('th')
	const th_word = document.createElement('th')
	const th_description = document.createElement('th')
	th_no.className = "no"
	th_word.className = "word"
	th_description.className = "description"
	th_no.textContent = "No."
	th_word.textContent = "単語"
	th_description.textContent = "説明"
	th_no.scope = "col"
	th_word.scope = "col"
	th_description.scope = "col"
	line.appendChild(th_no)
	line.appendChild(th_word)
	line.appendChild(th_description)
	words_list_table.appendChild(line)
	wordbook_data[index].words.forEach((word, i) => {
		const line = document.createElement('tr')
		const td_no = document.createElement('td')
		const td_word = document.createElement('td')
		const td_description = document.createElement('td')
		td_no.className = "no"
		td_word.className = "word"
		td_description.className = "description"
		td_no.scope = "row"
		td_no.textContent = i + 1
		td_word.textContent = word.word
		td_description.textContent = word.description
		line.appendChild(td_no)
		line.appendChild(td_word)
		line.appendChild(td_description)
		words_list_table.appendChild(line)
	})
	generate_box.appendChild(words_list_table)
}

function edit_words(index) {
	main_title.textContent = wordbook_data[index].name
	generate_box.innerHTML = ""
	set_back_button("title")
	const words_list_table = document.createElement('div')
	words_list_table.id = "words-edit-field"
	const line = document.createElement('div')
	line.className = "line title"
	const th_no = document.createElement('div')
	th_no.className = "no"
	const th_word = document.createElement('div')
	th_word.className = "word"
	const th_description = document.createElement('div')
	th_description.className = "description"
	line.appendChild(th_no)
	line.appendChild(th_word)
	line.appendChild(th_description)
	words_list_table.appendChild(line)
	wordbook_data[index].words.forEach((word_content, i) => {
		const line = document.createElement('div')
		line.className = "line"
		const no = document.createElement('div')
		no.className = "no"
		no.textContent = i + 1
		const word = document.createElement('div')
		word.className = "word"
		const input_word = document.createElement('input')
		input_word.className = "input"
		input_word.value = word_content.word
		input_word.addEventListener('input', function () {
			wordbook_data[index].words[i].word = this.value
			save_wordbook_data()
		})
		const description = document.createElement('div')
		description.className = "description"
		const input_description = document.createElement('input')
		input_description.className = "input"
		input_description.value = word_content.description
		input_description.addEventListener('input', function () {
			wordbook_data[index].words[i].description = this.value
			save_wordbook_data()
		})
		const word_add = document.createElement('div')
		word_add.className = "word-add"
		word_add.addEventListener('click', function () {
			wordbook_data[index].words.splice(i, 0, { word: "", description: "" })
			save_wordbook_data()
			edit_words(index)
		})
		fetch("https://hatuna-827.github.io/icons/xml/plus.xml").then(r => r.text()).then(svg => { word_add.innerHTML = svg })
		const word_remove = document.createElement('div')
		word_remove.className = "word-remove"
		word_remove.addEventListener('click', function () {
			wordbook_data[index].words.splice(i, 1)
			save_wordbook_data()
			edit_words(index)
		})
		fetch("https://hatuna-827.github.io/icons/xml/trash_can.xml").then(r => r.text()).then(svg => { word_remove.innerHTML = svg })
		word.appendChild(input_word)
		description.appendChild(input_description)
		line.appendChild(word_add)
		line.appendChild(word_remove)
		line.appendChild(no)
		line.appendChild(word)
		line.appendChild(description)
		words_list_table.appendChild(line)
	})
	generate_box.appendChild(words_list_table)
	const add_new_word = document.createElement('button')
	add_new_word.id = "add-new-word"
	fetch("https://hatuna-827.github.io/icons/xml/plus.xml").then(r => r.text()).then(svg => { add_new_word.innerHTML = svg })
	add_new_word.addEventListener('click', () => {
		wordbook_data[index].words.push({ word: "", description: "" })
		save_wordbook_data()
		edit_words(index)
	})
	generate_box.appendChild(add_new_word)
}

function dots_click(e) {
	e.stopPropagation()
	if (document.querySelector(`#title${hover_index} #dots-menu`)) {
		console.log(hover_index)
		document.getElementById("dots-menu").remove()
		return
	}
	if (document.getElementById("dots-menu")) {
		document.getElementById("dots-menu").remove()
	}
	const dots_menu = document.createElement('div')
	const words_list = document.createElement('div')
	const title_edit = document.createElement('div')
	const words_edit = document.createElement('div')
	const title_remove = document.createElement('div')
	dots_menu.id = "dots-menu"
	words_list.id = "words-list"
	title_edit.id = "title-edit"
	words_edit.id = "words-edit"
	title_remove.id = "title-remove"
	dots_menu.addEventListener('click', (e) => { e.stopPropagation() })
	words_list.addEventListener('click', () => {
		display_words(document.getElementById("dots-menu").parentElement.dataset.index)
	})
	title_edit.addEventListener('click', () => {
		const new_title_name = input_new_title_name()
		if (new_title_name != null) {
			wordbook_data[document.getElementById("dots-menu").parentElement.dataset.index].name = new_title_name
			save_wordbook_data()
		}
		display_title()
	})
	words_edit.addEventListener('click', () => {
		edit_words(document.getElementById("dots-menu").parentElement.dataset.index)
	})
	title_remove.addEventListener('click', () => {
		dialog({ title: "注意", content: "削除します。よろしいですか?", button: ["キャンセル", "削除"] }).then((resolve) => {
			if (resolve == 1) {
				obj_manip.remove(wordbook_data, [document.getElementById("dots-menu").parentElement.dataset.index])
				save_wordbook_data()
				display_title()
			}
		})
	})
	dots_menu.appendChild(words_list)
	dots_menu.appendChild(title_edit)
	dots_menu.appendChild(words_edit)
	dots_menu.appendChild(document.createElement('hr'))
	dots_menu.appendChild(title_remove)
	document.getElementById(`title${hover_index}`).appendChild(dots_menu)
}

function add_new_title() {
	const new_title_name = input_new_title_name()
	if (new_title_name != null) {
		wordbook_data.push({ name: new_title_name, words: [] })
		save_wordbook_data()
		edit_words(wordbook_data.length - 1)
	}
}

function input_new_title_name() {
	let new_title_name = window.prompt("単語帳の名前を入力してください。", "")
	while (!/\S+/.test(new_title_name) || new_title_name == "") {
		new_title_name = window.prompt("入力が無効です。", "")
	}
	return new_title_name
}

function save_wordbook_data() {
	storage.set(storage_key, wordbook_data)
}

function set_back_button(type) {
	const back = document.getElementById("back")
	const export_import = document.getElementById("export-import-buttons")
	export_import.style.display = "none"
	if (type === "none") {
		back.style.display = "none"
		export_import.style.display = "flex"
	} else if (type = "title") {
		back.style.display = "block"
		back.onclick = display_title
	}
}

/* --------------------------------------------------------------------------------------------- */