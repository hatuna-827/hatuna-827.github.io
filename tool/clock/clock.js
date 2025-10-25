for (let i = 11; i > -1; i--) {
	document.getElementById('clock').insertAdjacentHTML('afterbegin', '<div id="scale' + i + '" class="scalebox"><div class="scale"></div><div class="clear"></div></div>')
	document.getElementById("scale" + i).style.transform = `rotate(${30 * i}deg)`
}
function tick() {
	const now = new Date(Date.now() + pm)
	const h = now.getHours()
	const m = now.getMinutes()
	const s = now.getSeconds()
	const hourDeg = h * 30 + m * 0.5 + s * 0.00833333333
	const minuteDeg = m * 6 + s * 0.1
	const secondDeg = s * 6
	document.getElementById("hour").style.transform = `rotate(${hourDeg}deg)`
	document.getElementById("minute").style.transform = `rotate(${minuteDeg}deg)`
	document.getElementById("second").style.transform = `rotate(${secondDeg}deg)`
	document.getElementById("s_hour").style.transform = `rotate(${hourDeg}deg)`
	document.getElementById("s_minute").style.transform = `rotate(${minuteDeg}deg)`
	document.getElementById("s_second").style.transform = `rotate(${secondDeg}deg)`
}
function init() {
	tick()
	setInterval(() => { tick() }, 100)
}
function offset(num) {
	pm = num
}
offset(-3350)
init()
