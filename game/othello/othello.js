var data
var turn
var main=document.getElementById('main')
reset()

function reset(){
    data=[
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,-1,1,0,0,0],
        [0,0,0,1,-1,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
    turn=1
    main.innerHTML=""
    for (y=0;y<8;y++){
        for (x=0;x<8;x++){
            main.insertAdjacentHTML('beforeend', '<button id="'+(y*8+x)+'" onclick="push('+y+','+x+')">●</button>')
        }
        main.insertAdjacentHTML('beforeend', '<br>')
    }
    main.insertAdjacentHTML('beforeend', '<button class="but" onclick="turn*=-1">パス</button><button class="but" onclick="reset()">リセット</button>')
    out()
}

function colorchange(y,x,py,px){
    y-=py
    x-=px
    while (data[y][x]+turn==0){
        data[y][x]*=-1
        y-=py
        x-=px
    }
}

function line(y,x,py,px){
    let loop=0
    y+=py
    x+=px
    while (0<=y & y<=7 & 0<=x & x<=7){
        if (data[y][x]==0){
            return 0
        }
        if (data[y][x]+turn==0){
            loop++
        }
        if (data[y][x]==turn){
            colorchange(y,x,py,px)
            return loop
        }
        y+=py
        x+=px
    }
    return 0
}

function push(y,x){
    if (data[y][x]==0){
        if(line(y,x,-1,0)
        +line(y,x,-1,1)
        +line(y,x,0,1)
        +line(y,x,1,1)
        +line(y,x,1,0)
        +line(y,x,1,-1)
        +line(y,x,0,-1)
        +line(y,x,-1,-1)!=0){
        data[y][x]=turn
        turn*=-1
        out()
        }
    }
}

function out(){
    for (y=0;y<8;y++){
        for (x=0;x<8;x++){
            if (data[y][x]==-1){
                document.getElementById(y*8+x).style.color="var(--white-color)"
            }
            if (data[y][x]==1){
                document.getElementById(y*8+x).style.color="var(--black-color)"
            }
        }
    }
    let siro=0
    let kuro=0
    let pop=document.getElementById('pop')
    let popmain=document.getElementById('popmain')
    let mini=document.getElementById('mini')
    for (y=0;y<8;y++){
        for (x=0;x<8;x++){
            if (data[y][x]==-1){
                siro+=1
            }
            if (data[y][x]==1){
                kuro+=1
            }
        }
    }
    if (siro==0 || kuro==0){
        if (siro==0){popmain.style.color="var(--black-color)"}
        if (kuro==0){popmain.style.color="var(--white-color)"}
        pop.style.display="flex"
    }
    if (siro+kuro==64){
        popmain.style.color="var(--black-color)"
        if (kuro<siro){popmain.style.color="var(--white-color)"}
        if (kuro==siro){
            popmain.textContent="-"
            mini.textContent="draw!"
        }
        pop.style.display="flex"
    }
}
function hidepop(){
    document.getElementById('pop').style.display="none"
    document.getElementById('popmain').textContent="●"
    document.getElementById('mini').textContent="winner!"
}
