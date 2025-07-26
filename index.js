/*
 * @Author: bgcode
 * @Date: 2025-07-19 10:41:58
 * @LastEditTime: 2025-07-26 20:03:48
 * @LastEditors: bgcode
 * @Description: 描述
 * @FilePath: /anki/index.js
 * 本项目采用GPL 许可证，欢迎任何人使用、修改和分发。
 */

function formatDeckName() {
    const deckInfo =  document.getElementById("deck-info");
    if (!deckInfo || !deckInfo.textContent.includes('::')) return deckInfo.innerHTML = '<div class="deck-info-text">卡组:</div><div class="deck-container">' + 
        `<div class="kz0">${deckInfo.textContent}</div>`+'</div>'; 

    // 分割卡组层级并添加缩进
    const parts = deckInfo.textContent.replace('卡组: ', '').split('::');
    deckInfo.innerHTML = '<div class="deck-info-text">卡组:</div><div class="deck-container">' + parts.map((part, index) =>
        `<div class="kz${index}">${part}</div>`
    ).join('')+'</div>';
}

// 确保在DOM加载完成后执行
if (document.readyState !== 'loading') {
    formatDeckName();
} else {
    document.addEventListener('DOMContentLoaded', formatDeckName);
}

function time(endTime) {
        var nowtime = new Date();
        var endtime = new Date(endTime);
        var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
        var d = parseInt(lefttime / (24*60*60))
        var h = parseInt(lefttime / (60 * 60) % 24);
        var m = parseInt(lefttime / 60 % 60);
        var s = parseInt(lefttime % 60);
        d = d < 10 ? "0" + d: d + ""
        h = h < 10 ? "0" + h: h + ""
        m = m < 10 ? "0" + m: m + ""
        s = s < 10 ? "0" + s: s + ""
        document.getElementById("time").innerHTML = `<p class="djs">考试倒计时:</p>
        <div class="time-container">
        <div class="time-unit">
            <div class="time-number">${d}</div>
            <div class="time-label">天</div>
        </div>
        <div class="time-unit">
            <div class="time-number">${h}</div>
            <div class="time-label">时</div>
        </div>
        <div class="time-unit">
            <div class="time-number">${m}</div>
            <div class="time-label">分</div>
        </div>
        <div class="time-unit">
            <div class="time-number seconds">${s}</div>
            <div class="time-label">秒</div>
        </div></div>`;
        if (lefttime <= 0) {
            document.getElementById("time").innerHTML = `<p class="js">考试已结束</p>`
            return;
        }
        setTimeout(function(){time(endTime)}, 1000);
    }
