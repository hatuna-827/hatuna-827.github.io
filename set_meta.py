import json
import re
with open("site.json", "r", encoding="utf-8") as f:
	site_data = json.load(f)["site"]
for site in site_data:
	path=f".{site["url"]}"
	url=site["url"]
	type=site["type"]
	title=site["title"]
	main_title=site["main_title"]
	sub_title=site["sub_title"]
	description=site["description"]
	name=site["name"]

	if title=="":
		title=main_title+sub_title
	if name=="":
		name=title+" | hatuna-827"
	else:
		name+=" | hatuna-827"
	with open(path, "r", encoding="utf-8") as f:
		html = f.read()
	html = re.sub(r'<!-- meta -->.*?<!-- meta-end -->', '<!-- meta --><!-- meta-end -->', html, flags=re.DOTALL)
	meta = f'''<!-- meta -->
\t<meta name="description" content="{description}">
\t<meta property="og:url" content="https://hatuna-827.github.io{url}">
\t<meta property="og:type" content="{type}">
\t<meta property="og:title" content="{title}">
\t<meta property="og:description" content="{description}">
\t<meta property="og:site_name" content="{name}">
\t<meta property="og:image" content="/1200_630.png">
\t<meta name="twitter:card" content="summary_large_image">
\t<meta property="twitter:domain" content="hatuna-827.github.io">
\t<meta property="twitter:url" content="https://hatuna-827.github.io{url}">
\t<meta name="twitter:title" content="{title}">
\t<meta name="twitter:description" content="{description}">
\t<meta name="twitter:image" content="/1200_630.png">
\t<!-- meta-end -->'''
	html = html.replace("<!-- meta --><!-- meta-end -->", meta)
	print(title)
	print("   ",name)
	print("   ",description)
	with open(path, "w", encoding="utf-8") as f:
		f.write(html)
print("meta tags replaced!")
