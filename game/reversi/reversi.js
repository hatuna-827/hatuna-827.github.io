'use strict'
/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
const dir = [
	{ dx: -1, dy: -1 },
	{ dx: -1, dy: 0 },
	{ dx: -1, dy: 1 },
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
	{ dx: 1, dy: -1 },
	{ dx: 1, dy: 0 },
	{ dx: 1, dy: 1 },
]
var data
var turn

/* - init -------------------------------------------------------------------------------------- */
{
	const board = document.getElementById('board')
	board.innerHTML = ''
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			const disc = document.createElement('div')
			disc.id = `${x},${y}`
			disc.className = 'disc'
			disc.addEventListener('click', function () {
				push(x, y)
			})
			board.appendChild(disc)
		}
		board.appendChild(document.createElement('br'))
	}
	const buttons = document.getElementById('buttons')
	const pass_btn = document.createElement('div')
	pass_btn.className = 'but'
	pass_btn.textContent = 'パス'
	pass_btn.addEventListener('click', pass)
	buttons.appendChild(pass_btn)
	const reset_btn = document.createElement('div')
	reset_btn.className = 'but'
	reset_btn.textContent = 'リセット'
	reset_btn.addEventListener('click', reset)
	buttons.appendChild(reset_btn)
	reset()
}

/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('popup').addEventListener('click', hide_popup)

/* - function ---------------------------------------------------------------------------------- */
function reset() {
	data = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, -1, 1, 0, 0, 0],
		[0, 0, 0, 1, -1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]
	turn = 1
	show()
}

function pass() {
	turn *= -1
	show_valid()
}

function for_disc(func) {
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			func(x, y, document.getElementById(`${x},${y}`))
		}
	}
}

function get_state(x, y) {
	if (x < 0 || y < 0 || 7 < x || 7 < y) {
		return null
	} else {
		return data[y][x]
	}
}

function check_valid(x, y, turn) {
	if (get_state(x, y) !== 0) {
		return false
	}
	for (const { dx, dy } of dir) {
		let count = 0
		let px = x
		let py = y
		px += dx
		py += dy
		while (get_state(px, py) && turn + get_state(px, py) === 0) {
			px += dx
			py += dy
			++count
		}
		if (get_state(px, py) === turn && count !== 0) {
			return true
		}
	}
	return false
}

function show_valid() {
	let valid_count = 0
	document.querySelectorAll('.valid').forEach(disc => {
		disc.classList.remove('valid')
	})
	for_disc((x, y, el) => {
		if (check_valid(x, y, turn)) {
			++valid_count
			el.classList.add('valid')
		}
	})
	// if (valid_count === 0) {
	// 	pass()
	// }
}

function push(x, y) {
	if (check_valid(x, y, turn)) {
		for (const { dx, dy } of dir) {
			let count = 0
			let px = x
			let py = y
			px += dx
			py += dy
			while (get_state(px, py) && turn + get_state(px, py) === 0) {
				px += dx
				py += dy
				++count
			}
			if (get_state(px, py) === turn && count !== 0) {
				for (let i = 0; i < count; ++i) {
					px -= dx
					py -= dy
					data[py][px] = turn
				}
			}
		}
		data[y][x] = turn
		turn *= -1
		show()
	}
}

function show() {
	for_disc((x, y, el) => {
		const status = data[y][x]
		if (status === -1) {
			el.className = 'disc white'
		} else if (status === 0) {
			el.className = 'disc'
		} else if (status === 1) {
			el.className = 'disc black'
		}
	})
	check_end()
	show_valid()
}

function check_end() {
	let white = 0
	let black = 0
	for_disc((x, y) => {
		if (data[y][x] === -1) {
			++white
		}
		if (data[y][x] === 1) {
			++black
		}
	})
	const popup = document.getElementById('popup-content')
	if (white === 0 || black === 0) {
		if (white === 0) {
			popup.className = 'black'
		} else if (black === 0) {
			popup.className = 'white'
		}
		show_popup()
	}
	if (white + black === 64) {
		popup.className = 'black'
		if (black < white) {
			popup.className = 'white'
		} else if (black === white) {
			popup.className = 'draw'
		}
		show_popup()
	}
}

function show_popup() {
	document.getElementById('popup').style.display = 'flex'
}

function hide_popup() {
	document.getElementById('popup').style.display = 'none'
}

/* --------------------------------------------------------------------------------------------- */
