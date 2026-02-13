"use strict"
/* - import ------------------------------------------------------------------------------------ */
import import_data from "./wordle.json" with {type: "json"}
import snackbar from "/module/snackbar.js"
/* - const ------------------------------------------------------------------------------------- */
let word_list = new Set(import_data)
let input_condition
/* - init -------------------------------------------------------------------------------------- */
[...Array(5)].map((_, i) => i).forEach(i => document.getElementById(`input-char-${i}`).addEventListener('click', function () { update_char_status(i) }))
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("add-hint").addEventListener('click', function () {
  input_condition = { word: ["", "", "", "", ""], status: ["gray", "gray", "gray", "gray", "gray"] }
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
    input_condition.word = [...Array(5)].map((_, i) => (text[i] || "").toLowerCase())
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
  if (input_condition.word.join("").length !== 5) {
    snackbar({ type: "Err", context: "文字数が足りません。" })
    return
  }
  const word = document.createElement('div')
  word.className = "word hint"
  for (let i = 0; i < 5; ++i) {
    const char = document.createElement('div')
    char.className = `char ${input_condition.status[i]}`
    char.textContent = input_condition.word[i].toUpperCase()
    word.appendChild(char)
  }
  document.getElementById("hints").appendChild(word)
  filter_word_list(input_condition)
})
/* - function ---------------------------------------------------------------------------------- */
function update_display_input() {
  for (let i = 0; i < 5; ++i) {
    const input_char = document.getElementById(`input-char-${i}`)
    input_char.textContent = input_condition.word[i].toUpperCase()
    input_char.className = `char ${input_condition.status[i]}`
  }
}
function update_char_status(index) {
  const old_status = input_condition.status[index]
  const convert = {
    gray: "yellow",
    yellow: "green",
    green: "gray"
  }
  input_condition.status[index] = convert[old_status]
  update_display_input()
}
function filter_word_list(filter_condition) {
  let condition = { include: new Set(), not_include: new Set(), spot: [], not_spot: [] }
  for (let i = 0; i < 5; ++i) {
    const char = filter_condition.word[i]
    switch (filter_condition.status[i]) {
      case "green":
        condition.spot.push({ index: i, char })
        break
      case "yellow":
        condition.include.add(char)
        condition.not_spot.push({ index: i, char })
        break
      case "gray":
        console.log(char)
        if (filter_condition.word.includes(char)) {
          condition.include.add(char)
          condition.not_spot.push({ index: i, char })
          break
        }
        condition.not_include.add(char)
        break
    }
  }
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