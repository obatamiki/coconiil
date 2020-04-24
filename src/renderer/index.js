'use strict';

// import 文を使ってstyle.cssファイルを読み込む。
import "./style.css";

import { getStatic } from  './static.js'

const image = getStatic('./sleeping_cat.jpg');

var m = document.getElementById("app");
let html = '<div id="contents">';
html += '<p id="header_text"></p>';
html += '<div id="image"><img id="imgsrc" src="' + image + '"</img></div>'
html += '<p id="footer_text"></p>';
html += '</div>';
m.innerHTML = html;

var h = document.getElementById("header_text");
var i = document.getElementById("image");
var is = document.getElementById("imgsrc");
var f = document.getElementById("footer_text");
// 100にしたら微妙にスクロールバーが出て消えないので少し小さく
//m.style.width = '95vw';
//m.style.height = '95vh';

var b = document.getElementsByTagName('body')[0].style;
//b.background = 'url(./sleeping_cat.jpg) no-repeat';

var beflag = true;
let canreaction = true;

is.addEventListener('click', function(clickEvent) {
    if (!canreaction) return;
    canreaction = false;
    if (!beflag) return;
    if (Math.random() < 0.05) {
        is.src = getStatic('./sleeping_cat_eye.jpg')
    } else {
        let pictindex = Math.floor(Math.random() * 4);
        switch (pictindex) {
            case 0:
                is.src = getStatic('./sleeping_cat_tail.jpg')
                break;

            case 1:
                is.src = getStatic('./sleeping_cat_hand.jpg')
                break;

            case 2:
                is.src = getStatic('./sleeping_cat_left_ear.jpg')
                break;

            case 3:
                is.src = getStatic('./sleeping_cat_right_ear.jpg')
                break;

            default:
                is.src = getStatic('./sleeping_cat.jpg')
                break;
        }
    }
    setTimeout(() => {
        is.src = getStatic('./sleeping_cat.jpg')
            //canreaction = true;
    }, 800);
    setTimeout(() => {
        canreaction = true;
    }, 1500);
})

require('electron').ipcRenderer.on('ping', (event, message, be) => {
    let ex = {
        not_exist: 0,
        exist: 1,
        consider: 2,
    };
    //console.log('message: ' + message);
    //console.log('message: ' + JSON.stringify(message[0]['mac']));
    //let html = '<p>'+message+'</p>';
    h.textContent = message;

    switch (be) {
        case ex.not_exist:
            i.style.opacity = 0.1;
            beflag = false;
            f.textContent = 'いま ここにいない?';
            break;

        case ex.consider:
            i.style.opacity = 0.5;
            beflag = true;
            f.textContent = 'いま ここにいる';
            break;

        case ex.exist:
            i.style.opacity = 1.0;
            beflag = true;
            f.textContent = 'いま ここにいる';
            break;

        default:
            break;
    }
})