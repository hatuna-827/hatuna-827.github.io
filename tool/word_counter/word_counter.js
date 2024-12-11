let words
const id_in = document.getElementById('in')
id_in.addEventListener('keyup', word_count)
word_count()
function word_count() {
    const spaces = id_in.value.match(/\S+/g)
    if (spaces) {
        words = spaces.length
    } else {
        words = 0
    }
    document.getElementById('out').textContent=words+"単語 , "+id_in.value.length+"文字"
}
