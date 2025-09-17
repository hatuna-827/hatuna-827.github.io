let date
let point
let log = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
let nul = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
let save_point = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
let random_point = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
reset()
function reset() {
	point = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
	date = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
	hidepoint()
	out()
}
function out() {
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (date[x][y] == 0) {
				document.getElementById(x * 3 + y).style.backgroundColor = "var(--main-bg-color)"
			} else {
				document.getElementById(x * 3 + y).style.backgroundColor = "var(--main-light-color)"
			}
		}
	}
}
function push(x, y) {
	if (point[x][y] == 0) { point[x][y] = 1 } else { point[x][y] = 0 }
	log[x][y] += 1
	change(x, y)
	out()
	if (JSON.stringify(log) == JSON.stringify(random_point)) {
		document.getElementById("pop").style.display = 'flex'
	}
}
function change(x, y) {
	changeif(x, y)
	if (x != 0) { changeif(x - 1, y) }
	if (y != 2) { changeif(x, y + 1) }
	if (x != 2) { changeif(x + 1, y) }
	if (y != 0) { changeif(x, y - 1) }
}
function changeif(x, y) {
	if (date[x][y] == 0) { date[x][y] = 1 } else { date[x][y] = 0 }
}
function random() {
	hidepoint()
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (Math.floor(Math.random() * 2) == 0) { random_point[x][y] = 1 }
			else { random_point[x][y] = 0 }
		}
	}
	load(random_point, 1)
}
function load(input, x) {
	hidepoint()
	if (x == 1) { log = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] }
	point = JSON.parse(JSON.stringify(input))
	date = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (point[x][y] == 1) { change(x, y) }
		}
	}
	out()
}
function save() {
	save_point = JSON.parse(JSON.stringify(point))
}
function answer() {
	load(random_point, 1)
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			if (point[x][y] == 1) { document.getElementById(x * 3 + y).textContent = "・" }
			else { document.getElementById(x * 3 + y).textContent = "" }
		}
	}
}
function hidepoint() {
	for (let i = 0; i < 9; i++) {
		document.getElementById(i).textContent = ""
	}
}
function hidepop() {
	load(random_point, 1)
	document.getElementById("pop").style.display = 'none'
}
