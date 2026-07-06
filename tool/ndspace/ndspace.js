/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
const graph_draw_size = 1000
const graph_display_size = 500
let points = [
	{ x: 0.3, y: 0.3 },
	{ x: 0.75, y: 0.3 },
	{ x: 0.3, y: 0.75 },
	{ x: 0.5, y: 0.25 },
	{ x: 0.0, y: 0.25 },
]
let drag_pointer_index = null
/* - init -------------------------------------------------------------------------------------- */
update_graph()
/* - add eventListener ------------------------------------------------------------------------- */
window.addEventListener('dragstart', function (e) {
	if (e.target.classList?.contains('pointer')) {
		drag_pointer_index = e.target.dataset.index
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setDragImage(new Image(), 0, 0)
	} else {
		e.preventDefault()
	}
})
window.addEventListener('dragover', function (e) {
	e.preventDefault()
	if (!drag_pointer_index) {
		return
	}
	const size = document.getElementById('graph').getBoundingClientRect()
	points[drag_pointer_index].x =
		Math.floor(Math.max(0, Math.min(1, (e.clientX - size.left) / size.width)) * 1000) / 1000
	points[drag_pointer_index].y =
		Math.floor((1 - Math.max(0, Math.min(1, (e.clientY - size.top) / size.height))) * 1000) / 1000
	update_graph()
})
window.addEventListener('dragend', function () {
	drag_pointer_index = null
})
/* - function ---------------------------------------------------------------------------------- */
function update_graph() {
	const graph = document.getElementById('graph')
	graph.style.height = graph_display_size + 'px'
	graph.style.width = graph_display_size + 'px'
	for (let i = 0; i < 5; ++i) {
		document.getElementById(`p${i}`).style.left = graph_display_size * points[i].x + 'px'
		document.getElementById(`p${i}`).style.top = graph_display_size * (1 - points[i].y) + 'px'
	}
	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, graph_draw_size, graph_draw_size)
	ctx.strokeStyle = '#666'
	ctx.lineWidth = '3'
	ctx.beginPath()
	const O = { x: points[0].x * graph_draw_size, y: (1 - points[0].y) * graph_draw_size }
	for (let d = 1; d <= 4; ++d) {
		const P = { x: points[d].x * graph_draw_size, y: (1 - points[d].y) * graph_draw_size }
		ctx.moveTo(O.x, O.y)
		ctx.lineTo(P.x, P.y)
		ctx.strokeStyle = '#666'
		for (let i = 1; i <= 4; ++i) {
			Q = { x: ((P.x - O.x) * i) / 4 + O.x, y: ((P.y - O.y) * i) / 4 + O.y }
			for (let j = 1; j <= 4; ++j) {
				if (d === j) {
					continue
				}
				const R = { x: points[j].x * graph_draw_size, y: (1 - points[j].y) * graph_draw_size }
				ctx.moveTo(Q.x, Q.y)
				ctx.lineTo(Q.x + R.x - O.x, Q.y + R.y - O.y)
			}
		}
	}
	ctx.stroke()
}
/* --------------------------------------------------------------------------------------------- */
