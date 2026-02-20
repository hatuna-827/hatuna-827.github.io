export function load_module_css(css_path, position, element) {
  window.addEventListener('DOMContentLoaded', function () {
    const insert_element = element || document.querySelector('head')
    insert_element.insertAdjacentHTML(position || 'afterbegin', `<link rel="stylesheet" href="${URL.parse(css_path, import.meta.url)}">`)
  })
}
