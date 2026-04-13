/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
/* - init -------------------------------------------------------------------------------------- */
document.getElementById('input').value = `#888
#000
#fff
`
update_palette()
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('add').addEventListener('click', function () {
	const color = document.getElementById('color').value
	const input = document.getElementById('input')
	input.value += `${color}\n`
	update_palette()
})
document.getElementById('input').addEventListener('input', update_palette)
document.getElementById('palette').addEventListener('click', function (event) {
	copy_color(event, this)
})
/* - function ---------------------------------------------------------------------------------- */
function update_palette() {
	const palette = document.getElementById('palette')
	const colors = document.getElementById('input').value.split('\n')
	palette.innerHTML = ''
	palette.style.backgroundColor = colors[0] ?? '#0000'
	palette.dataset.color_code = colors[0] ?? ''
	colors.splice(0, 1)
	colors.forEach(color_code => {
		const color = document.createElement('div')
		color.className = 'color'
		color.style.backgroundColor = color_code
		color.textContent = color_code
		color.title = color_code
		color.dataset.color_code = color_code
		color.addEventListener('click', function (event) {
			copy_color(event, this)
		})
		palette.appendChild(color)
	})
}
function copy_color(event, target) {
	navigator.clipboard.writeText(target.dataset.color_code)
	event.stopPropagation()
}
/* --------------------------------------------------------------------------------------------- */
