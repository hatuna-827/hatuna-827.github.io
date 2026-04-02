/* - import ------------------------------------------------------------------------------------ */
import { query } from '/module/query.js'
/* - const ------------------------------------------------------------------------------------- */
let code = '',
	input = [],
	output = []
let code_index,
	input_index,
	p,
	memory,
	old_log,
	loop_log,
	interval,
	memory_type,
	code_type,
	running,
	reset_flag,
	loop_counter,
	stopID,
	loop_pair
let code_children = []
/* - init -------------------------------------------------------------------------------------- */
reset()
get_interval()
get_memory_type()
set_running(false)
document.getElementById('input-code').value = query('c') ?? ''
document.getElementById('input-stdin').value = query('i') ?? ''
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('share').addEventListener('click', function () {
	const url = `${location.protocol}//${location.host}${location.pathname}?c=${document.getElementById('input-code').value}&i=${document.getElementById('input-stdin').value}`
	const esc_url = encodeURI(url)
	navigator.share({ url: esc_url })
	this.classList.add('clicked')
	setTimeout(() => {
		this.classList.remove('clicked')
	}, 0)
})
document.getElementById('runspeed-select').addEventListener('change', get_interval)
document.getElementById('memory-type-select').addEventListener('change', get_memory_type)
document.getElementById('pause').addEventListener('click', function () {
	set_running(false)
})
document.getElementById('resume').addEventListener('click', function () {
	set_running(true)
})
document.getElementById('step-re').addEventListener('click', step_re)
document.getElementById('step-in').addEventListener('click', step)
document.getElementById('run').addEventListener('click', function () {
	clearTimeout(stopID)
	code_type = document.getElementById('code-type-select').value
	// input
	const input_str = document.getElementById('input-stdin').value
	document.getElementById('output-stdin').textContent = input_str
	input = new TextEncoder().encode(input_str)
	// code
	let input_code = document.getElementById('input-code').value
	code = input_code.replace(/[^+\-<>.,[\]#]/g, '')
	if (code_type != 'raw') {
		input_code = input_code.replace(/[^+\-<>.,[\]#\s]/g, '')
	}
	if (code_type == 's') {
		input_code = input_code.replace(/((?!\n)\s)+/g, ' ')
	} else if (code_type == 'n') {
		input_code = input_code.replace(/((?!\n)\s)+/g, '')
	} else if (code_type == 'none') {
		input_code = input_code.replace(/\s+/g, '')
	}
	let n = 0
	let stack = []
	let err_flag = false
	loop_pair = []
	Array.from(code).forEach((v, i) => {
		if (v == '[') {
			++n
			stack.push(i)
		} else if (v == ']') {
			--n
			loop_pair.push([stack.pop(), i])
		}
		if (n < 0) {
			err_flag = true
		}
	})
	if (err_flag || n != 0) {
		error('Syntax Error: Mismatched parentheses')
		return
	}
	const output_code = document.getElementById('output-code')
	output_code.innerHTML = ''
	code_children = []
	for (let i = 0; i < input_code.length; i++) {
		if (input_code[i] == '\n') {
			output_code.appendChild(document.createElement('br'))
		} else {
			const n = document.createElement('span')
			n.textContent = input_code[i]
			output_code.appendChild(n)
			if (/[+\-<>.,[\]#]/.test(input_code[i])) {
				code_children.push(n)
			}
		}
	}
	reset_flag = true
	set_running(true)
})
/* - function ---------------------------------------------------------------------------------- */
function get_interval() {
	interval = Number(document.getElementById('runspeed-select').value)
}
function get_memory_type() {
	memory_type = Number(document.getElementById('memory-type-select').value)
	for (let i = 0; i < memory.length; i++) {
		update_memory(i)
	}
}
function update_memory(p) {
	const str = to_string(memory[p])
	document.getElementById('output-memory').children[p].textContent = str
}
function to_string(num) {
	if (memory_type === 10) {
		return String(num)
	} else {
		return ('0' + num.toString(memory_type)).slice(-2).toUpperCase()
	}
}
function reset() {
	reset_flag = false
	code_index = 0
	input_index = 0
	p = 0
	memory = [0]
	old_log = []
	loop_log = []
	loop_counter = 0
	output = []
	document.getElementById('output-stdout').textContent = ''
	const output_memory = document.getElementById('output-memory')
	output_memory.innerHTML = ''
	const n = document.createElement('span')
	n.className = 'memory active'
	output_memory.appendChild(n)
	update_memory(0)
	code_children.forEach((element, i) => {
		element.className = i === 0 ? 'active' : ''
	})
}
function resume() {
	step()
	if (code[code_index] == '#') {
		set_running(false)
	}
	if (!running) {
		return
	}
	if (interval == -1) {
		++loop_counter
		if (1000 < loop_counter) {
			loop_counter = 0
			setTimeout(resume, 0)
		} else {
			resume()
		}
	} else {
		stopID = setTimeout(resume, interval)
	}
}
function step() {
	if (reset_flag) {
		reset()
		return
	}
	if (code.length <= code_index) {
		set_running(false)
		reset_flag = true
		return
	}
	const output_memory = document.getElementById('output-memory')
	switch (code[code_index]) {
		case '>':
			if (p == 65535) {
				error('Runtime Error: Memory pointer out of bounds. (65536)')
				return
			}
			output_memory.children[p].classList.remove('active')
			++p
			if (memory.length == p) {
				memory.push(0)
				const n = document.createElement('span')
				n.className = 'memory'
				n.textContent = '0'
				output_memory.appendChild(n)
			}
			output_memory.children[p].classList.add('active')
			break
		case '<':
			if (p == 0) {
				error('Runtime Error: Memory pointer out of bounds. (0)')
				return
			}
			output_memory.children[p].classList.remove('active')
			if (memory[p] == 0 && p == memory.length - 1) {
				memory.splice(p, 1)
				output_memory.children[p].remove()
			}
			--p
			output_memory.children[p].classList.add('active')
			break
		case '+':
			++memory[p]
			if (memory[p] == 256) {
				memory[p] = 0
			}
			update_memory(p)
			break
		case '-':
			--memory[p]
			if (memory[p] == -1) {
				memory[p] = 255
			}
			update_memory(p)
			break
		case ',':
			old_log.push(memory[p])
			memory[p] = input[input_index] ?? 255
			update_memory(p)
			++input_index
			break
		case '.':
			output.push(memory[p])
			document.getElementById('output-stdout').textContent = new TextDecoder('utf-8').decode(
				new Uint8Array(output)
			)
			break
		case '[':
			if (memory[p] == 0) {
				const pair = loop_pair.find(p => p[0] == code_index)
				code_children[code_index].classList.remove('active')
				code_index = pair[1]
				loop_log.push(pair[1])
			}
			break
		case ']':
			if (memory[p] != 0) {
				const pair = loop_pair.find(p => p[1] == code_index)
				code_children[code_index].classList.remove('active')
				code_index = pair[0]
				loop_log.push(pair[0])
			}
			break
	}
	code_children[code_index].classList.remove('active')
	++code_index
	if (code_children[code_index] != undefined) {
		code_children[code_index].classList.add('active')
	}
}
function step_re() {
	if (code_index == 0) {
		return
	}
	if (code_children[code_index] != undefined) {
		code_children[code_index].classList.remove('active')
	}
	--code_index
	code_children[code_index].classList.add('active')
	const output_memory = document.getElementById('output-memory')
	switch (code[code_index]) {
		case '>':
			output_memory.children[p].classList.remove('active')
			if (memory[p] == 0 && p == memory.length - 1) {
				memory.splice(p, 1)
				output_memory.children[p].remove()
			}
			--p
			output_memory.children[p].classList.add('active')
			break
		case '<':
			output_memory.children[p].classList.remove('active')
			++p
			if (memory.length == p) {
				memory.push(0)
				const n = document.createElement('span')
				n.className = 'memory'
				n.textContent = '0'
				output_memory.appendChild(n)
			}
			output_memory.children[p].classList.add('active')
			break
		case '+':
			--memory[p]
			if (memory[p] == -1) {
				memory[p] = 255
			}
			update_memory(p)
			break
		case '-':
			++memory[p]
			if (memory[p] == 256) {
				memory[p] = 0
			}
			update_memory(p)
			break
		case ',':
			memory[p] = old_log.pop()
			update_memory(p)
			--input_index
			break
		case '.':
			output.pop()
			document.getElementById('output-stdout').textContent = new TextDecoder('utf-8').decode(
				new Uint8Array(output)
			)
			break
		case '[':
			if (loop_log[loop_log.length - 1] == code_index) {
				loop_log.pop()
				const pair = loop_pair.find(p => p[0] == code_index)
				code_children[code_index].classList.remove('active')
				code_index = pair[1]
				code_children[code_index].classList.add('active')
			}
			break
		case ']':
			if (loop_log[loop_log.length - 1] == code_index) {
				loop_log.pop()
				const pair = loop_pair.find(p => p[1] == code_index)
				code_children[code_index].classList.remove('active')
				code_index = pair[0]
				code_children[code_index].classList.add('active')
			}
			break
	}
}
function set_running(v) {
	running = v
	const pause_button = document.getElementById('pause')
	const resume_button = document.getElementById('resume')
	const step_in_button = document.getElementById('step-in')
	const step_re_button = document.getElementById('step-re')
	if (v) {
		pause_button.style.display = 'inline-block'
		resume_button.style.display = 'none'
		step_in_button.style.display = 'none'
		step_re_button.style.display = 'none'
		resume()
	} else {
		pause_button.style.display = 'none'
		resume_button.style.display = 'inline-block'
		step_in_button.style.display = 'inline-block'
		step_re_button.style.display = 'inline-block'
		clearTimeout(stopID)
	}
}
function error(content) {
	set_running(false)
	reset_flag = true
	const err_log = document.createElement('div')
	err_log.className = 'error-log'
	err_log.textContent = content
	document.getElementById('output-stdout').appendChild(err_log)
}
/* --------------------------------------------------------------------------------------------- */
