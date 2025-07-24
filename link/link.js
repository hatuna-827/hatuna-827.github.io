"use strict"
import data from "./data.json" with {type: "json"}
let links = data.links
let link_box = document.getElementById("auto_links")
let filter = link_box.dataset.filter
for (let i = 0; i < links.length; i++) {
    if (!links[i].tag.includes(filter)) { continue }
    let new_a = document.createElement("a")
    let new_div = document.createElement("div")
    let new_p = document.createElement("p")
    let new_span = document.createElement("span")
    new_a.setAttribute("href", links[i].url)
    new_p.textContent = links[i].title
    new_span.textContent = links[i].subtitle
    link_box.insertAdjacentElement("beforeend", new_a)
    new_a.appendChild(new_div)
    new_div.appendChild(new_p)
    new_p.appendChild(new_span)
}
