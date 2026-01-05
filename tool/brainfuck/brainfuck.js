/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
let loopCounter = 0
let code, code_index, input, input_index, p, memory, old_log, interval, running, reset_flag
/* - init -------------------------------------------------------------------------------------- */
get_interval()
reset()
set_running(false)
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("runspeed-select").addEventListener('change', get_interval)
document.getElementById("pause").addEventListener('click', function () { set_running(false) })
document.getElementById("resume").addEventListener('click', function () { set_running(true) })
document.getElementById("run").addEventListener('click', function () {
  reset()
  // input
  input = document.getElementById("input-stdin").value
  // code
  const input_code = document.getElementById("input-code").value
  code = input_code.replace(/[^+\-<>.,[\]]/g, "")
  const output_code = document.getElementById("output-code")
  for (let i = 0; i < code.length; i++) {
    const n = document.createElement('span')
    n.textContent = code[i]
    output_code.append(n)
  }
  set_running(true)
})
/* - function ---------------------------------------------------------------------------------- */
function get_interval() { interval = Number(document.getElementById("runspeed-select").value) }
function reset() {
  reset_flag = true
  code = ""
  input = ""
  code_index = 0
  input_index = 0
  p = 0
  memory = [0]
  old_log = []
}
function resume() {
  if (code.length <= code_index) {
    set_running(false)
    return
  }
  step()
  if (!running) { return }
  if (interval == -1) {
    ++loopCounter
    if (1000 < loopCounter) {
      loopCounter = 0
      setTimeout(resume, 0);
    } else {
      resume()
    }
  }
  else {
    setTimeout(resume, interval);
  }
}
function step() {
  switch (code[code_index]) {
    case ">":
      ++p
      if (65536 < p) { error("Runtime Error: Memory pointer out of bounds. (65536)") }
      if (memory.length == p) { memory.append(0) }
    case "<":
      --p
      if (p < 0) { error("Runtime Error: Memory pointer out of bounds. (0)") }
    case "+":
      ++memory[p]
      if (memory[p] == 256) { memory[p] = 0 }
    case "-":
      --memory[p]
      if (memory[p] == -1) { memory[p] = 255 }
    case ",":
      old_log.append(memory[p])
      memory[p] = input[input_index]
      ++input_index
    case ".":
      document.getElementById("output-stdout").textContent += String.fromCharCode(memory[p])
    case "[":
    case "]":
    case "#":
      set_running(false)
  }
}
function set_running(v) {
  running = v
  const pause = document.getElementById("pause")
  const resume = document.getElementById("resume")
  if (v) {
    pause.style.display = "inline-block"
    resume.style.display = "none"
    resume()
  } else {
    pause.style.display = "none"
    resume.style.display = "inline-block"
  }
}
function error(content) {
  set_running(false)
}
/* --------------------------------------------------------------------------------------------- */