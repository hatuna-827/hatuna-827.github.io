/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
let code = "", input = ""
let code_index, input_index, p, memory, old_log, interval, running, reset_flag, loopCounter, stopID
let code_children = []
/* - init -------------------------------------------------------------------------------------- */
get_interval()
reset()
set_running(false)
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("runspeed-select").addEventListener('change', get_interval)
document.getElementById("pause").addEventListener('click', function () { set_running(false) })
document.getElementById("resume").addEventListener('click', function () { set_running(true) })
document.getElementById("step-re").addEventListener('click', step_re())
document.getElementById("step-in").addEventListener('click', step)
document.getElementById("run").addEventListener('click', function () {
  set_running(false)
  // input
  input = document.getElementById("input-stdin").value
  document.getElementById("output-stdin").textContent = input
  // code
  const input_code = document.getElementById("input-code").value
  code = input_code.replace(/\s+/g, " ")
  code = input_code.replace(/[^+\-<>.,[\]#\s]/g, "")
  const output_code = document.getElementById("output-code")
  output_code.innerHTML = ""
  for (let i = 0; i < code.length; i++) {
    const n = document.createElement('span')
    n.textContent = code[i]
    output_code.appendChild(n)
  }
  code_children = output_code.childNodes
  reset()
  reset_flag = false
  set_running(true)
})
/* - function ---------------------------------------------------------------------------------- */
function get_interval() { interval = Number(document.getElementById("runspeed-select").value) }
function reset() {
  reset_flag = true
  code_index = 0
  input_index = 0
  p = 0
  memory = [0]
  old_log = []
  loopCounter = 0
  document.getElementById("output-stdout").textContent = ""
  const output_memory = document.getElementById("output-memory")
  output_memory.innerHTML = ""
  const n = document.createElement('span')
  n.className = "memory active"
  n.textContent = "0"
  output_memory.appendChild(n)
  code_children.forEach((element, i) => {
    element.className = ""
    if (i == 0) { element.className = "active" }
  })
}
function resume() {
  step()
  if (!running) { return }
  if (interval == -1) {
    ++loopCounter
    if (1000 < loopCounter) {
      loopCounter = 0
      setTimeout(resume, 0)
    } else {
      resume()
    }
  }
  else {
    stopID = setTimeout(resume, interval)
  }
}
function step() {
  if (reset_flag) {
    reset()
    reset_flag = false
  }
  if (code.length <= code_index) {
    set_running(false)
    reset_flag = true
    return
  }
  const output_memory = document.getElementById("output-memory")
  switch (code[code_index]) {
    case ">":
      output_memory.children[p].classList.remove("active")
      ++p
      if (65536 < p) { error("Runtime Error: Memory pointer out of bounds. (65536)") }
      if (memory.length == p) {
        memory.push(0)
        const n = document.createElement('span')
        n.className = "memory"
        n.textContent = "0"
        output_memory.appendChild(n)
      }
      output_memory.children[p].classList.add("active")
      break
    case "<":
      output_memory.children[p].classList.remove("active")
      if (memory[p] == 0 && p == memory.length - 1) {
        memory.splice(p, 1)
        output_memory.children[p].remove()
      }
      --p
      if (p < 0) { error("Runtime Error: Memory pointer out of bounds. (0)") }
      output_memory.children[p].classList.add("active")
      break
    case "+":
      ++memory[p]
      if (memory[p] == 256) { memory[p] = 0 }
      output_memory.children[p].textContent = memory[p]
      break
    case "-":
      --memory[p]
      if (memory[p] == -1) { memory[p] = 255 }
      output_memory.children[p].textContent = memory[p]
      break
    case ",":
      if (input[input_index] != undefined) {
        old_log.push(memory[p])
        memory[p] = input[input_index].charCodeAt(0)
        output_memory.children[p].textContent = memory[p]
      } else {
        reset_flag = true
        set_running(false)
        return
      }
      ++input_index
      break
    case ".":
      document.getElementById("output-stdout").textContent += String.fromCharCode(memory[p])
      break
    case "[":
      if (memory[p] == 0) {
        let n = 1
        for (let i = code_index + 1; i < code.length; ++i) {
          if (code[i] == '[') {
            ++n
          } else if (code[i] == ']') {
            --n
          }
          if (n == 0) {
            code_children[code_index].classList.remove("active")
            code_index = i
            break
          }
        }
      }
      break
    case "]":
      if (memory[p] != 0) {
        let n = 1
        for (let i = code_index - 1; i > 0; --i) {
          if (code[i] == ']') {
            ++n
          } else if (code[i] == '[') {
            --n
          }
          if (n == 0) {
            code_children[code_index].classList.remove("active")
            code_index = i
            break
          }
        }
      }
      break
    case "#":
      set_running(false)
      break
  }
  code_children[code_index].classList.remove("active")
  ++code_index
  if (code_children[code_index] != undefined) { code_children[code_index].classList.add("active") }
}
function step_re() {
  if (code_index == 0) {
    return
  }
  const output_memory = document.getElementById("output-memory")
  switch (code[code_index]) {
    case "[":
      if (memory[p] == 0) {
        let n = 1
        for (let i = code_index + 1; i < code.length; ++i) {
          if (code[i] == '[') {
            ++n
          } else if (code[i] == ']') {
            --n
          }
          if (n == 0) {
            code_children[code_index].classList.remove("active")
            code_index = i
            break
          }
        }
      }
      break
    case "]":
      if (memory[p] != 0) {
        let n = 1
        for (let i = code_index - 1; i > 0; --i) {
          if (code[i] == ']') {
            ++n
          } else if (code[i] == '[') {
            --n
          }
          if (n == 0) {
            code_children[code_index].classList.remove("active")
            code_index = i
            break
          }
        }
      }
      break
    default:
      switch (code[code_index - 1]) {
        case ">":
          output_memory.children[p].classList.remove("active")
          ++p
          if (65536 < p) { error("Runtime Error: Memory pointer out of bounds. (65536)") }
          if (memory.length == p) {
            memory.push(0)
            const n = document.createElement('span')
            n.className = "memory"
            n.textContent = "0"
            output_memory.appendChild(n)
          }
          output_memory.children[p].classList.add("active")
          break
        case "<":
          output_memory.children[p].classList.remove("active")
          if (memory[p] == 0 && p == memory.length - 1) {
            memory.splice(p, 1)
            output_memory.children[p].remove()
          }
          --p
          if (p < 0) { error("Runtime Error: Memory pointer out of bounds. (0)") }
          output_memory.children[p].classList.add("active")
          break
        case "+":
          ++memory[p]
          if (memory[p] == 256) { memory[p] = 0 }
          break
        case "-":
          --memory[p]
          if (memory[p] == -1) { memory[p] = 255 }
          break
        case ",":
          old_log.push(memory[p])
          if (input[input_index] != undefined) {
            memory[p] = input[input_index].charCodeAt(0)
          } else {
            set_running(false)
            return
          }
          ++input_index
          break
        case ".":
          document.getElementById("output-stdout").textContent += String.fromCharCode(memory[p])
          break
        case "#":
          set_running(false)
          break
      }
  }
  code_children[code_index].classList.remove("active")
  --code_index
  if (code_children[code_index] != undefined) { code_children[code_index].classList.add("active") }
}
function set_running(v) {
  running = v
  const pause_button = document.getElementById("pause")
  const resume_button = document.getElementById("resume")
  const step_in_button = document.getElementById("step-in")
  const step_re_button = document.getElementById("step-re")
  if (v) {
    pause_button.style.display = "inline-block"
    resume_button.style.display = "none"
    step_in_button.style.display = "none"
    step_re_button.style.display = "none"
    stopID = setTimeout(resume, interval)
  } else {
    pause_button.style.display = "none"
    resume_button.style.display = "inline-block"
    step_in_button.style.display = "inline-block"
    step_re_button.style.display = "inline-block"
    clearTimeout(stopID)
  }
}
function error(content) {
  set_running(false)
  const err_log = document.createElement('div')
  err_log.className = "error-log"
  err_log.textContent = content
  document.getElementById("output-stdout").appendChild(err_log)
}
/* --------------------------------------------------------------------------------------------- */