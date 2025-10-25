import json
import re
homebar_ignore=["/index.html","/settings/index.html"]
with open("site.json", "r", encoding="utf-8") as f:
	site_data=json.load(f)["site"]
for site in site_data:
	path=f".{site["url"]}"
	url=site["url"]
	type="website"

	css_path=""
	if url.count("/")==1:
		css_path=url.replace("html","css")
	elif url.startswith("/link"):
		css_path="/link/link.css"
	elif url.startswith("/blog"):
		css_path="/blog/blog.css"
		type="article"
	else:
		path_s=url.rsplit('/', 2)[1]
		file_name=url.rsplit('/',1)[0]
		css_path=f"{file_name}/{path_s}.css"

	title=site["title"]
	main_title=site["main_title"]
	sub_title=site["sub_title"]
	description=site["description"]
	name=site["name"]
	title=main_title+sub_title if title=="" else title
	name=title+" | hatuna-827" if name=="" else name+" | hatuna-827"
	with open(path, "r", encoding="utf-8") as f:
		html=f.read()
	# head
	html=re.sub(r'<!-- Auto insert head -->.*?<!-- Auto insert head end -->', '<!-- Auto insert head --><!-- Auto insert head end -->', html, flags=re.DOTALL)
	head=f'''<!-- Auto insert head -->
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1">
\t<meta name="author" content="hatuna-827">
\t<meta name="description" content="{description}">
\t<meta property="og:url" content="https://hatuna-827.github.io{url}">
\t<meta property="og:type" content="{type}">
\t<meta property="og:title" content="{title}">
\t<meta property="og:description" content="{description}">
\t<meta property="og:site_name" content="{name}">
\t<meta property="og:image" content="/1200_630.png">
\t<meta name="twitter:card" content="summary_large_image">
\t<meta name="twitter:domain" content="hatuna-827.github.io">
\t<meta name="twitter:title" content="{title}">
\t<meta name="twitter:description" content="{description}">
\t<meta name="twitter:image" content="/1200_630.png">
\t<meta name="theme-color" content="#709170">
\t<link rel="shortcut icon" type="image/x-icon" href="/hatuna-827.ico">
\t<link rel="apple-touch-icon" href="/hatuna-827.ico">
\t<link rel="stylesheet" href="{css_path}">
\t<link rel="stylesheet" href="/hatuna-827.css">
\t<script src="/hatuna-827.js" type="module"></script>
\t<title>{name}</title>
\t<!-- Auto insert head end -->'''
	html=html.replace("<!-- Auto insert head --><!-- Auto insert head end -->", head)
	# body
	html=re.sub(r'<!-- Auto insert body -->.*?<!-- Auto insert body end -->', '<!-- Auto insert body --><!-- Auto insert body end -->', html, flags=re.DOTALL)
	body=f'''<!-- Auto insert body -->{'\n\t<div id="homebar"></div>' if url not in homebar_ignore else ''}
\t<noscript><style>body {{overflow: hidden;}}</style>You need to enable JavaScript to view this site.</noscript>
\t<!-- Auto insert body end -->'''
	html=html.replace("<!-- Auto insert body --><!-- Auto insert body end -->", body)
	with open(path, "w", encoding="utf-8") as f:
		f.write(html)
print("Auto inserted into",len(site_data),"files")
