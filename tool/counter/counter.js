let kaunta;
set(0)
function set(num) {
	kaunta = num;
	document.getElementById('num').textContent = kaunta;
}
function setinput() {
	kaunta = Math.floor(document.getElementById('inputnum').value);
	document.getElementById('num').textContent = kaunta;
	document.getElementById('inputnum').value = kaunta;
}
