fetch('/site.json')
	.then(response => response.json())
	.then(data => {
		const main = document.getElementById('main')
		const colors = data.colors
		colors.forEach(color_name => {
			const color_var = `var(--${color_name})`
			const color = document.createElement('div')
			color.className = 'color'
			color.style.backgroundColor = color_var
			const name = document.createElement('div')
			name.className = 'name'
			name.textContent = color_var
			color.appendChild(name)
			main.appendChild(color)
		})
	})
	.catch(error => console.error(`Error: ${error}`))
