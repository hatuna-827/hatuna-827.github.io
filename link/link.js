"use strict"
import data from "../site.json" with {type: "json"}
let links = data.site
let link_box = document.getElementById("auto_links")
let filter = link_box.dataset.filter
if (filter == "all") { links = links.filter((link) => !/^\/(index|link)/.test(link.url)) }
if (filter == "blog") { links = links.filter((link) => /^\/(blog|link\/index)/.test(link.url)) }
if (filter == "game") { links = links.filter((link) => /^\/(game|link\/index)/.test(link.url)) }
if (filter == "tool") { links = links.filter((link) => /^\/(tool|link\/index)/.test(link.url)) }
links.forEach(link => {
	let new_a = document.createElement("a")
	let new_div = document.createElement("div")
	let new_p = document.createElement("p")
	let new_span = document.createElement("span")
	new_a.setAttribute("href", link.url.replace("index.html", ""))
	new_p.textContent = link.main_title
	new_span.textContent = link.sub_title
	link_box.insertAdjacentElement("beforeend", new_a)
	new_a.appendChild(new_div)
	new_div.appendChild(new_p)
	new_p.appendChild(new_span)
})
