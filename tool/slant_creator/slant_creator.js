"use strict"
import dialog from "/dialog.js"
let settings_display = "none"
let popup = false
let now_data = {}
let loop_checked = []
let root = []
let loop_goal = {}
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
create_new.addEventListener('click', async function () {
    if (!(height.value % 1 == 0 && height.value > 0 && width.value % 1 == 0 && width.value > 0)) {
        await dialog({ content: "入力内容に誤りがあります。" })
        return
    }
    auto_fill.checked = false
    gray_out.checked = false
    rule.checked = true
    play_mode.checked = false
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
auto_fill.addEventListener('click', async function () {
    if (auto_fill.checked) {
        if (now_data.size.x * now_data.size.y > 20) {
            await dialog({ content: "処理量の問題により大きさは20マスまでです。" })
            auto_fill.checked = false
        } else {
            let checkSaveFlg = await dialog({ type: "OC", content: "現在の斜線情報がすべて失われます。よろしいですか？" })
            if (checkSaveFlg == 0) {
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
        for (let x = 0; x <= now_data.size.x; x++) {
            for (let y = 0; y <= now_data.size.y; y++) {
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
        for (let x = 0; x <= now_data.size.x; x++) {
            for (let y = 0; y <= now_data.size.y; y++) {
                document.getElementById('maru_' + x + ',' + y).classList.remove("red")
            }
        }
        for (let x = 0; x < now_data.size.x; x++) {
            for (let y = 0; y < now_data.size.y; y++) {
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
    now_data = { size: { x: width.value * 1, y: height.value * 1 }, box: [], maru: [] }
    for (let x = 0; x < now_data.size.x; x++) {
        now_data.box.push([])
        for (let y = 0; y < now_data.size.y; y++) {
            now_data.box[x].push(0)
        }
    }
    for (let x = 0; x <= now_data.size.x; x++) {
        now_data.maru.push([])
        for (let y = 0; y <= now_data.size.y; y++) {
            now_data.maru[x].push("")
        }
    }
}
function create_box() {
    big_box.innerHTML = ""
    for (let y = 0; y < now_data.size.y; y++) {
        for (let x = 0; x < now_data.size.x; x++) {
            let new_box = document.createElement("div")
            new_box.classList.add("box")
            new_box.id = 'box_' + x + ',' + y
            new_box.setAttribute('onclick', 'push_box(' + x + ',' + y + ')')
            if (now_data.box[x][y] == 1) { new_box.classList.add("f") }
            if (now_data.box[x][y] == -1) { new_box.classList.add("b") }
            big_box.insertAdjacentElement('beforeend', new_box)
        }
        big_box.insertAdjacentHTML('beforeend', '<br>')
    }
    big_box.style.height = (31 + 1 / 3) * now_data.size.y + "px"
    big_box.style.width = (31 + 1 / 3) * now_data.size.x + "px"
}
function create_maru() {
    big_maru.innerHTML = ""
    for (let y = 0; y <= now_data.size.y; y++) {
        for (let x = 0; x <= now_data.size.x; x++) {
            let new_maru = document.createElement("div")
            new_maru.classList.add("maru")
            new_maru.id = 'maru_' + x + ',' + y
            new_maru.setAttribute('onclick', 'push_maru(' + x + ',' + y + ')')
            new_maru.textContent = now_data.maru[x][y]
            if (new_maru.textContent != "") {
                new_maru.classList.add("disp")
            }
            big_maru.insertAdjacentElement('beforeend', new_maru)
        }
        big_maru.insertAdjacentHTML('beforeend', '<br>')
    }
    big_maru.style.height = (31 + 1 / 3) * now_data.size.y + 31 + 1 / 3 + "px"
    big_maru.style.width = (31 + 1 / 3) * now_data.size.x + 31 + 1 / 3 + "px"
    big_maru.style.marginTop = (-31 - 1 / 3) * now_data.size.y - 1031 - 1 / 3 + "px"
}
function push_box(x, y) {
    if (auto_fill.checked) { return }
    let targetbox = document.getElementById('box_' + x + ',' + y)
    let c_list = targetbox.classList
    if (now_data.box[x][y] == -1) {
        c_list.remove("b")
        c_list.add("f")
        now_data.box[x][y] = 1
    }
    else if (now_data.box[x][y] == 1) {
        c_list.remove("f")
        now_data.box[x][y] = 0
    }
    else {
        c_list.add("b")
        now_data.box[x][y] = -1
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
    if (now_data.maru[x][y] === "") {
        next_num = 1
    } else {
        if (now_data.maru[x][y] == 0) {
            next_num = ""
            targetmaru.classList.remove("disp")
        }
        else if (now_data.maru[x][y] < 4) { next_num = now_data.maru[x][y] + 1 }
        else if (now_data.maru[x][y] == 4) { next_num = 0 }
    }
    targetmaru.innerText = next_num
    now_data.maru[x][y] = next_num
    if (auto_fill.checked) { auto_fill_box() }
    if (gray_out.checked) { check_gray(x, y) }
    if (rule.checked) { check_maru(x, y) }
}
function all_check_gray() {
    for (let x = 0; x <= now_data.size.x; x++) {
        for (let y = 0; y <= now_data.size.y; y++) {
            check_gray(x, y)
        }
    }
}
function check_gray(x, y) {
    let targetmaru = document.getElementById('maru_' + x + ',' + y)
    targetmaru.classList.remove("gray")
    if (targetmaru.innerText == "") { return }
    let link_box = check_link_box(x, y, now_data.size, now_data.box)
    let link_wall = check_link_wall(x, y, now_data.size)
    // 接続
    if (now_data.maru[x][y] == link_box.true) { targetmaru.classList.add("gray") }
    // 未接続
    if (link_wall.up && link_wall.right && link_wall.down && link_wall.left) {
        // 壁0
        if (now_data.maru[x][y] == 4 - link_box.false) { targetmaru.classList.add("gray") }
    } else if (link_wall.up && link_wall.right && link_wall.down ||
        link_wall.up && link_wall.right && link_wall.left ||
        link_wall.up && link_wall.down && link_wall.left ||
        link_wall.right && link_wall.down && link_wall.left) {
        // 壁1
        if (now_data.maru[x][y] == 2 - link_box.false) { targetmaru.classList.add("gray") }
    } else {
        // 壁2
        if (now_data.maru[x][y] == 1 - link_box.false) { targetmaru.classList.add("gray") }
    }
}
function all_check_maru() {
    for (let x = 0; x <= now_data.size.x; x++) {
        for (let y = 0; y <= now_data.size.y; y++) {
            check_maru(x, y)
        }
    }
}
function check_maru(x, y) {
    let targetmaru = document.getElementById('maru_' + x + ',' + y)
    targetmaru.classList.remove("red")
    if (check_maru_data(x, y, now_data.size, now_data.box, now_data.maru)) { targetmaru.classList.add("red") }
}
function check_maru_data(x, y, size, box_data, maru_data) {
    if (maru_data[x][y] === "") { return false }
    let link_box = check_link_box(x, y, size, box_data)
    let link_wall = check_link_wall(x, y, size)
    // 超過
    if (maru_data[x][y] < link_box.true) { return true }
    // 不足
    if (link_wall.up && link_wall.right && link_wall.down && link_wall.left) {
        // 壁0
        if (maru_data[x][y] > 4 - link_box.false) { return true }
        if (maru_data[x][y] == 0) { return true }
    } else if (link_wall.up && link_wall.right && link_wall.down ||
        link_wall.up && link_wall.right && link_wall.left ||
        link_wall.up && link_wall.down && link_wall.left ||
        link_wall.right && link_wall.down && link_wall.left) {
        // 壁1
        if (maru_data[x][y] > 2 - link_box.false) { return true }
        if (maru_data[x][y] > 2) { return true }
    } else {
        // 壁2
        if (maru_data[x][y] > 1 - link_box.false) { return true }
        if (maru_data[x][y] > 1) { return true }
    }
    return false
}
function check_link_box(x, y, size, box_data) {
    let link_box = { true: 0, false: 0 }
    let link_wall = check_link_wall(x, y, size)
    if (link_wall.right && link_wall.down) {
        if (box_data[x][y] == -1) { link_box.true++ }
        if (box_data[x][y] == 1) { link_box.false++ }
    }
    if (link_wall.up && link_wall.right) {
        if (box_data[x][y - 1] == 1) { link_box.true++ }
        if (box_data[x][y - 1] == -1) { link_box.false++ }
    }
    if (link_wall.down && link_wall.left) {
        if (box_data[x - 1][y] == 1) { link_box.true++ }
        if (box_data[x - 1][y] == -1) { link_box.false++ }
    }
    if (link_wall.up && link_wall.left) {
        if (box_data[x - 1][y - 1] == -1) { link_box.true++ }
        if (box_data[x - 1][y - 1] == 1) { link_box.false++ }
    }
    return link_box
}
function all_check_box() {
    loop_checked = []
    for (let x = 0; x < now_data.size.x; x++) {
        loop_checked.push([])
        for (let y = 0; y < now_data.size.y; y++) {
            loop_checked[x].push(0)
        }
    }
    for (let x = 0; x < now_data.size.x; x++) {
        for (let y = 0; y < now_data.size.y; y++) {
            document.getElementById('box_' + x + ',' + y).classList.remove("red")
        }
    }
    for (let x = 0; x < now_data.size.x; x++) {
        for (let y = 0; y < now_data.size.y; y++) {
            if (loop_checked[x][y] == 0) {
                if (check_box_data(x, y, now_data.size, now_data.box)) {
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
    for (let x = 0; x <= size.x; x++) {
        root.push([])
        for (let y = 0; y <= size.y; y++) {
            root[x].push(0)
        }
    }
    if (box_data[x][y] == 1) {
        queue.push({ x: x + 1, y: y })
        root[x + 1][y] = 1
        loop_goal = { x: x, y: y + 1 }
    }
    if (box_data[x][y] == -1) {
        queue.push({ x: x, y: y })
        root[x][y] = 1
        loop_goal = { x: x + 1, y: y + 1 }
    }
    box_data[x][y] *= -1
    while (queue.length != 0) {
        let P = queue[0]
        // console.log(queue, P)
        let link_wall = check_link_wall(P.x, P.y, size)
        if (link_wall.right && link_wall.down) {
            // 右下
            let n = { x: P.x + 1, y: P.y + 1 }
            if (box_data[P.x][P.y] == -1 && root[n.x][n.y] == 0) {
                if (loop_check(n, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall.up && link_wall.right) {
            // 右上
            let n = { x: P.x + 1, y: P.y - 1 }
            if (box_data[P.x][P.y - 1] == 1 && root[n.x][n.y] == 0) {
                if (loop_check(n, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall.down && link_wall.left) {
            // 左下
            let n = { x: P.x - 1, y: P.y + 1 }
            if (box_data[P.x - 1][P.y] == 1 && root[n.x][n.y] == 0) {
                if (loop_check(n, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        if (link_wall.up && link_wall.left) {
            // 左上
            let n = { x: P.x - 1, y: P.y - 1 }
            if (box_data[P.x - 1][P.y - 1] == -1 && root[n.x][n.y] == 0) {
                if (loop_check(n, P, queue)) { box_data[x][y] *= -1; return true }
            }
        }
        queue.shift()
    }
    box_data[x][y] *= -1
    return false
}
function loop_check(n, P, queue) {
    root[n.x][n.y] = root[P.x][P.y] + 1
    queue.push(n)
    if (n.x == loop_goal.x && n.y == loop_goal.y) { return true }
    return false
}
function loop_red_box() {
    // console.log("ループ発見", loop_goal, root)
    let l_P = loop_goal
    let only
    let count = 0
    while (root[l_P.x][l_P.y] != 1) {
        count++; if (count == 10) { exit() }
        // console.log("色塗り中", l_P, root[l_P.x][l_P.y])
        let link_wall = check_link_wall(l_P.x, l_P.y, now_data.size)
        only = true
        if (link_wall.right && link_wall.down && only) {
            // console.log("右下")
            let n_P = { x: l_P.x + 1, y: l_P.y + 1 }
            if (root[l_P.x][l_P.y] - root[n_P.x][n_P.y] == 1) {
                red_box(l_P.x, l_P.y)
                only = false
                l_P = n_P
            }
        }
        if (link_wall.up && link_wall.right && only) {
            // console.log("右上")
            let n_P = { x: l_P.x + 1, y: l_P.y - 1 }
            if (root[l_P.x][l_P.y] - root[n_P.x][n_P.y] == 1) {
                red_box(l_P.x, l_P.y - 1)
                only = false
                l_P = n_P
            }
        }
        if (link_wall.down && link_wall.left && only) {
            // console.log("左下")
            let n_P = { x: l_P.x - 1, y: l_P.y + 1 }
            if (root[l_P.x][l_P.y] - root[n_P.x][n_P.y] == 1) {
                red_box(l_P.x - 1, l_P.y)
                only = false
                l_P = n_P
            }
        }
        if (link_wall.up && link_wall.left && only) {
            // console.log("左上")
            let n_P = { x: l_P.x - 1, y: l_P.y - 1 }
            if (root[l_P.x][l_P.y] - root[n_P.x][n_P.y] == 1) {
                red_box(l_P.x - 1, l_P.y - 1)
                only = false
                l_P = n_P
            }
        }
    }
    red_box((l_P.x + loop_goal.x) / 2 - 0.5, (l_P.y + loop_goal.y) / 2 - 0.5)
}
function red_box(x, y) {
    // console.log("red_box", x, y)
    document.getElementById('box_' + x + ',' + y).classList.add("red")
    loop_checked[x][y] = 1
}
function check_link_wall(x, y, size) {
    // (x,y)の丸について↑→↓←の順で壁がなければTrue
    return {
        up: y != 0,
        right: x != size.x,
        down: y != size.y,
        left: x != 0
    }
}
function auto_fill_box() {
    now_data.box = f_auto_fill_data(now_data.size, now_data.maru)
    create_box()
    if (gray_out.checked) { all_check_gray() }
    if (rule.checked) { all_check_maru() }
}
function f_auto_fill_data(size, maru_data) {
    let auto_fill_data = { box: [], maru: [] }
    auto_fill_ans = []
    auto_fill_count = 0
    for (let x = 0; x < size.x; x++) {
        auto_fill_data.box.push([])
        auto_fill_ans.push([])
        for (let y = 0; y < size.y; y++) {
            auto_fill_data.box[x].push(0)
            auto_fill_ans[x].push(0)
        }
    }
    auto_fill_data.maru = maru_data
    // console.log("今から考える", auto_fill_data)
    auto_fill_DFS(size, auto_fill_data, 0)
    // if (auto_fill_count == 0) { alert("答えが存在しません。") }
    for (let x = 0; x < size.x; x++) {
        for (let y = 0; y < size.y; y++) {
            auto_fill_ans[x][y] = Math.trunc(auto_fill_ans[x][y] / auto_fill_count)
        }
    }
    return auto_fill_ans
}
function auto_fill_DFS(size, tmp_data, node) {
    // console.log("DFS", size, tmp_data, node)
    let x = node % size.x
    let y = Math.floor(node / size.x)
    if (size.x * size.y == node) {
        // console.log("One answer", tmp_data)
        auto_fill_count++
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                auto_fill_ans[x][y] += tmp_data.box[x][y]
            }
        }
        return
    }
    tmp_data.box[x][y] = -1
    if (!(check_maru_data(x, y, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x + 1, y, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x, y + 1, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x + 1, y + 1, size, tmp_data.box, tmp_data.maru))) {
        auto_fill_DFS(size, tmp_data, node + 1)
    }
    tmp_data.box[x][y] = 1
    if (!(check_maru_data(x, y, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x + 1, y, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x, y + 1, size, tmp_data.box, tmp_data.maru) ||
        check_maru_data(x + 1, y + 1, size, tmp_data.box, tmp_data.maru))) {
        if (x != 0) {
            if (tmp_data.box[x - 1][y] == -1) {
                if (!check_box_data(x, y, size, tmp_data.box)) {
                    auto_fill_DFS(size, tmp_data, node + 1)
                }
            } else {
                auto_fill_DFS(size, tmp_data, node + 1)
            }
        } else {
            auto_fill_DFS(size, tmp_data, node + 1)
        }
    }
    tmp_data.box[x][y] = 0
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// add_button.click()
// create_new.click()