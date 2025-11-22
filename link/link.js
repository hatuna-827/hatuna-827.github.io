"use strict"
import data from "../site.json" with {type: "json"}
const _sites = data.site
const links = document.getElementById("auto_links")
if (links) { auto_links(links) }
const topic = document.getElementById("topic")
if (topic) { auto_links(topic) }
function auto_links(pos) {
	let sites = JSON.parse(JSON.stringify(_sites))
	const filter = pos.dataset.filter
	if (filter == "all") {
		sites = sites.filter((site) => /^\/(home|blog|game|tool|404)/.test(site.url))
	} else if (filter == "topic") {
		sites = sites.filter((site) => /^\/link\/(?!index)/.test(site.url))
	} else if (filter == "blog") {
		sites = sites.filter((site) => /^\/(blog|link\/index)/.test(site.url))
	} else if (filter == "game") {
		sites = sites.filter((site) => /^\/(game|link\/index)/.test(site.url))
	} else if (filter == "tool") {
		sites = sites.filter((site) => /^\/(tool|link\/index)/.test(site.url))
	} else {
		return
	}
	sites.forEach(site => {
		const link = document.createElement('a')
		link.className = "link"
		link.setAttribute('href', site.url.replace("index.html", ""))
		const display_box = document.createElement('div')
		display_box.className = "display-box"
		const title = document.createElement('div')
		title.className = "title"
		title.textContent = site.main_title
		const sub_title = document.createElement('div')
		sub_title.className = "sub-title"
		sub_title.textContent = site.sub_title
		const description = document.createElement('div')
		description.className = "description"
		description.innerText = site.description
		display_box.appendChild(title)
		display_box.appendChild(sub_title)
		display_box.appendChild(description)
		link.appendChild(display_box)
		pos.appendChild(link)
	})
}