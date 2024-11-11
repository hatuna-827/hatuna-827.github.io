let turn
let date
let game
reset()
function reset(){
    document.getElementById(1).textContent=""
    document.getElementById(2).textContent=""
    document.getElementById(3).textContent=""
    document.getElementById(4).textContent=""
    document.getElementById(5).textContent=""
    document.getElementById(6).textContent=""
    document.getElementById(7).textContent=""
    document.getElementById(8).textContent=""
    document.getElementById(9).textContent=""
    date=["","","","","","","","",""]
    turn="〇"
    game=0
}
function draw(){
    document.getElementById('ifdraw').textContent="draw!"
    document.getElementById('winner').textContent="-"
}
function win() {
    game=1
    document.getElementById('winner').textContent=turn
    document.getElementById('pop').style.opacity=0
    document.getElementById('pop').style.display="flex"
    let a=0
    const interval_ = setInterval(function() {
        a+=0.02
        document.getElementById('pop').style.opacity=a
        if (a>=1) {
            clearInterval(interval_)
        }
    },10)
}
function hidepop() {
    document.getElementById('pop').style.display='none'
    document.getElementById('ifdraw').textContent="winner!"
    reset()
}
function push(num){
    if (document.getElementById(num).textContent=="" & game==0) {
        document.getElementById(num).textContent=turn
        document.getElementById(num).style.color="#f8f7f2"
        let a=0
        const interval = setInterval(function() {
            document.getElementById(num).style.color="rgba(0,0,0,"+a+")"
            a+=0.1
            if (a>=1) {
                clearInterval(interval)
            }
        },20)
        date.splice(num-1,1,turn)
        if (! date.includes("")){win();draw()}
        if (date[0]==date[1] & date[1]==date[2] & date[2]!=""){win()}
        if (date[3]==date[4] & date[4]==date[5] & date[5]!=""){win()}
        if (date[6]==date[7] & date[7]==date[8] & date[8]!=""){win()}
        if (date[0]==date[3] & date[3]==date[6] & date[6]!=""){win()}
        if (date[1]==date[4] & date[4]==date[7] & date[7]!=""){win()}
        if (date[2]==date[5] & date[5]==date[8] & date[8]!=""){win()}
        if (date[0]==date[4] & date[4]==date[8] & date[8]!=""){win()}
        if (date[2]==date[4] & date[4]==date[6] & date[6]!=""){win()}
        if (turn=="〇"){turn="×"} else {turn="〇"}
    }
}
