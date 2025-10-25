"use strict"
import obj_manip from "./obj_manip.js"
function get(key) {
  return JSON.parse(localStorage.getItem(key))
}
function set(key, value) {
  if (key === undefined) {
    throw new Error("|Storage module| Not enough arguments")
  }
  localStorage.setItem(key, JSON.stringify(value))
  return
}
function modify(key, path, value) {
  if (key === undefined || path === undefined) {
    throw new Error("|Storage module| Not enough arguments")
  }
  localStorage.setItem(key, JSON.stringify(obj_manip.modify(JSON.parse(localStorage.getItem(key)), path, value)))
  return
}
function remove(key, path) {
  if (key === undefined) {
    throw new Error("|Storage module| Not enough arguments")
  }
  if (path === undefined) {
    localStorage.removeItem(key)
    return
  }
  localStorage.setItem(key, JSON.stringify(obj_manip.remove(JSON.parse(localStorage.getItem(key)), path)))
  return
}

export default { get, set, modify, remove }
