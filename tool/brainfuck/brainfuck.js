/* - import ------------------------------------------------------------------------------------ */
/* - const ------------------------------------------------------------------------------------- */
let code = ""
let code_index = 0
let input, p, memory
/* - init -------------------------------------------------------------------------------------- */
reset()
/* - add eventListener ------------------------------------------------------------------------- */
document.getElementById("run").addEventListener('click', function () {
  let input_code = document.getElementById("code-input").value
  input_code = input_code.replace(/[^+\-<>.,[\]]/g, "")
  const output_code = document.getElementById("output-code")
  for (let i = 0; i < input_code.length; i++) {
    const n = document.createElement('span')
    n.textContent = input_code[i]
    output_code.append(n)
  }
})
/* - function ---------------------------------------------------------------------------------- */
function set_code(input_code) {
  code = input_code
  reset()
}
function reset() {
  input = ""
  p = 0
  memory = [0]
}
function step(command) {
  switch (command) {
    case ">":
      ++p
      if (65536 < p) { return { error: true, content: "Runtime Error: Memory pointer out of bounds. (65536)" } }
      if (memory.length == p) { memory.append(0) }
    case "<":
      --p
      if (p < 0) { return { error: true, content: "Runtime Error: Memory pointer out of bounds. (0)" } }
    case "+":
      ++memory[p]
      if (memory[p] == 256) { memory[p] = 0 }
    case "-":
      --memory[p]
      if (memory[p] == -1) { memory[p] = 255 }
    case ",":
    case ".":
      return { out: memory[p] }
    case "[":
    case "]":
    default:
  }
}
/* --------------------------------------------------------------------------------------------- */