'use strict'
fetch('/site.json')
	.then(response => response.json())
	.then(data => {
		add_topics(data.site)
		auto_links(data.site)
	})
	.catch(error => console.error(`Error: ${error}`))

function add_topics(sites) {
	const filter = document.getElementById('main').dataset.filter
	const topics = document.getElementById('topics')
	const topics_list = ['Blog', 'Game', 'Tool']
	topics_list.forEach((topic_name, i) => {
		if (i !== 0) {
			const partition = document.createElement('div')
			partition.className = 'topic-partition'
		}
		const topic = document.createElement('a')
		topic.className = 'topic'
		topic.href = `/link/${topic_name.toLowerCase()}`
		topic.textContent = topic_name
		if (topic_name.toLowerCase() === filter) {
			topic.className = 'topic selected'
		}
		const count = document.createElement('span')
		count.className = 'count'
		count.textContent = sites.filter(({ url }) => {
			return url.startsWith(`/${topic_name.toLowerCase()}`)
		}).length
		topic.appendChild(count)
		topics.appendChild(topic)
	})
}

function auto_links(sites) {
	const filter = document.getElementById('main').dataset.filter
	const pos = document.getElementById('auto_links')
	if (filter == 'all') {
		sites = sites.filter(site => /(index|404).html$/.test(site.url))
	} else if (filter == 'link') {
		sites = sites.filter(site => /^\/(index|home\/index|404|link\/all)/.test(site.url))
	} else if (filter == 'blog') {
		sites = sites.filter(site => /^\/blog/.test(site.url))
	} else if (filter == 'game') {
		sites = sites.filter(site => /^\/game/.test(site.url))
	} else if (filter == 'tool') {
		sites = sites.filter(site => /^\/tool/.test(site.url))
	} else {
		return
	}
	sites.forEach(site => {
		const link = document.createElement('a')
		link.className = 'link'
		link.setAttribute('href', site.url.replace('index.html', ''))
		const title = document.createElement('div')
		title.className = 'title'
		title.textContent = site.main_title
		const sub_title = document.createElement('div')
		sub_title.className = 'sub-title'
		sub_title.textContent = site.sub_title
		const description = document.createElement('div')
		description.className = 'description'
		description.innerText = site.description
		link.appendChild(title)
		link.appendChild(sub_title)
		link.appendChild(description)
		pos.appendChild(link)
	})
}
