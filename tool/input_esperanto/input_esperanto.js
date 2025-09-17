let words
const id_in = document.getElementById('in')
id_in.addEventListener('keyup', word_change)
word_change()
function word_change() {
	id_in.value = id_in.value
		.replace(/C\^/g, 'Ĉ')
		.replace(/G\^/g, 'Ĝ')
		.replace(/H\^/g, 'Ĥ')
		.replace(/J\^/g, 'Ĵ')
		.replace(/S\^/g, 'Ŝ')
		.replace(/U\^/g, 'Ŭ')
		.replace(/c\^/g, 'ĉ')
		.replace(/g\^/g, 'ĝ')
		.replace(/h\^/g, 'ĥ')
		.replace(/j\^/g, 'ĵ')
		.replace(/s\^/g, 'ŝ')
		.replace(/u\^/g, 'ŭ')
}
