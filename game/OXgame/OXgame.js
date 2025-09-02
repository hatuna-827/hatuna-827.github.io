let turn
let data
let game
reset()
function reset() {
    for (i = 1; i <= 9; i++) {
        let target = document.getElementById(i)
        target.textContent = "・"
        target.classList.remove('button-display')
    }
    data = ["", "", "", "", "", "", "", "", ""]
    turn = "〇"
    game = 0
}
function draw() {
    document.getElementById('ifdraw').textContent = "draw!"
    document.getElementById('winner').textContent = "-"
}
function win() {
    game = 1
    document.getElementById('winner').textContent = turn
    document.getElementById('pop').style.display = "flex"
    document.getElementById('pop').classList.add('pop-display')
}
function hidepop() {
    document.getElementById('pop').style.display = 'none'
    document.getElementById('ifdraw').textContent = "winner!"
    reset()
}
function push(num) {
    if (document.getElementById(num).textContent == "・" & game == 0) {
        document.getElementById(num).textContent = turn
        document.getElementById(num).classList.add('button-display')
        data.splice(num - 1, 1, turn)
        if (data[0] == data[1] & data[1] == data[2] & data[2] != "") { win() }
        else if (data[3] == data[4] & data[4] == data[5] & data[5] != "") { win() }
        else if (data[6] == data[7] & data[7] == data[8] & data[8] != "") { win() }
        else if (data[0] == data[3] & data[3] == data[6] & data[6] != "") { win() }
        else if (data[1] == data[4] & data[4] == data[7] & data[7] != "") { win() }
        else if (data[2] == data[5] & data[5] == data[8] & data[8] != "") { win() }
        else if (data[0] == data[4] & data[4] == data[8] & data[8] != "") { win() }
        else if (data[2] == data[4] & data[4] == data[6] & data[6] != "") { win() }
        else if (!data.includes("")) { win(); draw() }
        if (turn == "〇") { turn = "×" } else { turn = "〇" }
    }
}
