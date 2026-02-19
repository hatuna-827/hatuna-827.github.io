"use strict"
/* - import ------------------------------------------------------------------------------------ */
import snackbar from "/module/snackbar.js"
/* - const ------------------------------------------------------------------------------------- */
let word_list
let input_condition
/* - init -------------------------------------------------------------------------------------- */
[0, 1, 2, 3, 4].forEach(i => document.getElementById(`input-char-${i}`).addEventListener('click', function () { update_char_status(i) }))
fetch("./wordle.json")
  .then(response => response.json())
  .then(data => { word_list = new Set(data) })
  .catch(error => console.error('Error:', error))
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("add-hint").addEventListener('click', function () {
  input_condition = [...Array(5)].map(_ => ({ char: "", status: "gray" }))
  document.getElementById("input-text").value = ""
  update_display_input()
  document.getElementById("input-hint-wrapper").style.display = "flex"
  document.getElementById("input-text").focus()
})
document.getElementById("input-text").addEventListener('input', function () {
  let text = document.getElementById("input-text").value
  if (/^[a-zA-Z]{0,5}$/.test(text)) {
    document.getElementById("input-text-comment").style.display = "none"
    text = text.split("")
    for (let i = 0; i < 5; ++i) {
      input_condition[i].char = (text[i] || "").toUpperCase()
    }
    update_display_input()
  } else {
    document.getElementById("input-text-comment").style.display = "block"
  }
})
document.getElementById("input-cancel").addEventListener('click', function () {
  document.getElementById("input-hint-wrapper").style.display = "none"
})
document.getElementById("input-submit").addEventListener('click', function () {
  document.getElementById("input-hint-wrapper").style.display = "none"
  if (input_condition[4].char === "") {
    snackbar({ type: "Err", context: "文字数が足りません。" })
    return
  }
  const word = document.createElement('div')
  word.className = "word hint"
  for (let i = 0; i < 5; ++i) {
    const char = document.createElement('div')
    char.className = `char ${input_condition[i].status}`
    char.textContent = input_condition[i].char
    word.appendChild(char)
  }
  document.getElementById("hints").appendChild(word)
  filter_word_list(input_condition)
})
/* - function ---------------------------------------------------------------------------------- */
function update_display_input() {
  for (let i = 0; i < 5; ++i) {
    const input_char = document.getElementById(`input-char-${i}`)
    input_char.textContent = input_condition[i].char
    input_char.className = `char ${input_condition[i].status}`
  }
}
function update_char_status(index) {
  const old_status = input_condition[index].status
  const convert = {
    gray: "yellow",
    yellow: "green",
    green: "gray"
  }
  input_condition[index].status = convert[old_status]
  update_display_input()
}
function filter_word_list(filter_condition) {
  filter_condition = filter_condition.map(obj => ({ ...obj, char: obj.char.toLowerCase() }))
  let condition = { include: new Set(), not_include: new Set(), spot: [], not_spot: [] }
  filter_condition.forEach(({ char, status }, i) => {
    switch (status) {
      case "green":
        condition.spot.push({ index: i, char })
        break
      case "yellow":
        condition.include.add(char)
        condition.not_spot.push({ index: i, char })
        break
      case "gray":
        if (filter_condition.some(obj => obj.char === char && obj.status !== "gray")) {
          condition.include.add(char)
          condition.not_spot.push({ index: i, char })
          break
        }
        condition.not_include.add(char)
        break
    }
  })
  word_list.forEach((word) => {
    // spot
    for (const spot of condition.spot) {
      if (word.substring(spot.index, spot.index + 1) !== spot.char) {
        word_list.delete(word)
        return
      }
    }
    // include
    for (const char of condition.include) {
      if (!word.includes(char)) {
        word_list.delete(word)
        return
      }
    }
    // not_include
    for (const char of condition.not_include) {
      if (word.includes(char)) {
        word_list.delete(word)
        return
      }
    }
    // not_stop
    for (const spot of condition.not_spot) {
      if (word.substring(spot.index, spot.index + 1) === spot.char) {
        word_list.delete(word)
        return
      }
    }
  })
  update_word_list()
}
function update_word_list() {
  const list = document.getElementById("list-content")
  list.innerHTML = ""
  document.getElementById("list-count").textContent = `候補数 : ${word_list.size}`
  word_list.forEach(word => {
    const span = document.createElement('span')
    span.textContent = word
    list.appendChild(span)
  })
}
/* --------------------------------------------------------------------------------------------- */