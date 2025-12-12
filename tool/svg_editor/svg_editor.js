"use strict"
/* - import ------------------------------------------------------------------------------------ */
import storage from "/module/storage.js"
import structure from "/module/structure.js"
/* - const ------------------------------------------------------------------------------------- */
let inline = false
// img drag
let scale = 1
let originX = 0
let originY = 0
let startX, startY
let isDragging = false
let zoom_min = 0.2
let zoom_max = 5
let opening_window = null
const img_view = document.getElementById("img-view")
const default_xml_value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"
\ \ stroke-linecap="round" stroke-linejoin="round">
</svg>`
// structure
const svg_struct = {
	setting: {
		type: "object", display_name: "設定", children: {
			viewBox: { type: "string", default: "0 0 24 24" },
			height: { type: "toggle", display_name: "高さ", children: { type: "number", default: 24, min: 0 } },
			width: { type: "toggle", display_name: "幅", children: { type: "number", default: 24, min: 0 } },
			x: { type: "toggle", display_name: "x軸の相対位置", children: { type: "number", default: 0, min: 0 } },
			y: { type: "toggle", display_name: "y軸の相対位置", children: { type: "number", default: 0, min: 0 } },
			attribute: { type: "reference", name: "element_attribute" }
		}
	},
	element: {
		type: "list", display_name: "要素",
		children: {
			type: "object",
			children: {
				attribute: { type: "reference", name: "element_attribute" },
				shape: {
					type: "select", display_name: "図形", option: {
						path: {
							children: {
								d: {
									type: "list", children: {
										type: "object", children: {
											type: {
												type: "select", display_name: "種類", option: {
													M: { display_name: "移動(絶対)", children: { reference: { type: "reference", name: "One_point_children" } } },
													L: { display_name: "直線(絶対)", children: { reference: { type: "reference", name: "One_point_children" } } },
													H: { display_name: "水平(絶対)", children: { reference: { type: "reference", name: "x_children" } } },
													V: { display_name: "垂直(絶対)", children: { reference: { type: "reference", name: "y_children" } } },
													A: { display_name: "弧(絶対)", children: { reference: { type: "reference", name: "A_children" } } },
													m: { display_name: "移動(相対)", children: { reference: { type: "reference", name: "One_point_children" } } },
													l: { display_name: "直線(相対)", children: { reference: { type: "reference", name: "One_point_children" } } },
													h: { display_name: "水平(相対)", children: { reference: { type: "reference", name: "x_children" } } },
													v: { display_name: "垂直(相対)", children: { reference: { type: "reference", name: "y_children" } } },
													a: { display_name: "弧(相対)", children: { reference: { type: "reference", name: "A_children" } } },
													Z: { display_name: "始点へ結ぶ" },
													Q: { display_name: "2次ベジエ曲線(絶対)", children: { reference: { type: "reference", name: "Two_point_children" } } },
													q: { display_name: "2次ベジエ曲線(相対)", children: { reference: { type: "reference", name: "Two_point_children" } } },
													C: { display_name: "3次ベジエ曲線(絶対)", children: { reference: { type: "reference", name: "Three_point_children" } } },
													c: { display_name: "3次ベジエ曲線(相対)", children: { reference: { type: "reference", name: "Three_point_children" } } },
													T: { display_name: "T", children: { reference: { type: "reference", name: "One_point_children" } } },
													t: { display_name: "t", children: { reference: { type: "reference", name: "One_point_children" } } },
													S: { display_name: "S", children: { reference: { type: "reference", name: "One_point_children" } } },
													s: { display_name: "s", children: { reference: { type: "reference", name: "One_point_children" } } },
												}
											}
										}
									}
								}
							}
						},
						rect: {
							display_name: "四角形 (rect)", children: {
								x: { type: "number", step: "any" },
								y: { type: "number", step: "any" },
								height: { type: "number", step: "any" },
								width: { type: "number", step: "any" },
								rx: { type: "toggle", children: { type: "number", min: 0, step: "any" } },
								ry: { type: "toggle", children: { type: "number", min: 0, step: "any" } }
							}
						},
						circle: {
							display_name: "真円 (circle)", children: {
								r: { type: "number", step: "any" },
								cx: { type: "number", step: "any" },
								cy: { type: "number", step: "any" }
							}
						},
						ellipse: {
							display_name: "楕円 (ellipse)", children: {
								cx: { type: "number", step: "any" },
								cy: { type: "number", step: "any" },
								rx: { type: "number", step: "any" },
								ry: { type: "number", step: "any" }
							}
						},
						line: {
							display_name: "直線 (line)", children: {
								x1: { type: "number", step: "any" },
								y1: { type: "number", step: "any" },
								x2: { type: "number", step: "any" },
								y2: { type: "number", step: "any" }
							}
						},
						polyline: {
							display_name: "折れ線 (polyline)", children: { points: { type: "reference", name: "points" } }
						},
						polygon: {
							display_name: "多角形 (polygon)", children: { points: { type: "reference", name: "points" } }
						},
						text: {
							display_name: "テキスト (text)", children: {
								text: { type: "string" },
								x: { type: "toggle", children: { type: "number", step: "any" } },
								y: { type: "toggle", children: { type: "number", step: "any" } },
								dx: { type: "list", children: { type: "number", step: "any" } },
								dy: { type: "list", children: { type: "number", step: "any" } },
								"text-anchor": { type: "toggle", children: { type: "select", option: { start: {}, middle: {}, end: {} } } },
								rotate: { type: "list", children: { type: "number", step: "any" } },
								textLength: { type: "toggle", children: { type: "number", step: "any" } },
								lengthAdjust: { type: "toggle", children: { type: "select", option: { spacing: {}, spacingAndGlyphs: {} } } }
							}
						}
					}
				}
			}
		}
	}
}
const element_attribute = {
	attribute: {
		type: "toggle", display_name: "属性", children: {
			type: "object", children: {
				"fill": { type: "toggle", display_name: "塗りつぶし", children: { type: "string", placeholder: "black , #000" } },
				"fill-opacity": { type: "toggle", display_name: "塗りつぶし透明度", children: { type: "number", min: 0, max: 1, step: "any", placeholder: "0~1" } },
				"stroke": { type: "toggle", display_name: "線の色", children: { type: "string", placeholder: "black , #000" } },
				"stroke-opacity": { type: "toggle", display_name: "線の透明度", children: { type: "number", min: 0, max: 1, step: "any", placeholder: "0~1" } },
				"stroke-width": { type: "toggle", display_name: "線の幅", children: { type: "number", min: 0, step: "any" } },
				"stroke-dasharray": { type: "toggle", display_name: "破線パターン", children: { type: "string", pattern: "[0-9]+,[0-9]+", placeholder: "破線の長さ,空白の長さ" } },
				"stroke-linecap": { type: "toggle", display_name: "線の終端の形状", children: { type: "select", option: { butt: { display_name: "直角(butt)" }, round: { display_name: "半円(round)" }, square: { display_name: "伸ばして直角(square)" } } } },
				"stroke-linejoin": { type: "toggle", display_name: "2つの線のつなぎめの形状", children: { type: "select", option: { miter: { display_name: "直角(miter)" }, round: { display_name: "丸(round)" }, bevel: { display_name: "斜角(bevel)" } } } },
			}
		}
	}
}
const points = {
	points: {
		type: "list", children: {
			type: "object", children: {
				x: { type: "number", step: "any" },
				y: { type: "number", step: "any" }
			}
		}
	}
}
const x_children = { x: { type: "number" } }
const y_children = { y: { type: "number" } }
const One_point_children = {
	x: { type: "reference", name: "x_children" },
	y: { type: "reference", name: "y_children" }
}
const Two_point_children = {
	control: { type: "object", display_name: "制御点", children: { point: { type: "reference", name: "One_point_children" } } },
	stop: { type: "object", display_name: "終点", children: { point: { type: "reference", name: "One_point_children" } } }
}
const Three_point_children = {
	control1: { type: "object", display_name: "制御点1", children: { point: { type: "reference", name: "One_point_children" } } },
	control2: { type: "object", display_name: "制御点2", children: { point: { type: "reference", name: "One_point_children" } } },
	stop: { type: "object", display_name: "終点", children: { point: { type: "reference", name: "One_point_children" } } }
}
const A_children = {
	rx: { type: "number", display_name: "横の半径", step: "any" },
	ry: { type: "number", display_name: "縦の半径", step: "any" },
	"x-axis-rotation": { type: "number", display_name: "傾き", step: "any", default: 0 },
	"large-arc-flag": { type: "select", display_name: "大小", option: { 0: { display_name: "小さい方" }, 1: { display_name: "大きい方" } } },
	"sweep-flag": { type: "select", display_name: "描く向き", option: { 0: { display_name: "反時計回り" }, 1: { display_name: "時計回り" } } },
	"end-point": { type: "reference", name: "One_point_children" }
}

/* - init -------------------------------------------------------------------------------------- */
structure.def_struct("svg", svg_struct)
structure.def_struct("element_attribute", element_attribute)
structure.def_struct("points", points)
structure.def_struct("x_children", x_children)
structure.def_struct("y_children", y_children)
structure.def_struct("One_point_children", One_point_children)
structure.def_struct("Two_point_children", Two_point_children)
structure.def_struct("Three_point_children", Three_point_children)
structure.def_struct("A_children", A_children)
reflect_setting()
/* - add eventListener ------------------------------------------------------------------------- */
window.addEventListener('beforeunload', () => {
	if (opening_window) { opening_window.close() }
})
document.getElementById("settings").addEventListener('click', () => {
	nurunu_open("/settings/?p=svg_editor", '_blank', 'top=100,left=200,height=500,width=400,popup')
})
document.getElementById("add-doc").addEventListener('change', function () {
	const fileReader = new FileReader()
	fileReader.addEventListener('load', function () {
		const img_doc = document.getElementById('img-doc')
		const doc = document.createElement('img')
		doc.id = "doc"
		doc.src = this.result
		img_doc.innerHTML = ""
		img_doc.appendChild(doc)
		update_img_view()
	})
	fileReader.readAsDataURL(this.files[0])
})
document.getElementById("img-home").addEventListener('click', function () {
	scale = 1
	originX = 0
	originY = 0
	update_img_view()
	clicked(this)
})
document.getElementById("sub-xml-copy").addEventListener('click', function () {
	const target = document.getElementById("xml-sub-view")
	navigator.clipboard.writeText(target.textContent)
	clicked(this)
})
document.getElementById("inline").addEventListener('click', function () {
	inline = !inline
	if (inline) {
		this.classList.add("inline")
	} else {
		this.classList.remove("inline")
	}
	update_sub_view()
})
// img_view
img_view.addEventListener('mousedown', (e) => {
	isDragging = true
	img_view.style.cursor = 'grabbing'
	startX = e.clientX - originX
	startY = e.clientY - originY
})
img_view.addEventListener('mousemove', (e) => {
	if (!isDragging) return
	originX = e.clientX - startX
	originY = e.clientY - startY
	update_img_view()
})
img_view.addEventListener('mouseup', () => {
	isDragging = false
	img_view.style.cursor = 'grab'
})
img_view.addEventListener('wheel', (e) => {
	e.preventDefault()
	const zoomIntensity = 0.1
	const delta = e.deltaY < 0 ? 1 : -1
	const newScale = scale + delta * zoomIntensity * scale
	scale = Math.min(Math.max(newScale, zoom_min), zoom_max)
	update_img_view()
})
window.addEventListener('storage', reflect_setting)
/* - function ---------------------------------------------------------------------------------- */
function update_img_view() {
	const content = document.getElementById("img-box")
	content.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`
	const doc = document.getElementById("img-doc")
	if (doc) {
		const img = document.getElementById("img-content")
		doc.style.height = img.offsetHeight + "px"
		doc.style.width = img.offsetWidth + "px"
	}
}
function clicked(target) {
	target.classList.add("clicked")
	setTimeout(() => {
		target.classList.remove("clicked")
	}, 0)
}
function nurunu_open(url, target, features) {
	if (opening_window) { opening_window.close() }
	opening_window = window.open(url, target, features)
	opening_window.addEventListener('beforeunload', () => {
		opening_window.close()
		opening_window = null
	})
	return opening_window
}
function reflect_setting() {
	const setting = storage.get("svg-editor-setting")
	if (!setting) {
		set_views("gui")
		return
	}
	const homebar = document.getElementById("homebar")
	if (setting.hide_homebar) { homebar.style.display = "none" } else { homebar.style.display = "block" }
	if (setting.views === "xml") {
		set_views("xml")
	} else {
		set_views("gui")
	}
}
function set_views(view_type) {
	// const
	const main_editor = document.getElementById("main-content")
	const sub_view = document.getElementById("sub-view")
	const img_content = document.getElementById("img-content")
	// reset
	main_editor.innerHTML = ""
	if (view_type == "xml") {
		sub_view.className = "hide"
		const line_numbers = document.createElement('div')
		const textarea = document.createElement('textarea')
		line_numbers.className = "line-numbers"
		textarea.id = "xml-textarea"
		textarea.className = "xml"
		textarea.spellcheck = false
		textarea.textContent = default_xml_value
		textarea.addEventListener('input', function () {
			if (this.value == "") { this.value = default_xml_value }
			line_numbers.innerHTML = ""
			let line_count = this.value.match(/\n/g)
			if (line_count) { line_count = line_count.length + 1 } else { line_count = 1 }
			for (let i = 0; i < line_count; i++) { line_numbers.insertAdjacentElement('beforeend', document.createElement('span')) }
			img_content.innerHTML = this.value
			update_img_view()
		})
		textarea.dispatchEvent(new Event('input', { bubbles: true }))
		main_editor.appendChild(line_numbers)
		main_editor.appendChild(textarea)
	} else if (view_type == "gui") {
		sub_view.className = ""
		structure.set("main-content", "svg", () => {
			update_sub_view()
		})
		update_sub_view()
	}
}
function update_sub_view() {
	const img_content = document.getElementById("img-content")
	const textarea = document.getElementById("xml-sub-view")
	const line_numbers = document.getElementById("line-numbers-sub-view")
	let xml = object_to_svg(structure.get("main-content"))
	if (inline) { xml = comp_xml(xml) }
	img_content.innerHTML = xml
	textarea.textContent = xml
	line_numbers.innerHTML = ""
	let line_count = xml.match(/\n/g)
	if (line_count) { line_count = line_count.length + 1 } else { line_count = 1 }
	for (let i = 0; i < line_count; i++) { line_numbers.insertAdjacentElement('beforeend', document.createElement('span')) }
}
function object_to_svg(obj) {
	const shape_options = svg_struct.element.children.children.shape.option
	const d_option = svg_struct.element.children.children.shape.option.path.children.d.children.children.type.option
	const attribute_types = ["fill", "fill-opacity", "stroke", "stroke-opacity", "stroke-width", "stroke-dasharray", "stroke-linecap", "stroke-linejoin"]
	let xml = '<svg xmlns="http://www.w3.org/2000/svg"'
	const svg = obj.svg
	xml += add_xml(["viewBox", "height", "width", "x", "y"], svg.setting)
	xml += add_xml(attribute_types, svg.setting.attribute)
	xml += ">\n"
	const elements = svg.element
	elements.forEach(element => {
		xml += `  <${element.shape}`
		xml += add_xml(attribute_types, element.attribute)
		if (element.shape === "path") {
			xml += ' d="'
			element.d.forEach((d, i) => {
				const type = d.type
				if (i) { xml += " " }
				xml += type
				if (d_option[type].children === undefined) { return }
				const reference_name = d_option[type].children.reference.name
				if (reference_name === "One_point_children") {
					xml += `${d.x} ${d.y}`
				} else if (reference_name === "Two_point_children") {
					xml += `${d.control.x} ${d.control.y} ${d.stop.x} ${d.stop.y}`
				} else if (reference_name === "Three_point_children") {
					xml += `${d.control1.x} ${d.control1.y} ${d.control2.x} ${d.control2.y} ${d.stop.x} ${d.stop.y}`
				} else if (reference_name === "x_children") {
					xml += `${d.x}`
				} else if (reference_name === "y_children") {
					xml += `${d.y}`
				} else if (reference_name === "A_children") {
					xml += `${d.rx},${d.ry} ${d["x-axis-rotation"]} ${d["large-arc-flag"]} ${d["sweep-flag"]} ${d.x},${d.y}`
				}
			})
			xml += '" />\n'
		} else if (element.shape === "text") {
			xml += add_xml(["x", "y", "dx", "dy", "text-anchor", "rotate", "textLength", "lengthAdjust"], element)
			xml += `>${element.text}</text>\n`
		} else if (["polyline", "polygon"].includes(element.shape)) {
			xml += ' points="'
			element.points.forEach((point, i) => {
				if (i) { xml += " " }
				xml += `${point.x},${point.y}`
			})
			xml += '" />\n'
		} else {
			const shapes = ["rect", "circle", "ellipse", "line"]
			shapes.forEach((shape) => {
				if (element.shape === shape) {
					xml += add_xml(Object.keys(shape_options[shape].children), element)
				}
			})
			xml += " />\n"
		}
	})
	xml += "</svg>"
	return xml
}
function add_xml(types, obj) {
	if (obj === undefined) { return "" }
	let not_first = false
	let result = ""
	types.forEach((type) => {
		const value = obj[type]
		if (value === undefined) { return }
		if (!Array.isArray(value) || value.length !== 0) {
			if (not_first) { result += " " }
			not_first = true
			result += `${type}="${value}"`
		}
	})
	if (result !== "") { result = " " + result }
	return result
}
function comp_xml(xml) {
	xml = xml.replace(/\n *|(?<=[0-9]) *(?=[a-zA-Z])|(?<=") *|[, ](?=-)/g, "")
	return xml
}
/* --------------------------------------------------------------------------------------------- */
