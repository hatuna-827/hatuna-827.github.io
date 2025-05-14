document.addEventListener('DOMContentLoaded', function() {
document.getElementsByTagName('h1')[0].insertAdjacentHTML('afterend','<div id="tag"></div>')
var tag_target=document.getElementsByTagName('h2')
for (i=0;i<tag_target.length;i++){
    tag_target[i].insertAdjacentHTML('beforebegin','<hr id="'+tag_target[i].innerText+'">')
    document.getElementById('tag').insertAdjacentHTML('beforeend','<a href="#'+tag_target[i].innerText+'">'+(i+1)+'.'+tag_target[i].innerText+'</a>\n')
}
document.getElementById('tag').insertAdjacentHTML('beforebegin','<h2>目次<h2>')
let code_target=document.getElementsByTagName('pre')
for(let i=0;i<code_target.length;i++){
    code_target[i].setAttribute('id','code'+i)
    document.getElementById('code'+i).insertAdjacentHTML('beforebegin','<div id="button"><button id="button'+i+'" onclick="copy('+i+')">copy</button></div>')
}
var img=document.getElementsByTagName('img')
for(let i=0;i<img.length;i++){
    img[i].setAttribute('alt','画像の読み込みに失敗しました。')
}
var link=document.getElementsByTagName('a')
for(let i=1;i<link.length;i++){
    link[i].setAttribute('target','_blank')
}
})
function copy(target_id){
    var target=document.getElementById('code'+target_id)
    navigator.clipboard.writeText(target.textContent)
    document.getElementById('button'+target_id).textContent = 'copied!'
    setTimeout(function() {
        document.getElementById('button'+target_id).textContent = 'copy'
    }, 1000)
}
