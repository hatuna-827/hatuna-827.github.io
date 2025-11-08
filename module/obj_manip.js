"use strict"
function get(obj, path) {
	arguments_check(obj, path)
	let root = [obj]
	if (typeof (path) == "string") { path = path.split(/[.[\]]/) }
	path.forEach((next_path) => {
		let next = root[root.length - 1][next_path]
		next_check(next)
		root.push(next)
	})
	return root.pop()
}
function modify(obj, _path, value) {
	const path = JSON.parse(JSON.stringify(_path))
	arguments_check(obj, path)
	let root = [obj]
	if (typeof (path) == "string") { path = path.split(/[.[\]]/) }
	path.forEach((next_path) => {
		let next = root[root.length - 1][next_path]
		next_check(next)
		root.push(next)
	})
	root[root.length - 1] = value
	path.reverse().forEach((next_path) => {
		root[root.length - 2][next_path] = root.pop()
	})
	return root[0]
}
function remove(obj, _path) {
	const path = JSON.parse(JSON.stringify(_path))
	arguments_check(obj, path)
	let root = [obj]
	if (typeof (path) == "string") { path = path.split(/[.[\]]/) }
	path.forEach((next_path) => {
		let next = root[root.length - 1][next_path]
		next_check(next)
		root.push(next)
	})
	root.pop()
	if (Array.isArray(root[root.length - 1])) {
		root[root.length - 1].splice(path[path.length - 1], 1)
	} else {
		delete root[root.length - 1][path[path.length - 1]]
	}
	path.reverse().slice(1).forEach((next_path) => {
		root[root.length - 2][next_path] = root.pop()
	})
	return root[0]
}
function set(obj, _path, value) {
	const path = JSON.parse(JSON.stringify(_path))
	arguments_check(obj, path)
	let root = [obj]
	if (typeof (path) == "string") { path = path.split(/[.[\]]/) }
	path.forEach((next_path) => {
		if (next_path === "") { return }
		let next = root[root.length - 1][next_path]
		if (next == undefined) { next = {} }
		root.push(next)
	})
	root[root.length - 1] = value
	path.reverse().forEach((next_path) => {
		if (next_path === "") { return }
		root[root.length - 2][next_path] = root.pop()
	})
	return root[0]
}
function arguments_check(obj, path) {
	if (obj === undefined || path === undefined) {
		throw new Error("|obj_manip module| Not enough arguments")
	}
	if (obj === null) {
		throw new Error("|obj_manip module| Object is null")
	}
}
function next_check(next) {
	if (next == undefined) {
		throw new Error("|obj_manip module| Path value not found")
	}
}

export default { get, modify, remove, set }
