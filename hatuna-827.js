"use strict"
document.querySelector('head').insertAdjacentHTML('afterbegin', '\
    <meta charset="UTF-8" />\
    <meta name="viewport" content="width=device-width, initial-scale=1" />\
    <meta name="author" content="hatuna-827" />\
    <meta name="theme-color" content="#709170" />\
    <link rel="shortcut icon" type="image/x-icon" href="/hatuna-827.ico" />\
    <link rel="apple-touch-icon" href="/hatuna-827.png" />\
    <link rel="stylesheet" href="/hatuna-827.css" />\
    <link rel="manifest" href="/manifest.json" />\
    ')
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('homebar').innerHTML = "<a href='/link' id='home_link'>hatuna-827</a>"
})
