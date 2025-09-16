"use strict"
export default async function dialog({
    type = "OO",
    title = "",
    content = "",
    button = [],
    main_color = "var(--dialog-main,#89b76c)",
    bg_color = "var(--dialog-bg,#f8f7f2)",
    title_color = "var(--dialog-title,#ffffff)",
    text_color = "var(--dialog-text,#000000)",
    font = "var(--dialog-font,'游明朝', 'Yu Mincho', 'YuMincho', 'Hiragino Mincho Pro', serif)"
} = {
        title: "引数一覧",
        content: "\
        dialog({type,title,content,button})\n\
        \n\
        引数\n\
        下記の要素を持つオブジェクトを指定します\n\
        \n\
        type(文字列)既定値:\"OO\"\n\
        ボタンの種類を指定します\n\
        この値はbuttonによって上書きされます\n\
        値:OO,OC,ARI,YNC,YN,RC\n\
        この値以外の場合\"OO\"と解釈されます\n\
        \n\
        title(文字列)既定値:\"\"\n\
        タイトルを指定します\n\
        \n\
        content(文字列)既定値:\"\"\n\
        ダイヤログの内容を指定します\n\
        \n\
        button(配列)既定値:[]\n\
        ボタンの種類を指定します\n\
        配列が空の場合を除きtypeを上書きします\n\
        \n\
        返り値\n\
        押されたボタンのindex値を返します\n\
        \n\
        注意\n\
        dialog関数は非同期処理で呼び出す必要があります\n\
        ",
    }) {
    return await new Promise(resolve => {
        const body = document.querySelector('body')
        const _bg = document.createElement('div')
        const _content = document.createElement('div')
        const _title = document.createElement('div')
        const _text = document.createElement('div')
        const _reply_button = document.createElement('div')
        _bg.style = "display: flex;position: fixed;margin: 0px;width: 100vw;height: 100vh;background-color: rgba(0, 0, 0, 0.4);justify-content: center;align-items: center;z-index: 1001;"
        _content.style = "font-family: " + font + ";padding: 0px 0px 20px;max-height: 80vh;max-width: 80vw;min-width: 600px;font-size: 30px;line-height: 40px;text-align: center;border-radius: 30px;background-color: " + bg_color + ";overflow: auto;scrollbar-width: none;"
        _title.style = "margin: 0px;height: 70px;max-width: 80vw;min-width: 600px;font-size: 40px;line-height: 70px;color: " + title_color + ";text-align: center;border-radius: 30px 30px 0px 0px;background-color: " + main_color + ";"
        _text.style = "max-height: calc(80vh - 220px);padding: 30px 30px 10px;overflow: auto;scrollbar-color: " + main_color + " " + bg_color + ";color: " + text_color + ";"
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
            new_reply_button.style = "display: inline;white-space: nowrap;inline-size: max-content;margin: 20px 30px 0px;height: 60px;min-width: 150px;border: none;border-radius: 10px;font-size: 30px;line-height: 60px;color: " + title_color + ";background-color: " + main_color + ";"
            new_reply_button.addEventListener('click', () => {
                document.body.removeChild(_bg)
                resolve(i)
            })
            _reply_button.insertAdjacentElement('beforeend', new_reply_button)
        })
        if (title != "") { _content.appendChild(_title) }
        if (content != "") { _content.appendChild(_text) }
        _content.appendChild(_reply_button)
        _bg.appendChild(_content)
        body.insertAdjacentElement('afterbegin', _bg)
    })
}

/*
OO  OKOnly           [OK]
OC  OKCancel         [OK][キャンセル]
ARI AbortRetryIgnore [中止][再試行][無視]
YNC YesNoCancel      [はい][いいえ][キャンセル]
YN  YesNo	         [はい][いいえ]
RC  RetryCancel      [再試行][キャンセル]
*/

/*
:root {
    --main-color: #89b76c;
    --bg-color: #f8f7f2;
    --title-color: #ffffff;
    --text-color: #000000;
}

#bg {
    display: flex;
    position: fixed;
    margin: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    justify-content: center;
    align-items: center;
}

#content {
    padding: 0px 0px 20px;
    max-height: 80vh;
    max-width: 80vw;
    min-width: 600px;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
    border-radius: 30px;
    background-color: "+bg_color+";
    overflow: auto;
    scrollbar-width: none;
}

#title {
    margin: 0px;
    height: 70px;
    max-width: 80vw;
    min-width: 600px;
    font-size: 40px;
    line-height: 70px;
    color: "+title_color+";
    text-align: center;
    border-radius: 30px 30px 0px 0px;
    background-color: "+main_color+";
}

#text {
    max-height: calc(80vh - 220px);
    padding: 30px 30px 10px;
    overflow: auto;
    scrollbar-color: "+main_color+" "+bg_color+";
    color: "+text_color+";
}

#button {
    button {
        display: inline;
        white-space: nowrap;
        inline-size: max-content;
        margin: 20px 30px 0px;
        height: 60px;
        min-width: 150px;
        border: none;
        border-radius: 10px;
        font-size: 30px;
        line-height: 60px;
        color: "+title_color+";
        background-color: "+main_color+";
    }
}
*/