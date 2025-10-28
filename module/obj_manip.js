"use strict"
function modify(obj, path, value) {
	if (obj === undefined || path === undefined) {
		throw new Error("|obj_manip module| Not enough arguments")
	}
	if (obj===null){
		throw new Error("|obj_manip module| Object is null")
	}
	let root = [obj]
	path = path.split(/[.[\]]/)
	path.forEach((next_path) => {
		let next = root[root.length - 1][next_path]
		if (next == undefined) {
			throw new Error("|obj_manip module| Path value not found")
		}
		root.push(next)
	})
	root[root.length - 1] = value
	path.reverse().forEach((next_path) => {
		root[root.length - 2][next_path] = root.pop()
	})
	return root[0]
}
function remove(obj, path) {
	if (obj === undefined || path === undefined) {
		throw new Error("|obj_manip module| Not enough arguments")
	}
	if (obj===null){
		throw new Error("|obj_manip module| Object is null")
	}
	let root = [obj]
	path = path.split(/[.[\]]/)
	path.forEach((next_path) => {
		let next = root[root.length - 1][next_path]
		if (next == undefined) {
			throw new Error("|obj_manip module| Path value not found")
		}
		root.push(next)
	})
	root.pop()
	delete root[root.length - 1][path[path.length - 1]]
	path.reverse().slice(1).forEach((next_path) => {
		root[root.length - 2][next_path] = root.pop()
	})
	return root[0]
}

export default { modify, remove }
