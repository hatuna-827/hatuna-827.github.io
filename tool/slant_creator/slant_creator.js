"use strict"
/* - import ------------------------------------------------------------------------------------ */
import dialog from "/module/dialog.js"
import obj_manip from "/module/obj_manip.js"
/* - const ------------------------------------------------------------------------------------- */
let settings_display = "none"
let popup = false
let now_data = {}
let loop_checked = []
let root = []
let loop_goal = {}
let auto_fill_ans = []
let auto_fill_count = 0
let if_shift = false
// pan and zoom
let scale = 2
let originX = 0
let originY = 0
let startX, startY
let isDragging = false
let zoom_min = 0.2
let zoom_max = 5
/* - init -------------------------------------------------------------------------------------- */
update_create_space()
/* - add eventListener ------------------------------------------------------------------------- */
// menu
document.getElementById("add-button").addEventListener('click', { menu_id: document.getElementById("add"), handleEvent: displaymenu })
document.getElementById("setting-button").addEventListener('click', { menu_id: document.getElementById("settings"), handleEvent: displaymenu })
document.getElementById("list-button").addEventListener('click', { menu_id: document.getElementById("list"), handleEvent: displaymenu })
// add
document.getElementById("square").addEventListener('click', function () {
	const width = document.getElementById("width")
	const height = document.getElementById("height")
	if (this.checked) {
		width.disabled = true
		width.value = height.value
	} else {
		width.disabled = false
	}
})
document.getElementById("height").addEventListener('input', function () {
	const square = document.getElementById("square")
	const width = document.getElementById("width")
	if (square.checked) {
		width.value = this.value
	}
})
document.getElementById("create-new").addEventListener('click', async function () {
	const height = document.getElementById("height")
	const width = document.getElementById("width")
	if (!(height.value % 1 == 0 && height.value > 0 && width.value % 1 == 0 && width.value > 0)) {
		await dialog({ content: "入力内容に誤りがあります。" })
		return
	}
	document.getElementById("auto-fill").checked = false
	document.getElementById("gray-out").checked = false
	document.getElementById("rule").checked = true
	document.getElementById("play-mode").checked = false
	create_new_data()
	hidemenu()
	create_box()
	create_maru()
	document.getElementById("work-space").style.display = "block"
	f_popup()
})
// settings
document.getElementById("auto-save").addEventListener('click', function () {
	if (this.checked) {
		save_button.style.display = "none"
	} else {
		save_button.style.display = "block"
	}
})
document.getElementById("auto-fill").addEventListener('click', async function () {
	if (this.checked) {
		if (now_data.size.x * now_data.size.y > 900) {
			await dialog({ content: "処理量の問題により大きさは900マスまでです。" })
			this.checked = false
		} else {
			const checkSaveFlg = await dialog({ type: "OC", content: "現在の斜線情報がすべて失われます。よろしいですか？" })
			if (checkSaveFlg == 0) {
				auto_fill_box()
			} else {
				this.checked = false
			}
		}
	}
})
document.getElementById("gray-out").addEventListener('click', function () {
	if (this.checked) {
		all_check_gray()
	} else {
		for (let x = 0; x <= now_data.size.x; x++) {
			for (let y = 0; y <= now_data.size.y; y++) {
				document.getElementById(`maru_${x},${y}`).classList.remove("gray")
			}
		}
	}
})
document.getElementById("rule").addEventListener('click', function () {
	if (this.checked) {
		all_check_maru()
		all_check_box()
	} else {
		for (let x = 0; x <= now_data.size.x; x++) {
			for (let y = 0; y <= now_data.size.y; y++) {
				document.getElementById(`maru_${x},${y}`).classList.remove("red")
			}
		}
		for (let x = 0; x < now_data.size.x; x++) {
			for (let y = 0; y < now_data.size.y; y++) {
				document.getElementById(`box_${x},${y}`).classList.remove("red")
			}
		}
	}
})
document.getElementById("play-mode").addEventListener('click', function () {
	const big_maru = document.getElementById("big-maru")
	if (this.checked) {
		big_maru.classList.add("play-mode")
	} else {
		big_maru.classList.remove("play-mode")
	}
})
// list
// workspace
document.getElementById("popup-button").addEventListener('click', f_popup)
document.getElementById("close-button").addEventListener('click', function () {
	const work_space = document.getElementById("work-space")
	if (popup) { f_popup() }
	work_space.style.display = "none"
})
window.addEventListener("keydown", e => {
	if (e.shiftKey) {
		if_shift = true
	}
})
window.addEventListener("keyup", e => {
	if (!e.shiftKey) {
		if_shift = false
	}
})
{
	const create_space = document.getElementById("create-space")
	create_space.addEventListener('mousedown', (e) => {
		isDragging = true
		create_space.style.cursor = 'grabbing'
		startX = e.clientX - originX
		startY = e.clientY - originY
	})
	create_space.addEventListener('mousemove', (e) => {
		if (!isDragging) return
		originX = e.clientX - startX
		originY = e.clientY - startY
		update_create_space()
	})
	create_space.addEventListener('mouseup', () => {
		isDragging = false
		create_space.style.cursor = 'grab'
	})
	create_space.addEventListener('wheel', (e) => {
		e.preventDefault()
		const zoomIntensity = 0.1
		const delta = e.deltaY < 0 ? 1 : -1
		const newScale = scale + delta * zoomIntensity * scale
		scale = Math.min(Math.max(newScale, zoom_min), zoom_max)
		update_create_space()
	})
	document.getElementById("pan-and-zoom").addEventListener('mousedown', (e) => {
		e.stopPropagation()
	})
}
/* - function ---------------------------------------------------------------------------------- */
function update_create_space() {
	const content = document.getElementById("pan-and-zoom")
	content.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`
}
function displaymenu() {
	if (settings_display == this.menu_id) {
		hidemenu()
		settings_display = "none"
	} else {
		hidemenu()
		this.menu_id.style.display = "block"
		settings_display = this.menu_id
	}
}
function hidemenu() {
	add.style.display = "none"
	settings.style.display = "none"
	list.style.display = "none"
}
function f_popup() {
	const homebar = document.getElementById("homebar")
	const menu_space = document.getElementById("menu-space")
	const popup_close = document.getElementById("popup-close")
	const popup_open = document.getElementById("popup-open")
	if (popup) {
		homebar.style.display = "block"
		menu_space.style.display = "block"
		popup_close.style.display = "none"
		popup_open.style.display = "inline"
		popup = false
	} else {
		homebar.style.display = "none"
		menu_space.style.display = "none"
		popup_close.style.display = "inline"
		popup_open.style.display = "none"
		popup = true
	}
}
// create_new
function create_new_data() {
	const height = document.getElementById("height")
	const width = document.getElementById("width")
	now_data = {
		size: { x: width.value * 1, y: height.value * 1 }, box: [], maru: []
	}
	now_data.box = obj_manip.array_2d.create(now_data.size.x, now_data.size.y, 0)
	now_data.maru = obj_manip.array_2d.create(now_data.size.x + 1, now_data.size.y + 1, "")
}
function create_box() {
	const big_box = document.getElementById("big-box")
	big_box.innerHTML = ""
	for (let y = 0; y < now_data.size.y; y++) {
		for (let x = 0; x < now_data.size.x; x++) {
			const new_box = document.createElement("div")
			new_box.classList.add("box")
			new_box.id = `box_${x},${y}`
			new_box.addEventListener('click', function () { push_box(x, y) })
			if (now_data.box[x][y] == 1) { new_box.classList.add("f") }
			if (now_data.box[x][y] == -1) { new_box.classList.add("b") }
			big_box.insertAdjacentElement('beforeend', new_box)
		}
		big_box.insertAdjacentElement('beforeend', document.createElement('br'))
	}
}
function create_maru() {
	const big_maru = document.getElementById("big-maru")
	big_maru.innerHTML = ""
	for (let y = 0; y <= now_data.size.y; y++) {
		for (let x = 0; x <= now_data.size.x; x++) {
			const new_maru = document.createElement("div")
			new_maru.classList.add("maru")
			new_maru.id = `maru_${x},${y}`
			new_maru.addEventListener('click', function () { push_maru(x, y) })
			new_maru.textContent = now_data.maru[x][y]
			if (new_maru.textContent != "") {
				new_maru.classList.add("disp")
			}
			big_maru.insertAdjacentElement('beforeend', new_maru)
		}
		big_maru.insertAdjacentElement('beforeend', document.createElement('br'))
	}
}
function push_box(x, y) {
	const auto_fill = document.getElementById("auto-fill")
	const gray_out = document.getElementById("gray-out")
	const rule = document.getElementById("rule")
	if (auto_fill.checked) { return }
	const targetbox = document.getElementById(`box_${x},${y}`)
	const c_list = targetbox.classList
	if (now_data.box[x][y] == -1) {
		c_list.remove("b")
		c_list.add("f")
		now_data.box[x][y] = 1
	}
	else if (now_data.box[x][y] == 1) {
		c_list.remove("f")
		now_data.box[x][y] = 0
	}
	else {
		c_list.add("b")
		now_data.box[x][y] = -1
	}
	c_list.remove("green")
	if (if_shift) {
		c_list.add("green")
	}
	if (rule.checked) {
		check_maru(x, y)
		check_maru(x + 1, y)
		check_maru(x, y + 1)
		check_maru(x + 1, y + 1)
		all_check_box()
	}
	if (gray_out.checked) {
		check_gray(x, y)
		check_gray(x + 1, y)
		check_gray(x, y + 1)
		check_gray(x + 1, y + 1)
	}
}
function push_maru(x, y) {
	const auto_fill = document.getElementById("auto-fill")
	const gray_out = document.getElementById("gray-out")
	const rule = document.getElementById("rule")
	if (document.getElementById("play-mode").checked) { return }
	const targetmaru = document.getElementById(`maru_${x},${y}`)
	targetmaru.classList.add("disp")
	let next_num
	if (now_data.maru[x][y] === "") {
		next_num = 1
	} else {
		if (now_data.maru[x][y] == 0) {
			next_num = ""
			targetmaru.classList.remove("disp")
		}
		else if (now_data.maru[x][y] < 4) { next_num = now_data.maru[x][y] + 1 }
		else if (now_data.maru[x][y] == 4) { next_num = 0 }
	}
	targetmaru.innerText = next_num
	now_data.maru[x][y] = next_num
	if (auto_fill.checked) { auto_fill_box() }
	if (gray_out.checked) { check_gray(x, y) }
	if (rule.checked) { check_maru(x, y) }
}
function all_check_gray() {
	for (let x = 0; x <= now_data.size.x; x++) {
		for (let y = 0; y <= now_data.size.y; y++) {
			check_gray(x, y)
		}
	}
}
function check_gray(x, y) {
	const targetmaru = document.getElementById(`maru_${x},${y}`)
	targetmaru.classList.remove("gray")
	if (targetmaru.innerText == "") { return }
	const link_box = check_link_box(x, y, now_data.size, now_data.box)
	const link_wall = check_link_wall(x, y, now_data.size)
	// 接続
	if (now_data.maru[x][y] == link_box.true) { targetmaru.classList.add("gray") }
	// 未接続
	if (link_wall.up && link_wall.right && link_wall.down && link_wall.left) {
		// 壁0
		if (now_data.maru[x][y] == 4 - link_box.false) { targetmaru.classList.add("gray") }
	} else if (link_wall.up + link_wall.right + link_wall.down + link_wall.left == 3) {
		// 壁1
		if (now_data.maru[x][y] == 2 - link_box.false) { targetmaru.classList.add("gray") }
	} else {
		// 壁2
		if (now_data.maru[x][y] == 1 - link_box.false) { targetmaru.classList.add("gray") }
	}
}
function all_check_maru() {
	for (let x = 0; x <= now_data.size.x; x++) {
		for (let y = 0; y <= now_data.size.y; y++) {
			check_maru(x, y)
		}
	}
}
function check_maru(x, y) {
	const targetmaru = document.getElementById(`maru_${x},${y}`)
	targetmaru.classList.remove("red")
	if (check_maru_data(x, y, now_data.size, now_data.box, now_data.maru)) { targetmaru.classList.add("red") }
}
function check_maru_data(x, y, size, box_data, maru_data) {
	if (maru_data[x][y] === "") { return false }
	const link_box = check_link_box(x, y, size, box_data)
	const link_wall = check_link_wall(x, y, size)
	// 超過
	if (maru_data[x][y] < link_box.true) { return true }
	// 不足
	if (link_wall.up && link_wall.right && link_wall.down && link_wall.left) {
		// 壁0
		if (maru_data[x][y] > 4 - link_box.false) { return true }
		if (maru_data[x][y] == 0) { return true }
	} else if (link_wall.up + link_wall.right + link_wall.down + link_wall.left == 3) {
		// 壁1
		if (maru_data[x][y] > 2 - link_box.false) { return true }
		if (maru_data[x][y] > 2) { return true }
	} else {
		// 壁2
		if (maru_data[x][y] > 1 - link_box.false) { return true }
		if (maru_data[x][y] > 1) { return true }
	}
	return false
}
function check_link_box(x, y, size, box_data) {
	const link_box = { true: 0, false: 0 }
	const link_wall = check_link_wall(x, y, size)
	const pattern = [
		{ wall: ["down", "right"], dx: 0, dy: 0, slant: -1 },
		{ wall: ["up", "right"], dx: 0, dy: -1, slant: 1 },
		{ wall: ["down", "left"], dx: -1, dy: 0, slant: 1 },
		{ wall: ["up", "left"], dx: -1, dy: -1, slant: -1 },
	]
	pattern.forEach(({ wall, dx, dy, slant }) => {
		if (link_wall[wall[0]] && link_wall[wall[1]]) {
			if (box_data[x + dx][y + dy] == slant) { link_box.true++ }
			if (box_data[x + dx][y + dy] == slant * -1) { link_box.false++ }
		}
	})
	return link_box
}
function all_check_box() {
	loop_checked = obj_manip.array_2d.create(now_data.size.x, now_data.size.y, 0)
	for (let x = 0; x < now_data.size.x; x++) {
		for (let y = 0; y < now_data.size.y; y++) {
			document.getElementById(`box_${x},${y}`).classList.remove("red")
		}
	}
	const loop = all_check_box_data(now_data.size, now_data.box)
	for (let x = 0; x < now_data.size.x; x++) {
		for (let y = 0; y < now_data.size.y; y++) {
			if (loop.loop.includes(loop.map[x][y])) {
				document.getElementById(`box_${x},${y}`).classList.add("red")
			}
		}
	}
}
function all_check_box_data(size, box_data) {
	let result = { map: obj_manip.array_2d.create(size.x, size.y, -1), loop: [] }
	let conn = { list: Array(size.x + 1).fill().map((v, i) => ++i), tmp: 0, count: size.x + 1 }
	for (let x = 0; x < size.x; x++) {
		for (let y = 0; y < size.y; y++) {
			if (box_data[x][y] === -1) {
				result.map[x][y]=conn.tmp
				const tmp = conn.tmp
				conn.tmp = conn.list[x + 1]
				conn.list[x + 1] = tmp
			} else if (box_data[x][y] === 0) {
				conn.tmp = conn.list[x + 1]
				conn.list[x + 1] = ++conn.count
			} else if (box_data[x][y] === 1) {
				conn = replace_conn(conn, conn.list[x], conn.list[x + 1])
				conn.tmp = conn.list[x + 1]
				conn.list[x + 1] = ++conn.count
			}
			if (x == size.x - 1) {
				conn.tmp = conn.list[0]
				conn.list[0] = ++conn.count
			}
		}
	}
	return result
}
function check_box_data(x, y, size, box_data) {
	if (box_data[x][y] == 0) { return false }
	let queue = []
	root = obj_manip.array_2d.create(size.x + 1, size.y + 1, 0)
	if (box_data[x][y] == 1) {
		queue.push({ x: x + 1, y: y })
		root[x + 1][y] = 1
		loop_goal = { x: x, y: y + 1 }
	}
	if (box_data[x][y] == -1) {
		queue.push({ x: x, y: y })
		root[x][y] = 1
		loop_goal = { x: x + 1, y: y + 1 }
	}
	box_data[x][y] *= -1
	while (queue.length != 0) {
		const P = queue[0]
		// console.log(queue, P)
		const link_wall = check_link_wall(P.x, P.y, size)
		const pattern = [
			{ wall: ["up", "right"], nPx: 1, nPy: -1, Px: 0, Py: -1, slant: 1 },
			{ wall: ["up", "left"], nPx: -1, nPy: -1, Px: -1, Py: -1, slant: -1 },
			{ wall: ["down", "right"], nPx: 1, nPy: 1, Px: 0, Py: 0, slant: -1 },
			{ wall: ["down", "left"], nPx: -1, nPy: 1, Px: -1, Py: 0, slant: 1 }
		]
		for (const { wall, nPx, nPy, Px, Py, slant } of pattern) {
			if (link_wall[wall[0]] && link_wall[wall[1]]) {
				const n = { x: P.x + nPx, y: P.y + nPy }
				if (box_data[P.x + Px][P.y + Py] == slant && root[n.x][n.y] == 0) {
					if (loop_check(n, P, queue)) { box_data[x][y] *= -1; return true }
				}
			}
		}
		queue.shift()
	}
	box_data[x][y] *= -1
	return false
}
function loop_check(n, P, queue) {
	root[n.x][n.y] = root[P.x][P.y] + 1
	queue.push(n)
	if (n.x == loop_goal.x && n.y == loop_goal.y) { return true }
	return false
}
function loop_red_box() {
	// console.log("ループ発見", loop_goal, root)
	let l_P = loop_goal
	while (root[l_P.x][l_P.y] != 1) {
		// console.log("色塗り中", l_P, root[l_P.x][l_P.y])
		const link_wall = check_link_wall(l_P.x, l_P.y, now_data.size)
		const pattern = [
			{ wall: ["up", "right"], nPx: 1, nPy: -1, lPx: 0, lPy: -1 },
			{ wall: ["up", "left"], nPx: -1, nPy: -1, lPx: -1, lPy: -1 },
			{ wall: ["down", "right"], nPx: 1, nPy: 1, lPx: 0, lPy: 0 },
			{ wall: ["down", "left"], nPx: -1, nPy: 1, lPx: -1, lPy: 0 }
		]
		for (const { wall, nPx, nPy, lPx, lPy } of pattern) {
			if (link_wall[wall[0]] && link_wall[wall[1]]) {
				const n_P = { x: l_P.x + nPx, y: l_P.y + nPy }
				if (root[l_P.x][l_P.y] - root[n_P.x][n_P.y] == 1) {
					red_box(l_P.x + lPx, l_P.y + lPy)
					l_P = n_P
					break
				}
			}
		}
	}
	red_box((l_P.x + loop_goal.x) / 2 - 0.5, (l_P.y + loop_goal.y) / 2 - 0.5)
}
function red_box(x, y) {
	// console.log("red_box", x, y)
	document.getElementById(`box_${x},${y}`).classList.add("red")
	loop_checked[x][y] = 1
}
function check_link_wall(x, y, size) {
	return {
		up: y != 0,
		right: x != size.x,
		down: y != size.y,
		left: x != 0
	}
}
function auto_fill_box() {
	const gray_out = document.getElementById("gray-out")
	const rule = document.getElementById("rule")
	const start = Date.now()
	now_data.box = f_auto_fill_data(now_data.size, now_data.maru)
	console.log(Date.now() - start)
	create_box()
	if (gray_out.checked) { all_check_gray() }
	if (rule.checked) { all_check_maru() }
}
function f_auto_fill_data(size, maru_data) {
	const auto_fill_data = { box: obj_manip.array_2d.create(size.x, size.y, 0), maru: maru_data }
	auto_fill_ans = obj_manip.array_2d.create(size.x, size.y, 0)
	auto_fill_count = 0
	// let i = 0
	// while (i < 2) {
	// 	i++
	// 	let minX, maxX, minY, maxY, no_break = true
	// 	for (let x = 0; x <= size.x; x++) {
	// 		for (let y = 0; y <= size.y; y++) {
	// 			if (auto_fill_data.maru[x][y] !== "") {
	// 				no_break = false;
	// 				[minX, maxX, minY, maxY] = [x, x, y, y]
	// 			}
	// 		}
	// 		if (!no_break) { break }
	// 	}
	// 	if (no_break) { break }
	// 	let x = maxX, y = minY
	// 	console.log(minX, maxX, minY, maxY)
	// 	while (auto_fill_data.maru[x][y] !== "") {
	// 		console.log(x)
	// 		x++
	// 	}
	// 	console.log(x)
	// 	// minX = x
	// }
	auto_fill_DFS(size, auto_fill_data, 0, { list: Array(size.x + 1).fill().map((v, i) => ++i), tmp: 0, count: size.x + 1 })
	for (let x = 0; x < size.x; x++) {
		for (let y = 0; y < size.y; y++) {
			auto_fill_ans[x][y] = Math.trunc(auto_fill_ans[x][y] / auto_fill_count)
		}
	}
	return auto_fill_ans
}
function auto_fill_DFS(size, _tmp_data, node, _conn) {
	const tmp_data = JSON.parse(JSON.stringify(_tmp_data))
	const x = node % size.x
	const y = Math.floor(node / size.x)
	if (size.x * size.y == node) {
		// console.log("One answer")
		// console.log(JSON.stringify(tmp_data.box))
		auto_fill_count++
		for (let x = 0; x < size.x; x++) {
			for (let y = 0; y < size.y; y++) {
				auto_fill_ans[x][y] += tmp_data.box[x][y]
			}
		}
		return
	}
	tmp_data.box[x][y] = -1
	if (!(check_maru_data(x, y, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x + 1, y, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x, y + 1, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x + 1, y + 1, size, tmp_data.box, tmp_data.maru))) {
		let conn = JSON.parse(JSON.stringify(_conn))
		const tmp1 = conn.tmp
		conn.tmp = conn.list[x + 1]
		conn.list[x + 1] = tmp1
		if (x == size.x - 1) {
			conn.tmp = conn.list[0]
			conn.list[0] = ++conn.count
		}
		auto_fill_DFS(size, tmp_data, node + 1, conn)
	}
	tmp_data.box[x][y] = 1
	if (!(check_maru_data(x, y, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x + 1, y, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x, y + 1, size, tmp_data.box, tmp_data.maru) ||
		check_maru_data(x + 1, y + 1, size, tmp_data.box, tmp_data.maru) ||
		_conn.list[x] == _conn.list[x + 1])) {
		let conn = JSON.parse(JSON.stringify(_conn))
		conn = replace_conn(conn, conn.list[x], conn.list[x + 1])
		conn.tmp = conn.list[x + 1]
		conn.list[x + 1] = ++conn.count
		if (x == size.x - 1) {
			conn.tmp = conn.list[0]
			conn.list[0] = ++conn.count
		}
		auto_fill_DFS(size, tmp_data, node + 1, conn)
	}
}
function replace_conn(old, from, to) {
	const conn = JSON.parse(JSON.stringify(old))
	conn.list.forEach((x, i) => conn.list[i] = x == from ? to : x)
	conn.tmp = conn.tmp == from ? to : conn.tmp
	return conn
}
/* - init -------------------------------------------------------------------------------------- */
document.getElementById("add-button").click()
document.getElementById("create-new").click()

// console.log(JSON.stringify(f_auto_fill_data({ x: 3, y: 3 },
// 	[
// 		['', '', '', ''],
// 		['', '', '1', ''],
// 		['', '1', '', ''],
// 		['', '', '', '']
// 	]
// )))
// console.log(JSON.stringify(f_auto_fill_data({ x: 3, y: 3 },
// 	[
// 		['', '', '', ''],
// 		['', '1', '', ''],
// 		['', '', '1', ''],
// 		['', '', '', '']
// 	]
// )))
// const start = Date.now()
// f_auto_fill_data({ x: 5, y: 5 },
// 	[
// 		['1', '', '', '', '', ''],
// 		['', '', '', '', '', ''],
// 		['', '', '', '1', '', '2'],
// 		['', '', '1', '', '', ''],
// 		['', '', '', '', '', ''],
// 		['', '', '', '', '', '1']
// 	]
// ).forEach((line) => {
// 	console.log(JSON.stringify(line))
// })
// // [
// // 	['', '', '', '', '', ''],
// // 	['', '', '', '', '', ''],
// // 	['', '', '', '1', '', ''],
// // 	['', '', '1', '', '', ''],
// // 	['', '', '', '', '', ''],
// // 	['', '', '', '', '', '']
// // ]
// // 13100
// //  9100
// //  9500
// //  9400
// console.log("time:", Date.now() - start)
// console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑")
/* --------------------------------------------------------------------------------------------- */