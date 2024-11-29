document.getElementById('homebar').innerHTML="<a href='https://hatuna-827.github.io/'>hatuna-827</a>";

function copy(target_id){
    var target = document.getElementById("code"+target_id);
    navigator.clipboard.writeText(target.textContent);
    let text = document.getElementById("button"+target_id).textContent;
    document.getElementById("button"+target_id).textContent = 'copied!';
}