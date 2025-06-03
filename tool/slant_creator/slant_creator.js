"use strict"
let settings_display="none"
let popup=false
let now_data=[]
// element
let homebar=document.getElementById("homebar")
let menu_space=document.getElementById("menu_space")
let add_button=document.getElementById("add_button")
let setting_button=document.getElementById("setting_button")
let list_button=document.getElementById("list_button")
let add=document.getElementById("add")
let settings=document.getElementById("settings")
let list=document.getElementById("list")
let square=document.getElementById("square")
let height=document.getElementById("height")
let width=document.getElementById("width")
let create_new=document.getElementById("create_new")
let auto_save=document.getElementById("auto_save")
let rule=document.getElementById("rule")
let list_null=document.getElementById("list_null")
let work_space=document.getElementById("work_space")
let popup_button=document.getElementById("popup_button")
let popup_arrow1=document.getElementById("popup_arrow1")
let popup_arrow2=document.getElementById("popup_arrow2")
let save_button=document.getElementById("save_button")
let close_button=document.getElementById("close_button")
let create_space=document.getElementById("create_space")
let big_box=document.getElementById("big_box")
let big_maru=document.getElementById("big_maru")
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// menu
add_button.addEventListener('click', {menu_id:add, handleEvent:displaymenu})
// setting_button.addEventListener('click', {menu_id:settings, handleEvent:displaymenu})
// list_button.addEventListener('click', {menu_id:list, handleEvent:displaymenu})
// add
square.addEventListener('click', function() {
    if (square.checked){
        width.disabled=true
        width.value=height.value
    } else {
        width.disabled=false
    }
})
height.addEventListener('input', function() {
    if (square.checked){
        width.value=height.value
    }
})
create_new.addEventListener('click', function() {
    create_now_data()
    hidemenu()
    clear_create_space()
    create_box()
    create_maru()
    work_space.style.display="block"
    create_space.scrollLeft=big_maru.offsetWidth/2-create_space.offsetWidth/2+1000
    create_space.scrollTop=big_maru.offsetHeight/2-create_space.offsetHeight/2+1000
    f_popup()
})
// settings
// auto_save.addEventListener('click', function() {
//     if (auto_save.checked){
//         save_button.style.display="none"
//     } else {
//         save_button.style.display="block"
//     }
// })
// list
// workspace
popup_button.addEventListener('click', f_popup)
close_button.addEventListener('click', function() {
    if (popup){f_popup()}
    work_space.style.display="none"
})
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function displaymenu(e){
    if (settings_display==this.menu_id){
        hidemenu()
        settings_display="none"
    } else {
        hidemenu()
        this.menu_id.style.display="block"
        settings_display=this.menu_id
    }
}
function hidemenu(){
    add.style.display="none"
    // settings.style.display="none"
    // list.style.display="none"
}
function f_popup(){
    if (popup){
        homebar.style.display="block"
        menu_space.style.display="block"
        popup_arrow1.style.transform="rotate(180deg)"
        popup_arrow2.style.transform="rotate(0deg)"
        popup=false
    } else {
        homebar.style.display="none"
        menu_space.style.display="none"
        popup_arrow1.style.transform="rotate(0deg)"
        popup_arrow2.style.transform="rotate(180deg)"
        popup=true
    }
}
// create_new
function create_now_data(){
    now_data=[[width.value,height.value],[],[]]
    for (let a=0;a<(height.value*width.value);a++){
        now_data[1].push(0)
    }
    for (let a=0;a<((1+Number(height.value))*(1+Number(width.value)));a++){
        now_data[2].push(0)
    }
}
function clear_create_space(){
    big_box.innerHTML=""
    big_maru.innerHTML=""
}
function create_box(){
    for (let y=0;y<height.value;y++){
        for (let x=0;x<width.value;x++){
            big_box.insertAdjacentHTML('beforeend', '<div class="box" id="box_'+x+','+y+'" onclick="push_box('+x+','+y+')"></div>')
        }
        big_box.insertAdjacentHTML('beforeend', '<br>');
    }
    big_box.style.height=(31+1/3)*height.value+"px"
    big_box.style.width=(31+1/3)*width.value+"px"
}
function create_maru(){
    for (let y=0;y<=height.value;y++){
        for (let x=0;x<=width.value;x++){
            big_maru.insertAdjacentHTML('beforeend', '<div class="maru" id="maru_'+x+','+y+'" onclick="push_maru('+x+','+y+')"></div>')
        }
        big_maru.insertAdjacentHTML('beforeend', '<br>');
    }
    big_maru.style.height=(31+1/3)*height.value+31+1/3+"px"
    big_maru.style.width=(31+1/3)*width.value+31+1/3+"px"
    big_maru.style.marginTop=(-31-1/3)*height.value-1031-1/3+"px"
}
function push_box(x,y){
    let targetbox=document.getElementById('box_'+x+','+y)
    let c_list=targetbox.classList
    if(c_list.contains("b")){
        c_list.remove("b")
        c_list.add("f")
    }
    else if(c_list.contains("f")){c_list.remove("f")}
    else {c_list.add("b")}
}
function push_maru(x,y){
    let targetmaru=document.getElementById('maru_'+x+','+y)
    targetmaru.classList.add("disp")
    let next_num
    if (targetmaru.innerText==""){
        next_num=1
    } else {
        let targetmaru_num=targetmaru.innerText*1
        if(targetmaru_num==0) {
            next_num=""
            targetmaru.classList.remove("disp")
        }
        else if(targetmaru_num<4){next_num=targetmaru_num+1}
        else if(targetmaru_num==4) {next_num=0}
    }
    targetmaru.innerText=next_num
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// add_button.click()
// create_new.click()
// popup_button.click()
