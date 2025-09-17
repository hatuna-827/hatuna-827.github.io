"use strict"
import data from "../site.json" with {type: "json"}
let links = data.site
let link_box = document.getElementById("auto_links")
let filter = link_box.dataset.filter
links.filter((link) => link.link_visible.includes(filter))
	.forEach(link => {
		let new_a = document.createElement("a")
		let new_div = document.createElement("div")
		let new_p = document.createElement("p")
		let new_span = document.createElement("span")
		new_a.setAttribute("href", link.url.replace("index.html",""))
		new_p.textContent = link.main_title
		new_span.textContent = link.sub_title
		link_box.insertAdjacentElement("beforeend", new_a)
		new_a.appendChild(new_div)
		new_div.appendChild(new_p)
		new_p.appendChild(new_span)
	})
