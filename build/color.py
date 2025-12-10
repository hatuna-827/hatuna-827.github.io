import json
import re
path="hatuna-827.css"
with open("site.json", "r", encoding="utf-8") as f:
  data=json.load(f)
  color_data=data["colors"]
  theme_data=data["themes"]
colors=""

def f_theme(theme,indent):
  result=""
  for color in color_data:
    result+=f"{indent}--{color}: var(--{theme}-mode-{color});\n"
  return result

for theme in theme_data:
  colors+=f"@media (prefers-color-scheme: {theme}) {{\n\t:root {{\n"
  colors+=f_theme(theme,"\t\t")
  colors+="\t}\n}\n\n"
for theme in theme_data:
  colors+=f"body[data-theme='{theme}'] {{\n"
  colors+=f_theme(theme,"\t")
  colors+=f"}}\n\n"

with open(path, "r", encoding="utf-8") as f:
  css=f.read()
css=re.sub(r'/\* Auto insert color \*/.*?/\* Auto insert color end \*/', '/* Auto insert color *//* Auto insert color end */', css, flags=re.DOTALL)
css=css.replace("/* Auto insert color *//* Auto insert color end */", f"/* Auto insert color */\n{colors}/* Auto insert color end */")
with open(path, "w", encoding="utf-8") as f:
  f.write(css)

