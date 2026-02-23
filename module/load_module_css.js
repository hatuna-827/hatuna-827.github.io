export function load_module_css(css_path, position, element) {
  window.addEventListener('DOMContentLoaded', function () {
    const insert_element = element || document.querySelector('head')
    try {
      let path
      path = new URL(css_path, import.meta.url).href
      insert_element.insertAdjacentHTML(position || 'afterbegin', `<link rel="stylesheet" href="${path}">`)
    } catch (e) {
      console.error(e)
    }
  })
}
