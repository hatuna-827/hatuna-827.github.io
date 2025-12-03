"use strict"
document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${URL.parse("./dialog.css", import.meta.url)}">`)
export default function dialog({
	type = "OO",
	title = "",
	content = "",
	button = []
} = {
		title: "引数一覧",
		content: `dialog({type,title,content,button})

		引数
		下記の要素を持つオブジェクトを指定します

		type(文字列)既定値:"OO"
		ボタンの種類を指定します
		この値はbuttonによって上書きされます
		値:OO,OC,ARI,YNC,YN,RC
		この値以外の場合"OO"と解釈されます

		title(文字列)既定値:""
		タイトルを指定します

		content(文字列)既定値:""
		ダイヤログの内容を指定します

		button(配列)既定値:[]
		ボタンの種類を指定します
		配列が空の場合を除きtypeを上書きします

		返り値
		押されたボタンのindex値を返します

		注意
		dialog関数は非同期処理で呼び出す必要があります`
	}) {
	return new Promise(resolve => {
		const body = document.querySelector('body')
		const _bg = document.createElement('div')
		const _content = document.createElement('div')
		const _title = document.createElement('div')
		const _text = document.createElement('div')
		const _reply_button = document.createElement('div')
		_bg.id = "dialog"
		_content.id = "dialog-content"
		_title.id = "dialog-title"
		_text.id = "dialog-text"
		_reply_button.id = "dialog-reply-button"
		if (button.length == 0) {
			if (type === "OO") { button = ["OK"] }
			else if (type === "OC") { button = ["OK", "キャンセル"] }
			else if (type === "ARI") { button = ["中止", "再試行", "無視"] }
			else if (type === "YNC") { button = ["はい", "いいえ", "キャンセル"] }
			else if (type === "YN") { button = ["はい", "いいえ"] }
			else if (type === "RC") { button = ["再試行", "キャンセル"] }
			else { button = ["OK"] }
		}
		_text.innerText = content
		_title.innerText = title
		button.forEach((button_content, i) => {
			const new_reply_button = document.createElement('button')
			new_reply_button.innerText = button_content
			new_reply_button.className = "dialog-button"
			new_reply_button.addEventListener('click', () => {
				document.body.removeChild(_bg)
				resolve(i)
			})
			_reply_button.appendChild(new_reply_button)
		})
		if (title != "") { _content.appendChild(_title) }
		if (content != "") { _content.appendChild(_text) }
		_content.appendChild(_reply_button)
		_bg.appendChild(_content)
		body.insertAdjacentElement('afterbegin', _bg)
	})
}

/*
OO--OKOnly-----------[OK]
OC--OKCancel---------[OK][キャンセル]
ARI-AbortRetryIgnore-[中止][再試行][無視]
YNC-YesNoCancel------[はい][いいえ][キャンセル]
YN--YesNo------------[はい][いいえ]
RC--RetryCancel------[再試行][キャンセル]
*/
