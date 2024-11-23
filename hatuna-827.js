function copy(target_id){
    var target = document.getElementById("code"+target_id);
    navigator.clipboard.writeText(target.textContent);
    let text = document.getElementById("button"+target_id).textContent;
    document.getElementById("button"+target_id).textContent = 'copied!';
}