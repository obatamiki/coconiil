'use strict'

import { app, BrowserWindow, dialog, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

const find = require('local-devices');

const Store = require('electron-store');

const store = new Store();

const app_name = 'ここにいる';

// save
let sp_mac = '';
let amount_time = 0;
let lasttime = -1;
let select_mac_flag = true;
let arpmac = [];
let consider_time = 0;
let findable = true;

// 最初のいる判定が出るまではlasttimeを更新しないことで、アプリを起動していない不在期間の消滅を防ぐ
let firstexist = false;

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        }
    })

    //if (isDevelopment) {
    //window.webContents.openDevTools()
    //}

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }))
    }

    menu(window);

    window.on('closed', () => {
        mainWindow = null
    })

    window.webContents.on('devtools-opened', () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    })

    return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();

    //セーブデータ保存場所の確認
    //console.log(app.getPath('userData'));

    // macアドレスのロード
    let els_mac = store.get('mac');
    if (els_mac != null) {
        console.log('load mac ', els_mac);
        sp_mac = els_mac;
        select_mac_flag = false;
    } else {
        select_mac_flag = true;
        console.log('key not found');
    }

    // 累積時間のロード
    let els_time = store.get('time');
    if (els_time != null) {
        amount_time = els_time;
    }

    // 前回時刻のロード
    let els_lasttime = store.get('lasttime');
    if (els_lasttime != null) {
        lasttime = els_lasttime;
    }

    //main loop
    (function loop() {
        if (findable) {
            arp_scan(mainWindow);
        }
        increment_time(mainWindow, arpmac);
        setTimeout(loop, 5000);
    })();
})


// Menu
function menu(win) {
    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'App',
            submenu: [
                ...(isMac ? [] :
                    [{
                        label: app_name + " について...",
                        click: () => {
                            about_dialog(win);
                        }
                    }]),
                {
                    label: '選択中MACアドレスの確認と再設定...',
                    click: () => {
                        select_mac_flag = true;
                        arp_scan(win);
                    }
                },
                ...(isDevelopment ?
                    [{
                        label: "セーブデータ削除して終了",
                        click: () => {
                            store.clear();
                            app.quit();
                        }
                    }] : []),
                //{ label: 'MACアドレスの再設定', click: () => { console.log('MACアドレスの再設定') } },
                ...(isMac ? [] : [{ role: 'quit' }])
            ]
        },
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function arp_scan(win) {
    findable = false;
    find().then(arp => {
        findable = true;
        arpmac = [];
        for (let j = 0; j < arp.length; j++) {
            let mac = arp[j]['mac'];
            arpmac.push(mac);
        }
        //arpmac.push('再スキャン');
        //arpmac.push('cancel');
        console.log(arpmac);

        if (select_mac_flag) {
            let retval = select_mac_dialog(win, arpmac);
            if (retval != null) sp_mac = retval;
        }
        //increment_time(win, arpmac);
    }).catch((err) => {
        console.log(err);
        //app.relaunch();
        app.quit();
        //var key = require.resolve('local-devices');
        //delete require.cache[key];
    });

    //let str = 'yahoo';
    //console.log('str1= ' + flag);
    //return mac;
}

function increment_time(win, arpmac) {
    let now = Date.now();
    let deltatime = 0;
    let ex = {
        not_exist: 0,
        exist: 1,
        consider: 2,
    };

    let be = ex.not_exist;
    if (lasttime >= 0) {
        deltatime = Math.min(now - lasttime, 1000 * 60 * 60 * 24);
        // いるいないの判定
        if (arpmac.indexOf(sp_mac) >= 0) {
            amount_time += deltatime;
            //いる判定が出たら、近未来の特定時刻まではいない判定をしない
            //いるのにいない判定がしばしば生じ、数分程度でいる判定に戻る挙動の対策
            //判定を無視する期間はarpスキャン不要
            consider_time = now + (1000 * 60 * 10);
            be = ex.exist;
            firstexist = true;
        } else if (now < consider_time) {
            amount_time += deltatime;
            be = ex.consider;
        }
    }

    console.log(sp_mac, amount_time, arpmac);
    win.webContents.send('ping', format_time(amount_time) + 'ここにいた', be);
    store.set('time', amount_time);
    if (firstexist || lasttime < 0) {
        lasttime = now;
        store.set('lasttime', lasttime);
    }
}

function format_time(ms) {
    let day = Math.floor(ms / 1000 / 60 / 60 / 24);
    ms -= day * 24 * 60 * 60 * 1000;
    let hour = Math.floor(ms / 1000 / 60 / 60);
    ms -= hour * 60 * 60 * 1000;
    let minute = Math.floor(ms / 1000 / 60);
    ms -= minute * 60 * 1000;
    let second = Math.floor(ms / 1000);
    ms -= second * 1000;

    let str = '';
    if (day > 0) str += day + '日 ';
    if (day > 0 || hour > 0) str += hour + '時間 ';
    if (day > 0 || hour > 0 || minute > 0) str += minute + '分 ';
    str += second + '秒 ';

    return str;
}

function select_mac_dialog(win, str) {
    let detail = '';
    if (sp_mac) detail += '現在の対象MACアドレス ' + sp_mac;

    let shortstr = [];
    for (let i = 0; i < str.length; i++) {
        shortstr.push('〜' + str[i].slice(-5));
    }
    shortstr.push('再スキャン');

    if (process.platform == 'win32') {
        shortstr.push('cancel');
    } else {
        shortstr.push('キャンセル');
    }

    var options = {
        type: 'question',
        buttons: shortstr,
        title: 'MACアドレスの選択',
        message: '「ここにいる」判定の対象とする、あなたの携帯端末のMACアドレス末尾を選択してください',
        detail: detail
    };
    let choice = null;

    let index = dialog.showMessageBoxSync(win, options);

    if (index < str.length) {
        choice = str[index];
        store.set('mac', choice);
        console.log('save mac', choice);
        select_mac_flag = false;
    } else if (index === str.length) {
        // rescan
        console.log('rescan');
    } else {
        // cancel
        select_mac_flag = false;
    }
    return choice;
}

function about_dialog(win) {
    var options = {
        type: 'info',
        title: app_name + " について",
        message: app_name + " (C)2020 OBATA Miki",
    };
    dialog.showMessageBoxSync(win, options);
}