/* - const ------------------------------------------------------------------------------------- */
let data = []
let tiles = []
let turn = 0
/* - init -------------------------------------------------------------------------------------- */
const board = document.getElementById('board')
for (let i = 0; i < 9; ++i) {
	const tile = document.createElement('div')
	tile.addEventListener('click', function () {
		if ((turn !== 0) & (data[i] === 0)) {
			data[i] = turn
			tiles[i].classList.add(turn === 1 ? 'O' : 'X')
			check()
			turn *= -1
		}
	})
	board.appendChild(tile)
	tiles.push(tile)
}
reset()
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById('reset').addEventListener('click', reset)
document.getElementById('pop').addEventListener('click', hidepop)
/* - function ---------------------------------------------------------------------------------- */
function reset() {
	tiles.forEach(tile => {
		tile.className = 'tile'
	})
	data = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	turn = 1
}
function check() {
	if (
		[
			data[0] + data[1] + data[2],
			data[3] + data[4] + data[5],
			data[6] + data[7] + data[8],
			data[0] + data[3] + data[6],
			data[1] + data[4] + data[7],
			data[2] + data[5] + data[8],
			data[0] + data[4] + data[8],
			data[2] + data[4] + data[6],
		].includes(turn * 3)
	) {
		end(turn)
	} else if (!data.includes(0)) {
		end(0)
	}
}

function end(winner) {
	document.getElementById('winner').className = winner === 0 ? 'draw' : winner === 1 ? 'O' : 'X'
	document.getElementById('ifdraw').textContent = winner === 0 ? 'draw!' : 'winner!'
	document.getElementById('pop').className = 'display'
	turn = 0
}
function hidepop() {
	document.getElementById('pop').className = ''
	reset()
}
/* --------------------------------------------------------------------------------------------- */
