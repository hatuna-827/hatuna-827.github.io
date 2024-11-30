let codecount=document.getElementsByTagName('pre').length;
for(let i=1 ; i<=codecount ; i++){
    document.getElementById('code'+i).insertAdjacentHTML('beforebegin','<div id="button"><button id="button'+i+'" onclick="copy('+i+')">copy</button></div>');
}
function copy(target_id){
    var target = document.getElementById("code"+target_id);
    navigator.clipboard.writeText(target.textContent);
    document.getElementById("button"+target_id).textContent = 'copied!';
    setTimeout(function() {
        document.getElementById("button"+target_id).textContent = 'copy';
    }, 1000);
}
