/*
 * @Author: bgcode
 * @Date: 2025-07-19 10:41:58
 * @LastEditTime: 2025-07-27 20:30:49
 * @LastEditors: bgcode
 * @Description: 描述
 * @FilePath: /anki/index.js
 * 本项目采用GPL 许可证，欢迎任何人使用、修改和分发。
 */

if (void 0 === window.Persistence) { let _persistenceKey = "anki-persistence", _defaultKey = "anki_gData"; if (((window.Persistence_sessionStorage = function () { var e = !1; try { "object" == typeof window.sessionStorage && ((e = !0), (this.clear = function () { for (var e = 0; e < sessionStorage.length; e++) { var t = sessionStorage.key(e); 0 == t.indexOf(_persistenceKey) && (sessionStorage.removeItem(t), e--) } }), (this.setItem = function (e, t) { null == t && ((t = e), (e = _defaultKey)), sessionStorage.setItem(_persistenceKey + e, JSON.stringify(t)) }), (this.getItem = function (e) { return (null == e && (e = _defaultKey), JSON.parse(sessionStorage.getItem(_persistenceKey + e))) }), (this.removeItem = function (e) { null == e && (e = _defaultKey), sessionStorage.removeItem(_persistenceKey + e) })) } catch (e) { } this.isAvailable = function () { return e } }), (window.Persistence_windowKey = function (e) { let t = window[e], n = !1; "object" == typeof t && ((n = !0), (this.clear = function () { t[_persistenceKey] = {} }), (this.setItem = function (e, n) { null == n && ((n = e), (e = _defaultKey)), (t[_persistenceKey][e] = n) }), (this.getItem = function (e) { return (null == e && (e = _defaultKey), null == t[_persistenceKey][e] ? null : t[_persistenceKey][e]) }), (this.removeItem = function (e) { null == e && (e = _defaultKey), delete t[_persistenceKey][e] }), null == t[_persistenceKey] && this.clear()), (this.isAvailable = function () { return n }) }), (window.Persistence = new Persistence_sessionStorage()), Persistence.isAvailable() || (window.Persistence = new Persistence_windowKey("py")), !Persistence.isAvailable())) { let titleStartIndex = window.location.toString().indexOf("title"), titleContentIndex = window.location.toString().indexOf("main", titleStartIndex); titleStartIndex > 0 && titleContentIndex > 0 && titleContentIndex - titleStartIndex < 10 && (window.Persistence = new Persistence_windowKey("qt")) } }

var gData = new Object();
if (Persistence.isAvailable()) {
    // do stuff
    gData = Persistence.getItem();
    if (gData == null) {
        gData = {
            clickedValues: [],
            clickedValuesIndex: [],
            correctanswer: [],
            total: 0,
            correct: 0,
            optionsList:''
        }
        Persistence.setItem(gData);
    }
}
function formatDeckName() {
    const deckInfo = document.getElementById("deck-info");
    if (!deckInfo || !deckInfo.textContent.includes('::')) {
        deckInfo.innerHTML = '<div class="deck-info-text">卡组:</div><div class="deck-container">' +
            `<div class="kz0">${deckInfo.textContent}</div>` + '</div>';
    } else {
        const parts = deckInfo.textContent.replace('卡组: ', '').split('::');
        deckInfo.innerHTML = '<div class="deck-info-text">卡组:</div><div class="deck-container">' + parts.map((part, index) =>
            `<div class="kz${index}">${part}</div>`
        ).join('') + '</div>';
    }
    const categoryElement = document.getElementById('category');
    const textElement = document.getElementById('text');
    const optionElement = document.getElementById('options');
    const choose = document.getElementById('choose');
    const answer = document.getElementById('answer');
    const result = document.getElementById('result');
    if (categoryElement) {
        const category = categoryElement.textContent;
        switch (category) {
            case "0":
                textElement.textContent = '背书';
                break;
            case "1":
                textElement.textContent = '选择题';
                if (optionElement && answer) {
                    var correctanswer = answer.innerText.toUpperCase().match(/[A-Fa-f]/g);
                    correctanswer.length > 1 ? textElement.textContent = '多选题' : textElement.textContent = '单选题';
                    var options = optionElement.textContent;
                    var optionsList = ""
                    options = options.replace(/<\/?div>/g, ""),
                        options = options.replace(/\n+/g, ""),
                        options = options.replace(/ /g, ""),
                        options = options.replace(/<br.*?>/g, ""),
                        options = options.replace(/^\n/, ""),
                        options = options.replace(/\n$/, ""),
                        options = options.split(/###/g);
                    var sx = random(options.length)
                    var ssss = []
                    for (var key = 0; key < options.length; key++) {
                        var ss = sx[key]
                        var cc = String.fromCharCode(key + 65);
                        optionsList += `<div class="options-list" onclick="choose_options()" >
                                        <p>${cc}</p>${options[ss]}
                                        </div>`

                    }
                    for (var i = 0; i < sx.length; i++) {
                        if (correctanswer.includes(String.fromCharCode(sx[i] + 65))) {
                            ssss.push(String.fromCharCode(i + 65))
                        }

                    }
                    choose.innerHTML = optionsList;
                    gData.optionsList = optionsList.replace(/onclick.*"/g,"");
                    gData.clickedValuesIndex=sx
                    gData.correctanswer = ssss;
                    gData.total++
                }
                if(result){
                    choose.innerHTML = gData.optionsList;
                }
                break;
            case "2":
                textElement.textContent = '判断题';
                break;
            case "3":
                textElement.textContent = '填空题';
                break;
            default:
                textElement.textContent = '未知题型';
        }
    }
    // gData.
    setTimeout(function () { time(endTime) }, 1000);
}


function choose_options() {
    // 一次性获取所有选项（缓存DOM查询结果）
    const options = document.querySelectorAll('.options-list');
    if (!options.length) return; // 无选项时直接返回

    // 标记是否已初始化，防止重复绑定
    if (options[0].hasAttribute('data-initialized')) {
        return;
    }
    const handleClick = gData.correctanswer.length > 1 ? handleMultipleClick : handleSingleClick;
    // 绑定事件并标记已初始化
    options.forEach(option => {
        option.addEventListener('click', handleClick);
        option.setAttribute('data-initialized', 'true');
    });

    // 多选处理函数
    function handleMultipleClick() {
        // 优先更新视觉样式
        const isSelected = this.classList.toggle('selected');

        // 延迟处理数据更新，不阻塞UI
        requestIdleCallback(() => {
            const selectedValues = Array.from(options)
                .filter(opt => opt.classList.contains('selected'))
                .map(opt => opt.querySelector('p').textContent);

            // 更新全局数据
            gData.clickedValues = selectedValues;
            Persistence.setItem(gData);
        });
    }
    var lastSelected = null;
    // 单选处理函数（优化版）
    function handleSingleClick() {

        const isSelected = this.classList.contains('selected');

        if (isSelected) {
            this.classList.remove('selected');
            lastSelected = null;
            gData.clickedValues = [];
        } else {
            // 取消上一个选中项
            if (lastSelected) {
                lastSelected.classList.remove('selected');
            }
            // 选中当前项
            this.classList.add('selected');
            lastSelected = this;
            gData.clickedValues = [this.querySelector('p').textContent];
            Persistence.setItem(gData);
        }
    }

}

function random(length) {
    // 验证输入有效性
    if (typeof length !== 'number' || length < 0 || !Number.isInteger(length)) {
        throw new Error('请输入有效的非负整数作为数组长度');
    }

    // 创建初始索引数组 [0, 1, 2, ..., length-1]
    const indexArray = Array.from({ length }, (_, i) => i);

    // 使用Fisher-Yates洗牌算法打乱数组
    for (let i = indexArray.length - 1; i > 0; i--) {
        // 生成0到i之间的随机整数
        const j = Math.floor(Math.random() * (i + 1));
        // 交换位置
        [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
    }

    return indexArray;
}
/**
 * 检查两个数组是否包含相同的元素（不考虑元素顺序）
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {boolean} 当两个数组长度相等且包含相同元素时返回true，否则返回false
 */
function checkAnswer(arr1, arr2) {
    // 检查两个数组长度是否相等，不相等则直接返回false
    if (arr1.length != arr2.length) return false;
    // 对两个数组进行排序并转换为字符串进行比较，如果不相等则返回false
    if (arr2.sort().toString() != arr1.sort().toString()) return false;
    // 所有检查通过，返回true
    return true;
}
function time(endTime) {
    var nowtime = new Date();
    var endtime = new Date(endTime);
    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
    var d = parseInt(lefttime / (24 * 60 * 60))
    var h = parseInt(lefttime / (60 * 60) % 24);
    var m = parseInt(lefttime / 60 % 60);
    var s = parseInt(lefttime % 60);
    d = d < 10 ? "0" + d : d + ""
    h = h < 10 ? "0" + h : h + ""
    m = m < 10 ? "0" + m : m + ""
    s = s < 10 ? "0" + s : s + ""
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
    setTimeout(function () { time(endTime) }, 1000);
}
if (document.readyState !== 'loading') {
    formatDeckName();
} else {
    document.addEventListener('DOMContentLoaded', formatDeckName);
}
document.addEventListener('DOMContentLoaded', () => {
    // 用setTimeout让初始化在浏览器空闲时执行，不阻塞页面加载
    setTimeout(choose_options, 0);
});
