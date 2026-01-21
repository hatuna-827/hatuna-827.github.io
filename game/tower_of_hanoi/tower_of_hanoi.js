/* - import ------------------------------------------------------------------------------------ */
import dialog from "/module/dialog.js"
import structure from "/module/structure.js"
/* - const ------------------------------------------------------------------------------------- */
const setting_structure = {
	step_count: { type: "number", display_name: "段数", min: 1, step: 1, default: 5, placeholder: " 1 ~" },
	display_index: { type: "boolean", display_name: "インデックスの表示" }
}

let step_count = 5
let select_index = null
const box_list = [0, 1, 2].map((i) => { return document.getElementById(`box${i}`) })
let disk_data
let move_count
let start_time
let time
let timerID
/* - init -------------------------------------------------------------------------------------- */
structure.def_struct("setting_structure", setting_structure)
structure.set("setting-structure", "setting_structure")
reset_disks()
/* - add eventListener ------------------------------------------------------------------------- */
document.addEventListener('keydown', event => {
	if (["f", "a", "v"].includes(event.key)) {
		push(0)
	} else if (["g", "h", "w", "s", "b"].includes(event.key)) {
		push(1)
	} else if (["j", "d", "n"].includes(event.key)) {
		push(2)
	}
})
box_list.forEach((box, i) => { box.addEventListener('pointerdown', function () { push(i) }) })
document.getElementById("reset").addEventListener('click', reset_disks)
document.getElementById("rule").addEventListener('click', function () {
	dialog({
		title: "ルール",
		content: `ハノイの塔は、すべての円盤を決められたルールに従って
		別の場所に移動させることを目標にしたパズルゲームです。\n
		円盤を一回に一枚ずつどれかの場所に移動させることがでますが、
		小さな円盤の上に大きな円盤を乗せることはできません。`,
		button: ["閉じる"]
	})
})
document.getElementById("guide").addEventListener('click', function () {
	dialog({
		title: "操作方法",
		content: `動かしたい円盤のあるマスをクリックし、移動先のマスをクリックします。
		段数を指定することができます。\n
		キーボード操作も可能です。
		左:AFV  中央:WSGHB  右:DJN`,
		button: ["閉じる"]
	})
})
document.getElementById("tips").addEventListener('click', function () {
	dialog({
		title: "豆知識",
		content: `n枚の円盤すべてを移動させるには最低
		2^n-1回の手数がかかることが知られています。\n
		ここでの杭は3本だけですが、杭が4本以上のハノイの塔も存在します。`,
		button: ["閉じる"]
	})
})
document.getElementById("setting").addEventListener('click', function () {
	document.getElementById("setting-popup").style.display = "flex"
})
document.getElementById("setting-close").addEventListener('click', function () {
	document.getElementById("setting-popup").style.display = "none"
	reflect_setting()
})
/* - function ---------------------------------------------------------------------------------- */
function reflect_setting() {
	const setting = structure.get("setting-structure").setting_structure
	setting.step_count = setting.step_count < 1 ? 5 : Math.floor(setting.step_count)
	if (setting.step_count !== step_count) {
		step_count = setting.step_count
		reset_disks()
	}
	if (setting.display_index)
		document.getElementById("boxs").classList.add("display-index")
	else
		document.getElementById("boxs").classList.remove("display-index")
}
function reset_disks() {
	box_list.forEach((box) => {
		box.innerHTML = ""
		box.style.height = 24 * step_count - 4 + "px"
	})
	disk_data = [[...Array(step_count)].map((_, i) => i + 1), [], []]
	select_index = null
	move_count = 0
	clearInterval(timerID)
	document.getElementById("step").textContent = step_count
	document.getElementById("move").textContent = 0
	document.getElementById("time").textContent = 0
	document.getElementById("clear").textContent = ""
	render_disks()
}
function render_disks() {
	disk_data.forEach((disks, i) => {
		box_list[i].innerHTML = ""
		disks.forEach((disk) => {
			const new_disk = document.createElement('div')
			new_disk.className = "disk"
			new_disk.textContent = disk
			new_disk.style.width = 100 * disk / step_count + "%"
			if (disk % 2 === 0) { new_disk.classList.add("even") }
			box_list[i].appendChild(new_disk)
		})
	})
}
function push(index) {
	if (disk_data[index].length !== 0 && move_count === 0) {
		start_time = new Date().getTime()
		time = 0
		timerID = setInterval(() => {
			++time
			document.getElementById("time").textContent = `${Math.floor(time / 10)}.${time % 10}`
		}, 100)
	}
	if (select_index === null) {
		if (disk_data[index].length !== 0) {
			box_list[index].classList.add("selected")
			select_index = index
		}
	} else {
		if (select_index === index) {
			box_list[index].classList.remove("selected")
			select_index = null
		} else if (disk_data[index].length === 0 || disk_data[select_index][0] < disk_data[index][0]) {
			box_list[select_index].classList.remove("selected")
			disk_data[index].unshift(disk_data[select_index].shift())
			select_index = null
			++move_count
			document.getElementById("move").textContent = move_count
			if ((index === 1 && disk_data[1].length === step_count) ||
				(index === 2 && disk_data[2].length === step_count)) {
				clearInterval(timerID)
				time = new Date().getTime() - start_time
				document.getElementById("time").textContent = `${Math.floor(time / 1000)}.${("00" + time % 1000).slice(-3)}`
				document.getElementById("clear").textContent = move_count === 2 ** step_count - 1 ? "ゲームクリア 最短！" : "ゲームクリア"
			}
			render_disks()
		}
	}
}
/* --------------------------------------------------------------------------------------------- */
