'use strict'
/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
let type = 'INPUT'
let color = { R: 0xff, G: 0xff, B: 0xff }
/* - init -------------------------------------------------------------------------------------- */
get_base()
get_back()
get_type()
update_color()
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('back-color').addEventListener('input', get_back)
document.getElementById('base-color').addEventListener('input', get_base)
document.getElementById('type').addEventListener('change', get_type)
/* - function ---------------------------------------------------------------------------------- */
function get_back() {
	document.getElementById('compare').style.backgroundColor =
		document.getElementById('back-color').value
}
function get_base() {
	document.getElementById('base').style.backgroundColor =
		document.getElementById('base-color').value
}
function get_type() {
	type = document.getElementById('type').value
	upadte_color_picker()
}
function get_color() {
	switch (type) {
		case 'INPUT':
			const HEX = document.getElementById('input').value
			color = HEX_to_RGB(HEX)
			break
		case 'RGB':
			const RGB = ['R', 'G', 'B']
			RGB.forEach(c => {
				color[c] = int(document.getElementById(c).value)
			})
			break
		case 'HSL':
			const HSL = Object.fromEntries(
				['H', 'S', 'L'].map(v => [v, int(document.getElementById(v).value)])
			)
			color = HSL_to_RGB(HSL)
			break
	}
	update_color()
}

function upadte_color_picker() {
	const slider = document.getElementById('slider')
	slider.innerHTML = ''
	switch (type) {
		case 'INPUT':
			const input = document.createElement('input')
			input.id = 'input'
			input.type = 'color'
			input.value = `rgb(${color.R},${color.G},${color.B})`
			input.addEventListener('input', get_color)
			slider.appendChild(input)
			break
		case 'RGB':
			add_slider('R', 0xff, color.R)
			add_slider('G', 0xff, color.G)
			add_slider('B', 0xff, color.B)
			break
		case 'HSL':
			const HSL = RGB_to_HSL(color)
			add_slider('H', 360, HSL.H)
			add_slider('S', 100, HSL.S)
			add_slider('L', 100, HSL.L)
			break
	}
}
function add_slider(c, max, value) {
	const input = document.createElement('input')
	input.id = c
	input.type = 'number'
	input.max = max
	input.min = 0
	input.step = 1
	input.placeholder = c
	input.value = value
	input.addEventListener('input', get_color)
	slider.appendChild(input)
}
function update_color() {
	document.getElementById('color').style.backgroundColor = `rgb(${color.R},${color.G},${color.B})`
}

function HEX_to_RGB(HEX) {
	const R = parseInt(HEX.slice(1, 3), 16)
	const G = parseInt(HEX.slice(3, 5), 16)
	const B = parseInt(HEX.slice(5, 7), 16)
	return { R, G, B }
}
function RGB_to_HSL({ R, G, B }) {
	const MAX = Math.max(R, G, B)
	const MIN = Math.min(R, G, B)
	let H
	if (MIN === MAX) {
		H = 0
	} else if (R === MAX) {
		H = 60 * ((G - B) / (MAX - MIN))
	} else if (G === MAX) {
		H = 60 * ((B - R) / (MAX - MIN)) + 120
	} else if (B === MAX) {
		H = 60 * ((R - G) / (MAX - MIN)) + 240
	}
	let L = (MIN + MAX) / 2
	let S
	if (L === 0 || L === 255) {
		S = 0
	} else if (L <= 127) {
		S = (L - MIN) / L
	} else {
		S = (MAX - L) / (255 - L)
	}
	H = int(H)
	S = int(S * 100)
	L = int((L * 100) / 255)
	return { H, S, L }
}
function HSL_to_RGB({ H, S, L }) {
	const tL = 50 < L ? 100 - L : L
	const MAX = 2.55 * (L + tL * (S / 100))
	const MIN = 2.55 * (L - tL * (S / 100))
	let dH
	if (0 < H && H <= 60) {
		dH = 0
	} else if (60 < H && H <= 180) {
		dH = 120
	} else if (180 < H && H <= 300) {
		dH = 240
	} else if (300 < H && H <= 360) {
		dH = 360
	}
	const X = ((H % 120 <= 60 ? H - dH : dH - H) / 60) * (MAX - MIN) + MIN
	const R = HSL_to_RGB_rota((H + 120) % 360, MIN, MAX, X)
	const G = HSL_to_RGB_rota(H, MIN, MAX, X)
	const B = HSL_to_RGB_rota((H + 240) % 360, MIN, MAX, X)
	return { R, G, B }
}
function HSL_to_RGB_rota(H, MIN, MAX, X) {
	if (60 < H && H <= 180) {
		return int(MAX)
	} else if (240 < H && H <= 360) {
		return int(MIN)
	} else {
		return int(X)
	}
}
function int(n) {
	return Math.floor(Number(n))
}
/* --------------------------------------------------------------------------------------------- */
