'use strict'
/* - const ------------------------------------------------------------------------------------- */
let word_list
let filtered_word_list
let input_condition
	/* - init -------------------------------------------------------------------------------------- */
;[0, 1, 2, 3, 4].forEach(i =>
	document.getElementById(`input-char-${i}`).addEventListener('click', function () {
		update_char_status(i)
	})
)
fetch('./wordle.json')
	.then(response => response.json())
	.then(data => {
		word_list = new Set(data)
		filtered_word_list = new Set(word_list)
		update_best_solution()
	})
	.catch(error => console.error('Error:', error))
reset_input()
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('add-hint').addEventListener('click', function () {
	document.getElementById('input-hint-wrapper').style.display = 'flex'
	document.getElementById('input-text').focus()
})
document.getElementById('input-text').addEventListener('input', function () {
	let text = document.getElementById('input-text').value
	if (/^[a-zA-Z-]{0,5}$/.test(text)) {
		document.getElementById('input-text-comment').style.display = 'none'
		input_condition.guess = text.toLowerCase()
		update_display_input()
	} else {
		document.getElementById('input-text-comment').style.display = 'block'
	}
})
document.getElementById('input-cancel').addEventListener('click', function () {
	document.getElementById('input-hint-wrapper').style.display = 'none'
})
document.getElementById('input-submit').addEventListener('click', function () {
	if (input_condition.guess.length !== 5) {
		document.getElementById('input-text-comment').style.display = 'block'
		return
	}
	document.getElementById('input-hint-wrapper').style.display = 'none'
	const word = create_word(input_condition)
	document.getElementById('hints').appendChild(word)
	filter_candidates(filtered_word_list, input_condition.guess, input_condition.colors)
	update_best_solution()
	update_word_list()
	reset_input()
})
/* - function ---------------------------------------------------------------------------------- */
function reset_input() {
	input_condition = { guess: '', colors: Array(5).fill('gray') }
	document.getElementById('input-text').value = ''
	update_display_input()
}
function update_char_status(index) {
	const old_status = input_condition.colors[index]
	const convert = {
		gray: 'yellow',
		yellow: 'green',
		green: 'gray',
	}
	input_condition.colors[index] = convert[old_status]
	update_display_input()
}
function update_display_input() {
	for (let i = 0; i < 5; ++i) {
		const input_char = document.getElementById(`input-char-${i}`)
		input_char.textContent = (input_condition.guess[i] ?? '').toUpperCase()
		input_char.className = `char ${input_condition.colors[i]}`
	}
}
function create_word(condition) {
	const word = document.createElement('div')
	word.className = 'word hint'
	for (let i = 0; i < 5; ++i) {
		const char = document.createElement('div')
		char.className = `char ${condition.colors[i]}`
		char.textContent = condition.guess[i].toUpperCase()
		word.appendChild(char)
	}
	return word
}
async function update_best_solution() {
	const best_solution = await search_best_solution()
	document.getElementById('best-solution').textContent =
		`次の最善手:${best_solution.word} , エントロピー:${best_solution.entropy}`
}

function filter_candidates(candidates, guess, colors) {
	const fixed = new Map()
	const required = new Map()
	const limited_chars = new Set()
	const forbidden = new Set()

	for (let i = 0; i < 5; i++) {
		const c = guess[i]
		if (colors[i] === 'green') {
			fixed.set(i, c)
			required.set(c, (required.get(c) ?? 0) + 1)
		}
		if (colors[i] === 'yellow') {
			required.set(c, (required.get(c) ?? 0) + 1)
		}
	}
	for (let i = 0; i < 5; i++) {
		const c = guess[i]
		if (colors[i] === 'gray') {
			if (required.has(c) || [...fixed.values()].includes(c)) {
				limited_chars.add(c)
			} else {
				forbidden.add(c)
			}
		}
	}

	for (const word of candidates) {
		let ok = true
		for (const [i, c] of fixed) {
			if (word[i] !== c) {
				ok = false
				break
			}
		}
		if (!ok) {
			candidates.delete(word)
			continue
		}
		for (const c of forbidden) {
			if (word.includes(c)) {
				ok = false
				break
			}
		}
		if (!ok) {
			candidates.delete(word)
			continue
		}
		for (const [c, count] of required) {
			const actual_count = [...word].filter(x => x === c).length
			if (actual_count < count || (limited_chars.has(c) && actual_count !== count)) {
				ok = false
				break
			}
		}
		if (!ok) {
			candidates.delete(word)
			continue
		}
		for (let i = 0; i < 5; i++) {
			if (colors[i] === 'yellow' && word[i] === guess[i]) {
				ok = false
				break
			}
		}
		if (!ok) {
			candidates.delete(word)
		}
	}
}
function update_word_list() {
	const list = document.getElementById('list-content')
	list.innerHTML = ''
	document.getElementById('list-count').textContent = `候補数 : ${filtered_word_list.size}`
	filtered_word_list.forEach(word => {
		const span = document.createElement('span')
		span.textContent = word
		list.appendChild(span)
	})
}

function evaluation(guess, answer) {
	guess = guess.toLowerCase()
	answer = answer.toLowerCase()
	const colors = Array(5).fill('gray')
	const remaining = {}
	for (let i = 0; i < 5; i++) {
		if (guess[i] === answer[i]) {
			colors[i] = 'green'
		} else {
			remaining[answer[i]] = (remaining[answer[i]] || 0) + 1
		}
	}
	for (let i = 0; i < 5; i++) {
		if (colors[i] !== 'gray') continue
		const c = guess[i]
		if (remaining[c] > 0) {
			colors[i] = 'yellow'
			remaining[c]--
		}
	}
	return colors
}
async function search_best_solution() {
	if (word_list.size === filtered_word_list.size) {
		return { word: 'tares', entropy: 6.19405254437545 }
	}
	let best_solution = { word: '無し', entropy: 0 }
	word_list.forEach(guess => {
		const status_count = {}
		filtered_word_list.forEach(answer => {
			const status = evaluation(guess, answer).join()
			status_count[status] = (status_count[status] ?? 0) + 1
		})
		let entropy = 0
		const sum = filtered_word_list.size
		Object.values(status_count).forEach(count => {
			const p = count / sum
			entropy -= p * Math.log2(p)
		})
		if (best_solution.entropy < entropy) {
			best_solution = { word: guess, entropy }
		}
	})
	return best_solution
}
/* --------------------------------------------------------------------------------------------- */
