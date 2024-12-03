let codecount=document.getElementsByTagName('pre').length;
for(let i=1 ; i<=codecount ; i++){
    document.getElementById('code'+i).insertAdjacentHTML('beforebegin','<div id="button"><button id="button'+i+'" onclick="copy('+i+')">copy</button></div>');
}
var img = document.getElementsByTagName('img');
for(let i=0 ; i<img.length ; i++){
    img[i].setAttribute("alt","画像の読み込みに失敗しました。");
}
function copy(target_id){
    var target = document.getElementById("code"+target_id);
    navigator.clipboard.writeText(target.textContent);
    document.getElementById("button"+target_id).textContent = 'copied!';
    setTimeout(function() {
        document.getElementById("button"+target_id).textContent = 'copy';
    }, 1000);
}
