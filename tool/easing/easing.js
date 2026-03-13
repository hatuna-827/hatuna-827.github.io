/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
const graph_draw_size = 1000
const graph_display_size = 300
let points = [{ x: 0.75, y: 0.25 }, { x: 0.25, y: 0.75 }]
let drag_pointer_index = null
let display_handle
let play_animation
/* - init -------------------------------------------------------------------------------------- */
get_display_handles()
get_play_animation()
update_graph()
update_code()
update_input()
update_animation()
/* - add eventListener ------------------------------------------------------------------------- */
window.addEventListener("dragstart", function (e) {
	if (e.target.classList?.contains("pointer")) {
		drag_pointer_index = e.target.dataset.index
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setDragImage(new Image(), 0, 0)
	} else {
		e.preventDefault()
	}
})
window.addEventListener('dragover', function (e) {
	e.preventDefault()
	if (!drag_pointer_index) { return }
	const size = document.getElementById("graph").getBoundingClientRect()
	points[drag_pointer_index].x = Math.floor((Math.max(0, Math.min(1, (e.clientX - size.left) / size.width))) * 1000) / 1000
	points[drag_pointer_index].y = Math.floor((1 - Math.max(0, Math.min(1, (e.clientY - size.top) / size.height))) * 1000) / 1000
	update_graph()
})
window.addEventListener('dragend', function () {
	drag_pointer_index = null
	update_code()
	update_input()
	update_animation()
})

document.getElementById("display-handles").addEventListener('change', function () {
	get_display_handles()
	update_graph()
})

document.getElementById("play-animation").addEventListener('change', function () {
	get_play_animation()
	update_animation()
})

document.getElementById("code-copy").addEventListener('click', function () {
	navigator.clipboard.writeText(document.getElementById("code-content").textContent)
	this.classList.add("clicked")
	this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4,13 10,19 21,7" /></svg>'
	setTimeout(() => {
		this.classList.remove("clicked")
		this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"><path d="M8,8v-2a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v7a3,3 0 0 1-3,3h-2v2a3,3 0 0 1-3,3h-7a3,3 0 0 1-3-3v-7a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v5" /></svg>'
	}, 1000)
})

document.getElementById("x1").addEventListener('change', change_input)
document.getElementById("y1").addEventListener('change', change_input)
document.getElementById("x2").addEventListener('change', change_input)
document.getElementById("y2").addEventListener('change', change_input)
/* - function ---------------------------------------------------------------------------------- */
function get_display_handles() {
	display_handle = document.getElementById("display-handles").checked
}
function get_play_animation() {
	play_animation = document.getElementById("play-animation").checked
}
function change_input() {
	points[0].x = document.getElementById("x1").value
	points[0].y = document.getElementById("y1").value
	points[1].x = document.getElementById("x2").value
	points[1].y = document.getElementById("y2").value
	update_graph()
	update_code()
	update_animation()
}
function update_graph() {
	const graph = document.getElementById("graph")
	graph.style.height = graph_display_size + "px"
	graph.style.width = graph_display_size + "px"
	document.getElementById("p1").style.left = graph_display_size * points[0].x + "px"
	document.getElementById("p1").style.top = graph_display_size * (1 - points[0].y) + "px"
	document.getElementById("p2").style.left = graph_display_size * points[1].x + "px"
	document.getElementById("p2").style.top = graph_display_size * (1 - points[1].y) + "px"
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#fff"
	ctx.fillRect(0, 0, graph_draw_size, graph_draw_size)
	ctx.strokeStyle = "#ccc"
	ctx.lineWidth = "3"
	for (let i = 0; i <= graph_draw_size; i += 50) {
		ctx.beginPath()
		ctx.moveTo(i, 0)
		ctx.lineTo(i, graph_draw_size)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(0, i)
		ctx.lineTo(graph_draw_size, i)
		ctx.stroke()
	}
	ctx.strokeStyle = "#000"
	ctx.lineWidth = "7"
	ctx.beginPath()
	ctx.moveTo(0, graph_draw_size)
	ctx.bezierCurveTo(
		points[0].x * graph_draw_size, (1 - points[0].y) * graph_draw_size,
		points[1].x * graph_draw_size, (1 - points[1].y) * graph_draw_size,
		graph_draw_size, 0
	)
	ctx.stroke()
	if (display_handle) {
		ctx.strokeStyle = "#3a3"
		ctx.beginPath()
		ctx.moveTo(0, graph_draw_size)
		ctx.lineTo(points[0].x * graph_draw_size, (1 - points[0].y) * graph_draw_size)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(graph_draw_size, 0)
		ctx.lineTo(points[1].x * graph_draw_size, (1 - points[1].y) * graph_draw_size)
		ctx.stroke()
	}
}
function update_code() {
	document.getElementById("code-content").textContent = `cubic-bezier(${points[0].x}, ${points[0].y}, ${points[1].x}, ${points[1].y})`
}
function update_input() {
	document.getElementById("x1").value = points[0].x
	document.getElementById("y1").value = points[0].y
	document.getElementById("x2").value = points[1].x
	document.getElementById("y2").value = points[1].y
}
function update_animation() {
	const box = document.getElementById("slid-box")
	if (play_animation) {
		requestAnimationFrame(() => {
			box.style.animation = `slid 2s alternate infinite cubic-bezier(${points[0].x}, ${points[0].y}, ${points[1].x}, ${points[1].y})`
		})
	} else {
		requestAnimationFrame(() => {
			box.style.animation = ""
		})
	}
}
/* --------------------------------------------------------------------------------------------- */
