"use strict"
let settings_display = "none"
let popup = false
let now_data = []
let loop_checked = []
let root = []
let loop_goal = []
let auto_fill_ans = []
let auto_fill_count = 0
let if_shift = false
// element
let homebar = document.getElementById("homebar")
let menu_space = document.getElementById("menu_space")
let add_button = document.getElementById("add_button")
let setting_button = document.getElementById("setting_button")
let list_button = document.getElementById("list_button")
let add = document.getElementById("add")
let settings = document.getElementById("settings")
let list = document.getElementById("list")
let square = document.getElementById("square")
let height = document.getElementById("height")
let width = document.getElementById("width")
let create_new = document.getElementById("create_new")
let auto_save = document.getElementById("auto_save")
let auto_fill = document.getElementById("auto_fill")
let gray_out = document.getElementById("gray_out")
let rule = document.getElementById("rule")
let play_mode = document.getElementById("play_mode")
let list_null = document.getElementById("list_null")
let work_space = document.getElementById("work_space")
let popup_button = document.getElementById("popup_button")
let popup_arrow1 = document.getElementById("popup_arrow1")
let popup_arrow2 = document.getElementById("popup_arrow2")
let save_button = document.getElementById("save_button")
let close_button = document.getElementById("close_button")
let create_space = document.getElementById("create_space")
let big_box = document.getElementById("big_box")
let big_maru = document.getElementById("big_maru")
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// menu
add_button.addEventListener('click', { menu_id: add, handleEvent: displaymenu })
setting_button.addEventListener('click', { menu_id: settings, handleEvent: displaymenu })
// list_button.addEventListener('click', { menu_id: list, handleEvent: displaymenu })
// add
square.addEventListener('click', function () {
    if (square.checked) {
        width.disabled = true
        width.value = height.value
    } else {
        width.disabled = false
    }
})
height.addEventListener('input', function () {
    if (square.checked) {
        width.value = height.value
    }
})
create_new.addEventListener('click', function () {
    if (!(height.value % 1 == 0 && height.value > 0 && width.value % 1 == 0 && width.value > 0)) {
        console.log("入力に誤りがあります。")
        return
    }
    auto_fill.checked=false
    gray_out.checked=false
    rule.checked=true
    play_mode.checked=false
    create_now_data()
    hidemenu()
    create_box()
    create_maru()
    work_space.style.display = "block"
    create_space.scrollLeft = big_maru.offsetWidth / 2 - create_space.offsetWidth / 2 + 1000
    create_space.scrollTop = big_maru.offsetHeight / 2 - create_space.offsetHeight / 2 + 1000
    f_popup()
})
// settings
// auto_save.addEventListener('click', function () {
//     if (auto_save.checked) {
//         save_button.style.display = "none"
//     } else {
//         save_button.style.display = "block"
//     }
// })
auto_fill.addEventListener('click', function () {
    if (auto_fill.checked) {
        if (now_data[0][0] * now_data[0][1] > 20) {
            alert("処理量の問題により大きさは20マスまでです。")
            auto_fill.checked = false
        } else {
            let checkSaveFlg = window.confirm('現在の斜線情報がすべて失われます。よろしいですか？')
            if (checkSaveFlg) {
                auto_fill_box()
            } else {
                auto_fill.checked = false
            }
        }
    }
})
gray_out.addEventListener('click', function () {
    if (gray_out.checked) {
        all_check_gray()
    } else {
        for (let x = 0; x <= now_data[0][0]; x++) {
            for (let y = 0; y <= now_data[0][1]; y++) {
                document.getElementById('maru_' + x + ',' + y).classList.remove("gray")
            }
        }
    }
})
rule.addEventListener('click', function () {
    if (rule.checked) {
        all_check_maru()
        all_check_box()
    } else {
        for (let x = 0; x <= now_data[0][0]; x++) {
            for (let y = 0; y <= now_data[0][1]; y++) {
                document.getElementById('maru_' + x + ',' + y).classList.remove("red")
            }
        }
        for (let x = 0; x < now_data[0][0]; x++) {
            for (let y = 0; y < now_data[0][1]; y++) {
                document.getElementById('box_' + x + ',' + y).classList.remove("red")
            }
        }
    }
})
play_mode.addEventListener('click', function () {
    if (play_mode.checked) {
        big_maru.classList.add("play_mode")
    } else {
        big_maru.classList.remove("play_mode")
    }
})
// list
// workspace
popup_button.addEventListener('click', f_popup)
close_button.addEventListener('click', function () {
    if (popup) { f_popup() }
    work_space.style.display = "none"
})
window.addEventListener("keydown", e => {
    if (e.shiftKey) {
        if_shift = true
    }
})
window.addEventListener("keyup", e => {
    if (!e.shiftKey) {
        if_shift = false
    }
})
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function displaymenu(e) {
    if (settings_display == this.menu_id) {
        hidemenu()
        settings_display = "none"
    } else {
        hidemenu()
        this.menu_id.style.display = "block"
        settings_display = this.menu_id
    }
}
function hidemenu() {
    add.style.display = "none"
    settings.style.display = "none"
    list.style.display = "none"
}
function f_popup() {
    if (popup) {
        homebar.style.display = "block"
        menu_space.style.display = "block"
        popup_arrow1.style.transform = "rotate(180deg)"
        popup_arrow2.style.transform = "rotate(0deg)"
        popup = false
    } else {
        homebar.style.display = "none"
        menu_space.style.display = "none"
        popup_arrow1.style.transform = "rotate(0deg)"
        popup_arrow2.style.transform = "rotate(180deg)"
        popup = true
    }
}
// create_new
function create_now_data() {
    now_data = [[width.value * 1, height.value * 1], [], []]
    for (let x = 0; x < now_data[0][0]; x++) {
        now_data[1].push([])
        for (let y = 0; y < now_data[0][1]; y++) {
            now_data[1][x].push(0)
        }
    }
    for (let x = 0; x <= now_data[0][0]; x++) {
        now_data[2].push([])
        for (let y = 0; y <= now_data[0][1]; y++) {
            now_data[2][x].push("")
        }
    }
}
function create_box() {
    big_box.innerHTML = ""
    for (let y = 0; y < now_data[0][1]; y++) {
        for (let x = 0; x < now_data[0][0]; x++) {
            let new_box = document.createElement("div")
            new_box.classList.add("box")
            new_box.id = 'box_' + x + ',' + y
            new_box.setAttribute('onclick', 'push_box(' + x + ',' + y + ')')
            if (now_data[1][x][y] == 1) { new_box.classList.add("f") }
            if (now_data[1][x][y] == -1) { new_box.classList.add("b") }
            big_box.insertAdjacentElement('beforeend', new_box)
        }
        big_box.insertAdjacentHTML('beforeend', '<br>')
    }
    big_box.style.height = (31 + 1 / 3) * height.value + "px"
    big_box.style.width = (31 + 1 / 3) * width.value + "px"
}
function create_maru() {
    big_maru.innerHTML = ""
    for (let y = 0; y <= height.value; y++) {
        for (let x = 0; x <= width.value; x++) {
            let new_maru = document.createElement("div")
            new_maru.classList.add("maru")
            new_maru.id = 'maru_' + x + ',' + y
            new_maru.setAttribute('onclick', 'push_maru(' + x + ',' + y + ')')
            new_maru.textContent = now_data[2][x][y]
            if (new_maru.textContent != "") {
                new_maru.classList.add("disp")
            }
            big_maru.insertAdjacentElement('beforeend', new_maru)
        }
        big_maru.insertAdjacentHTML('beforeend', '<br>')
    }
    big_maru.style.height = (31 + 1 / 3) * height.value + 31 + 1 / 3 + "px"
    big_maru.style.width = (31 + 1 / 3) * width.value + 31 + 1 / 3 + "px"
    big_maru.style.marginTop = (-31 - 1 / 3) * height.value - 1031 - 1 / 3 + "px"
}
function push_box(x, y) {
    if (auto_fill.checked) { return }
    let targetbox = document.getElementById('box_' + x + ',' + y)
    let c_list = targetbox.classList
    if (c_list.contains("b")) {
        c_list.remove("b")
        c_list.add("f")
        now_data[1][x][y] = 1
    }
    else if (c_list.contains("f")) {
        c_list.remove("f")
        now_data[1][x][y] = 0
    }
    else {
        c_list.add("b")
        now_data[1][x][y] = -1
    }
    c_list.remove("green")
    if (if_shift) {
        c_list.add("green")
    }
    if (rule.checked) {
        check_maru(x, y)
        check_maru(x + 1, y)
        check_maru(x, y + 1)
        check_maru(x + 1, y + 1)
        all_check_box()
    }
    if (gray_out.checked) {
        check_gray(x, y)
        check_gray(x + 1, y)
        check_gray(x, y + 1)
        check_gray(x + 1, y + 1)
    }
}
function push_maru(x, y) {
    if (play_mode.checked) { return }
    let targetmaru = document.getElementById('maru_' + x + ',' + y)
    targetmaru.classList.add("disp")
    let next_num
    if (targetmaru.innerText == "") {
        next_num = 1
    } else {
        let targetmaru_num = targetmaru.innerText * 1
        if (targetmaru_num == 0) {
            next_num = ""
            targetmaru.classList.remove("disp")
        }
        else if (targetmaru_num < 4) { next_num = targetmaru_num + 1 }
        else if (targetmaru_num == 4) { next_num = 0 }
    }
    targetmaru.innerText = next_num
    now_data[2][x][y] = next_num
    if (auto_fill.checked) { auto_fill_box() }
    if (gray_out.checked) { check_gray(x, y) }
    if (rule.checked) { check_maru(x, y) }
}
function all_check_gray() {
    for (let x = 0; x <= now_data[0][0]; x++) {
        for (let y = 0; y <= now_data[0][1]; y++) {
            check_gray(x, y)
        }
    }
}
function check_gray(x, y) {
    let targetmaru = document.getElementById('maru_' + x + ',' + y)
    targetmaru.classList.remove("gray")
    if (targetmaru.innerText == "") { return }
    let link_box = check_link_box(x, y, now_data[0], now_data[1])
    let link_wall = check_link_wall(x, y, now_data[0])
    // 接続
    if (now_data[2][x][y] == link_box[0]) { targetmaru.classList.add("gray") }
    // 未接続
    if (link_wall[0] && link_wall[1] && link_wall[2] && link_wall[3]) {
        // 壁0
        if (now_data[2][x][y] == 4 - link_box[1]) { targetmaru.classList.add("gray") }
    } else if (link_wall[0] && link_wall[1] && link_wall[2] ||
        link_wall[0] && link_wall[1] && link_wall[3] ||
        link_wall[0] && link_wall[2] && link_wall[3] ||
        link_wall[1] && link_wall[2] && link_wall[3]) {
        // 壁1
        if (now_data[2][x][y] == 2 - link_box[1]) { targetmaru.classList.add("gray") }
    } else {
        // 壁2
        if (now_data[2][x][y] == 1 - link_box[1]) { targetmaru.classList.add("gray") }
    }
}
function all_check_maru() {
    for (let x = 0; x <= now_data[0][0]; x++) {
        for (let y = 0; y <= now_data[0][1]; y++) {
            check_maru(x, y)
        }
    }
}
function check_maru(x, y) {
    let targetmaru = document.getElementById('maru_' + x + ',' + y)
    targetmaru.classList.remove("red")
    if (check_maru_data(x, y, now_data[0], now_data[1], now_data[2])) { targetmaru.classList.add("red") }
}
function check_maru_data(x, y, size, box_data, maru_data) {
    if (maru_data[x][y] === "") { return false }
    let link_box = check_link_box(x, y, size, box_data)
    let link_wall = check_link_wall(x, y, size)
    // 超過
    if (maru_data[x][y] < link_box[0]) { return true }
    // 不足
    if (link_wall[0] && link_wall[1] && link_wall[2] && link_wall[3]) {
        // 壁0
        if (maru_data[x][y] > 4 - link_box[1]) { return true }
        if (maru_data[x][y] == 0) { return true }
    } else if (link_wall[0] && link_wall[1] && link_wall[2] ||
        link_wall[0] && link_wall[1] && link_wall[3] ||
        link_wall[0] && link_wall[2] && link_wall[3] ||
        link_wall[1] && link_wall[2] && link_wall[3]) {
        // 壁1
        if (maru_data[x][y] > 2 - link_box[1]) { return true }
        if (maru_data[x][y] > 2) { return true }
    } else {
        // 壁2
        if (maru_data[x][y] > 1 - link_box[1]) { return true }
        if (maru_data[x][y] > 1) { return true }
    }
    return false
}
function check_link_box(x, y, size, box_data) {
    let link_box = [0, 0]
    let link_wall = check_link_wall(x, y, size)
    if (link_wall[1] && link_wall[2]) {
        if (box_data[x][y] == -1) { link_box[0]++ }
        if (box_data[x][y] == 1) { link_box[1]++ }
    }
    if (link_wall[0] && link_wall[1]) {
        if (box_data[x][y - 1] == 1) { link_box[0]++ }
        if (box_data[x][y - 1] == -1) { link_box[1]++ }
    }
    if (link_wall[2] && link_wall[3]) {
        if (box_data[x - 1][y] == 1) { link_box[0]++ }
        if (box_data[x - 1][y] == -1) { link_box[1]++ }
    }
    if (link_wall[0] && link_wall[3]) {
        if (box_data[x - 1][y - 1] == -1) { link_box[0]++ }
        if (box_data[x - 1][y - 1] == 1) { link_box[1]++ }
    }
    return link_box
}
function all_check_box() {
    loop_checked = []
    for (let x = 0; x < now_data[0][0]; x++) {
        loop_checked.push([])
        for (let y = 0; y < now_data[0][1]; y++) {
            loop_checked[x].push(0)
        }
    }
    for (let x = 0; x < now_data[0][0]; x++) {
        for (let y = 0; y < now_data[0][1]; y++) {
            document.getElementById('box_' + x + ',' + y).classList.remove("red")
        }
    }
    for (let x = 0; x < now_data[0][0]; x++) {
        for (let y = 0; y < now_data[0][1]; y++) {
            if (loop_checked[x][y] == 0) {
                if (check_box_data(x, y, now_data[0], now_data[1])) {
                    loop_red_box()
                }
            }
        }
    }
}
function check_box_data(x, y, size, box_data) {
    if (box_data[x][y] == 0) { return false }
    let queue = []
    root = []
    for (let x = 0; x <= size[0]; x++) {
        root.push([])
        for (let y = 0; y <= size[1]; y++) {
            root[x].push(0)
        }
    }
    if (box_data[x][y] == 1) {
        queue.push([x + 1, y])
        root[x + 1][y] = 1
        loop_goal = [x, y + 1]
    }
    if (box_data[x][y] == -1) {
        queue.push([x, y])
        root[x][y] = 1
        loop_goal = [x + 1, y + 1]
    }
    box_data[x][y] *= -1
    while (queue.length != 0) {
        let P = queue[0]
        let link_wall = check_link_wall(P[0], P[1], size)
        if (link_wall[1] && link_wall[2]) {
            // 右下
            let n_x = P[0] + 1
            let n_y = P[1] + 1
            if (box_data[P[0]][P[1]] == -1 && root[n_x][n_y] == 0) {
                if (loop_check(n_x, n_y, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall[0] && link_wall[1]) {
            // 右上
            let n_x = P[0] + 1
            let n_y = P[1] - 1
            if (box_data[P[0]][P[1] - 1] == 1 && root[n_x][n_y] == 0) {
                if (loop_check(n_x, n_y, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall[2] && link_wall[3]) {
            // 左下
            let n_x = P[0] - 1
            let n_y = P[1] + 1
            if (box_data[P[0] - 1][P[1]] == 1 && root[n_x][n_y] == 0) {
                if (loop_check(n_x, n_y, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall[0] && link_wall[3]) {
            // 左上
            let n_x = P[0] - 1
            let n_y = P[1] - 1
            if (box_data[P[0] - 1][P[1] - 1] == -1 && root[n_x][n_y] == 0) {
                if (loop_check(n_x, n_y, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        queue.shift()
    }
    box_data[x][y] *= -1
    return false
}
function loop_check(n_x, n_y, P, queue) {
    root[n_x][n_y] = root[P[0]][P[1]] + 1
    queue.push([n_x, n_y])
    if (n_x == loop_goal[0] && n_y == loop_goal[1]) { return true }
    return false
}
function loop_red_box() {
    // console.log("ループ発見", loop_goal, root)
    let l_P = loop_goal
    let only
    while (root[l_P[0]][l_P[1]] != 1) {
        // console.log("色塗り中", l_P, root[l_P[0]][l_P[1]], root)
        let link_wall = check_link_wall(l_P[0], l_P[1], now_data[0])
        only = true
        if (link_wall[1] && link_wall[2] && only && now_data[1][l_P[0]][l_P[1]] == -1) {
            // 右下
            let n_P = [l_P[0] + 1, l_P[1] + 1]
            if (root[l_P[0]][l_P[1]] - root[n_P[0]][n_P[1]] == 1) {
                red_box(l_P[0], l_P[1])
                only = false
                l_P = n_P
            }
        }
        if (link_wall[0] && link_wall[1] && only && now_data[1][l_P[0]][l_P[1] - 1] == 1) {
            // 右上
            let n_P = [l_P[0] + 1, l_P[1] - 1]
            if (root[l_P[0]][l_P[1]] - root[n_P[0]][n_P[1]] == 1) {
                red_box(l_P[0], l_P[1] - 1)
                only = false
                l_P = n_P
            }
        }
        if (link_wall[2] && link_wall[3] && only && now_data[1][l_P[0] - 1][l_P[1]] == 1) {
            // 左下
            let n_P = [l_P[0] - 1, l_P[1] + 1]
            if (root[l_P[0]][l_P[1]] - root[n_P[0]][n_P[1]] == 1) {
                red_box(l_P[0] - 1, l_P[1])
                only = false
                l_P = n_P
            }
        }
        if (link_wall[0] && link_wall[3] && only && now_data[1][l_P[0] - 1][l_P[1] - 1] == -1) {
            // 左上
            let n_P = [l_P[0] - 1, l_P[1] - 1]
            if (root[l_P[0]][l_P[1]] - root[n_P[0]][n_P[1]] == 1) {
                red_box(l_P[0] - 1, l_P[1] - 1)
                only = false
                l_P = n_P
            }
        }
    }
    red_box((l_P[0] + loop_goal[0]) / 2 - 0.5, (l_P[1] + loop_goal[1]) / 2 - 0.5)
}
function red_box(x, y) {
    // console.log("red_box", x, y)
    document.getElementById('box_' + x + ',' + y).classList.add("red")
    loop_checked[x][y] = 1
}
function check_link_wall(x, y, size) {
    // (x,y)の丸について↑→↓←の順で壁がなければTrue
    return [y != 0, x != size[0], y != size[1], x != 0]
}
function auto_fill_box() {
    now_data[1] = f_auto_fill_data(now_data[0], now_data[2])
    create_box()
    if (gray_out.checked) { all_check_gray() }
    if (rule.checked) { all_check_maru() }
}
function f_auto_fill_data(size, maru_data) {
    let auto_fill_data = [[], []]
    auto_fill_ans = []
    auto_fill_count = 0
    for (let x = 0; x < size[0]; x++) {
        auto_fill_data[0].push([])
        auto_fill_ans.push([])
        for (let y = 0; y < size[1]; y++) {
            auto_fill_data[0][x].push(0)
            auto_fill_ans[x].push(0)
        }
    }
    auto_fill_data[1] = maru_data
    // console.log("今から考える", auto_fill_data)
    auto_fill_DFS(size, auto_fill_data, 0)
    for (let x = 0; x < size[0]; x++) {
        for (let y = 0; y < size[1]; y++) {
            auto_fill_ans[x][y] = Math.trunc(auto_fill_ans[x][y] / auto_fill_count)
        }
    }
    return auto_fill_ans
}
function auto_fill_DFS(size, tmp_data, node) {
    // console.log("DFS", size, tmp_data, node)
    let x = node % size[0]
    let y = Math.floor(node / size[0])
    if (size[0] * size[1] == node) {
        // console.log("One answer", tmp_data)
        auto_fill_count += 1
        for (let x = 0; x < size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                auto_fill_ans[x][y] += tmp_data[0][x][y]
            }
        }
        return
    }
    tmp_data[0][x][y] = -1
    if (!(check_maru_data(x, y, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x + 1, y, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x, y + 1, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x + 1, y + 1, size, tmp_data[0], tmp_data[1]))) {
        auto_fill_DFS(size, tmp_data, node + 1)
    }
    tmp_data[0][x][y] = 1
    if (!(check_maru_data(x, y, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x + 1, y, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x, y + 1, size, tmp_data[0], tmp_data[1]) ||
        check_maru_data(x + 1, y + 1, size, tmp_data[0], tmp_data[1]))) {
        // if (x != 0) {
        //     if (tmp_data[0][x - 1][y] == -1) {
        if (!check_box_data(x, y, size, tmp_data[0])) {
            auto_fill_DFS(size, tmp_data, node + 1)
        }
        //     }
        // }
    }
    tmp_data[0][x][y] = 0
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// add_button.click()
// create_new.click()