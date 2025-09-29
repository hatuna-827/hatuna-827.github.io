document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('img').forEach((img) => {
		img.setAttribute('alt', '画像の読み込みに失敗しました。')
		const imgbox = document.createElement('div')
		imgbox.className = "imgbox"
		imgbox.appendChild(img.cloneNode(false))
		img.insertAdjacentElement('afterend', imgbox)
		img.remove()
	})
	document.querySelectorAll('a').forEach((link) => {
		if (!link.getAttribute('target')) {
			link.setAttribute('target', '_blank')
		}
	})
	// 目次の追加
	const tag = document.createElement("div")
	tag.id = "tag"
	document.querySelector("h1").insertAdjacentElement("afterend", tag)
	const tag_target = document.querySelectorAll('h2')
	tag_target.forEach((target, i) => {
		const tag_text = target.innerText.replace(/"/g, "'")
		const tag_hr = document.createElement("hr")
		const tag_link = document.createElement("a")
		const tag_br = document.createElement("br")
		tag_hr.id = tag_text
		tag_link.textContent = (i + 1) + '.' + target.innerText
		tag_link.setAttribute('href', "#" + tag_text)
		target.insertAdjacentElement('beforebegin', tag_hr)
		tag.insertAdjacentElement('beforeend', tag_link)
		tag.insertAdjacentElement('beforeend', tag_br)
	})
	tag.insertAdjacentHTML('beforebegin', '<h2>目次<h2>')
	// コピーボタンの追加
	const code_target = document.querySelectorAll('pre')
	code_target.forEach((target, i) => {
		target.setAttribute('id', "code" + i)
		target.insertAdjacentHTML('beforebegin', '<div class="button"><button id="button' + i + '" onclick="copy(' + i + ')">copy</button></div>')
	})
})
function copy(target_id) {
	const target = document.getElementById('code' + target_id)
	navigator.clipboard.writeText(target.textContent)
	document.getElementById('button' + target_id).textContent = 'copied!'
	setTimeout(function () {
		document.getElementById('button' + target_id).textContent = 'copy'
	}, 1000)
}
