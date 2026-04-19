'use strict'
/* - import ------------------------------------------------------------------------------------ */
import { HEX_to_RGB, RGB_to_HEX, RGB_to_HSL, HSL_to_RGB } from '/module/color.js'
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
				color[c] = Number(document.getElementById(c).value)
			})
			break
		case 'HSL':
			const HSL = Object.fromEntries(
				['H', 'S', 'L'].map(v => [v, Number(document.getElementById(v).value)])
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
	document.getElementById('hex').textContent = RGB_to_HEX(color)
	document.getElementById('color').style.backgroundColor = `rgb(${color.R},${color.G},${color.B})`
}
/* --------------------------------------------------------------------------------------------- */
