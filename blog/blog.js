document.addEventListener('DOMContentLoaded', function () {
    var img = document.getElementsByTagName('img')
    for (let i = 0; i < img.length; i++) {
        img[i].setAttribute('alt', '画像の読み込みに失敗しました。')
    }
    var link = document.getElementsByTagName('a')
    for (let i = 1; i < link.length; i++) {
        link[i].setAttribute('target', '_blank')
    }
    // 目次の追加
    let tag = document.createElement("div")
    tag.id = "tag"
    document.querySelector("h1").insertAdjacentElement("afterend",tag)
    var tag_target = document.getElementsByTagName('h2')
    for (i = 0; i < tag_target.length; i++) {
        let tag_text = tag_target[i].innerText.replace(/"/g, "'")
        let tag_hr = document.createElement("hr")
        let tag_link = document.createElement("a")
        let tag_br = document.createElement("br")
        tag_hr.id = tag_text
        tag_link.textContent = (i + 1) + '.' + tag_target[i].innerText
        tag_link.setAttribute("href", "#" + tag_text)
        tag_target[i].insertAdjacentElement('beforebegin', tag_hr)
        tag.insertAdjacentElement('beforeend', tag_link)
        tag.insertAdjacentElement('beforeend', tag_br)
    }
    tag.insertAdjacentHTML('beforebegin', '<h2>目次<h2>')
    // コピーボタンの追加
    let code_target = document.getElementsByTagName('pre')
    for (let i = 0; i < code_target.length; i++) {
        code_target[i].setAttribute('id', 'code' + i)
        code_target[i].insertAdjacentHTML('beforebegin', '<div id="button"><button id="button' + i + '" onclick="copy(' + i + ')">copy</button></div>')
    }
})
function copy(target_id) {
    var target = document.getElementById('code' + target_id)
    navigator.clipboard.writeText(target.textContent)
    document.getElementById('button' + target_id).textContent = 'copied!'
    setTimeout(function () {
        document.getElementById('button' + target_id).textContent = 'copy'
    }, 1000)
}
