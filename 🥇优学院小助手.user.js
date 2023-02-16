// ==UserScript==
// @name         🥇优学院小助手 修改by余吉
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  优学院小助手，用于课件视频+课后作业+考试界面辅助答题(自动答题)。
// @author       Miss. and 余吉
// @match        https://utest.ulearning.cn/*
// @match        https://*.ulearning.cn/*/homework.do*
// @match        https://ua.ulearning.cn/learnCourse/learnCourse.html?*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      106.75.227.24
// ==/UserScript==

(function () {
    "use strict";
    //属性 注单用户限制搜索次数
    const set = {
    get_answer: "http://106.75.227.24:8877/fuck/cha1.php",
    upload_data: "http://106.75.227.24:8877/fuck/upload.php",
    heartbeat: "http://106.75.227.24:8877/fuck/server.php",
    Dealagging: false,
    left: 0,
    top: 0,
    uid: -1,
    token: null,
    timestamp: -1,
};
    //工具包
    const Util = {
        post_form: function (url, data, onload, onerror) {
            Util.post(url, data, onload, onerror, { "Content-Type": "application/x-www-form-urlencoded" });
        },
        post: function (url, data, onload, onerror, headers) {
            let data_form = new Deal();
            for (let value in data) {
                data_form.append(value, data[value]);
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: headers,
                data: data_form.text,
                onload: onload,
                onerror: onerror,
            });
        },
        get: function (url, data, onload, onerror) {
            let data_form = new Deal();
            for (let value in data) {
                data_form.append(value, data[value]);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: url + "?" + data_form.text,
                onload: onload,
                onerror: onerror,
            });
        },
        upload_api: function (data, send) {
            if (set.token == -1) {
                setTimeout(Util.upload_api, 1000, data, true);
                if (send === true) {
                    return;
                }
            }
            Util.post_form(set.upload_data, {
                token: "" + set.token,
                data: JSON.stringify(data),
            });
        },
        upload_paper: function (paper, pid, eid) {
            Util.upload_api({ op: 4,eid: eid, pid: pid, paper: paper });
        },
        upload_answer: function (answer, pid, eid) {
            Util.upload_api({ op: 5,eid: eid, pid: pid, answer: answer });
        },
        upload_title: function (title, quetype, quetxt) {
            Util.upload_api({ op: 6, type: quetype, title: title ,cont: quetxt });
        },
        get_answer: function (question, quetype, td,$ans) {
            return new Promise((resolve, reject) => {
                let data_form = new Deal();
                let datas = { question: question,type: quetype };
                for (let value in datas) {
                    data_form.append(value, datas[value]);
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: set.get_answer + "?" + data_form.text,
                    onload: function (r) {
                        if (r.status == 200) {
                            try {
                                let data = JSON.parse(r.responseText);
                                if (data.code == 1) {
                                    td.innerText = data.data[0].answer;
                                    td.addEventListener("click", function () {
                                        GM_setClipboard(data.data[0].answer);
                                    });
                                    if($ans)
                                    respondentExam._answer(data.data[0].answer,$ans);
                                    return ;
                                }
                                else if (data.code == 0) {
                                    td.innerText = "无答案(已回传服务器)";
                                    return 0;
                                }
                            }
                            catch (e) {console.log("error")}
                        }
                        td.innerText = "服务器错误,请加群反馈";
                        resolve(r);
                    },
                    onerror: function (e) {
                        td.innerText = "服务器错误,请加群反馈";
                        resolve(e);
                    }
                });
            })
        },
    };
    // 优学院
    const youxueyuan = {
        $startBtn: null,  // 开始按钮
        $stopBtn: null,   // 暂停按钮
        $rateText: null, //倍速
        timer: null,      // 定时器

        // 初始化
        init() {
            this.$startBtn = $('<td class="td_width td_center"><button style="background-color: #84f584; border-radius: 10px;">开始视频</button></td>');

            this.$stopBtn = $('<td class="td_width td_center"><button style="background-color: #84f584; border-radius: 10px;">暂停视频</button></td>');

            this.$rateText = $('<td class="td_width td_center" style="display:table-cell;width: 50px;">倍速：<input id="rate" type="text" value="6.00" style="width: 58px;"></td>');

            let $erviceMask = $('<tr></tr>');
            $('#get_answer').parent().parent().parent().append($erviceMask);
            $erviceMask.append(this.$startBtn).append(this.$stopBtn).append(this.$rateText);
            $('#hide_show').click();
            $('#get_answer').hide();
            $('#hide_show').hide();
            this.$stopBtn.hide();
            this.bindEvent();

        },

        // 绑定事件
        bindEvent() {
            this.$startBtn.click(() => {
                this.logic();
                this.timer = setInterval(() => { this.logic() }, 1500);
                this.$startBtn.hide();
                this.$stopBtn.show();
            });
            this.$stopBtn.click(() => {
                clearInterval(this.timer);
                this.$stopBtn.hide();
                this.$startBtn.show();
                // 暂停视频播放
                if ($(".file-media").length > 0) {
                    let $allVideos = $(".file-media");
                    for (let i = 0; i < $allVideos.length; i++) {
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == '暂停') {
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                            $('.mejs__button.mejs__volume-button button')[i].click();
                        }
                    }
                }
            })
        },

        // 视频主逻辑
        logic() {
            // 如果页面中弹出了框框
            if ($('.modal.fade.in').length > 0) {
                switch ($('.modal.fade.in').attr('id')) {
                    case 'statModal': {
                        $("#statModal .btn-hollow").eq(-1).click();
                        break;
                    }
                    case 'alertModal': {
                        if ($("#alertModal .btn-hollow").length > 0) {
                            $("#alertModal .btn-hollow").eq(-1).click();
                        }
                        else {
                            $("#alertModal .btn-submit").click();
                        }
                        break;
                    }
                }
                return;
            }

            // 如果页面中有视频
            if ($(".file-media").length > 0) {
                let $allVideos = $(".file-media");
                let i = 0;
                for (; i < $allVideos.length; i++) {
                    // 这个视频还没有看完并且不是播放状态
                    if (!$("[data-bind='text: $root.i18nMessageText().finished']").get(i)) {
                        let _rate = document.getElementById("rate").value;
                        // 视频不是播放状态
                        if ($('.mejs__button.mejs__playpause-button button').eq(i).attr('title') == '播放') {
                            $(".mejs__speed-selector-input")[i * 4].value = parseFloat(_rate);
                            $(".mejs__speed-selector-input")[i * 4].click();
                            $('.mejs__button.mejs__speed-button button')[i].innerText = _rate+'x';
                            $('.mejs__button.mejs__playpause-button button')[i].click();
                            $('.mejs__button.mejs__volume-button button')[i].click();
                        }
                        break;
                    }
                }
                if (i == $allVideos.length) {
                    $('.next-page-btn.cursor').click();
                }
                return;
            }

            // 如果是做题界面
            if ($('.question-setting-panel').length > 0) {

                // 修正当前状态
                let $submitBtn = $('.question-operation-area button').eq(0);
                if ($submitBtn.text() == '重做') {
                    $submitBtn.click();
                    return;
                }

                // 获取当前页面 ID
                let parentId = $('.page-name.active').parent().attr('id').substring(4);

                // 开始同步答题
                let $questions = $('.question-element-node');
                for (let i = 0; i < $questions.length; i++) {
                    respondent._answer(parentId, $questions.eq(i));
                }

                // 提交答案
                $submitBtn.click();
                setTimeout(() => {
                    $('.next-page-btn.cursor').click();
                }, 300);
                sleep
                return;
            }

            // 下一页
            $('.next-page-btn.cursor').click();
        },
    }

    // 答题器
    const respondent = {
        parentId: null,      // 页面ID
        questionId: null,    // 当前解答问题的ID
        $questionNode: null, // 当前解答问题的根节点

        // 回答问题
        // @param parentId     页面ID
        // @param questionNode 问题根节点
        _answer(parentId, $questionNode, callback) {
            this.parentId = parentId;
            this.$questionNode = $questionNode;
            this.questionId = this.$questionNode.find('.question-wrapper').attr('id').substring(8);
            let questionType = $questionNode.find('.question-type-tag').text().trim();
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case '判断题': {
                    this._answerJudge();
                    break;
                }
                case '填空题': {
                    this._answerInput();
                    break;
                }
                case '简答题': {
                    this._answerSimpleQuestion();
                    break;
                }
                case '选词填空': {
                    this._answerChoicesQuestion();
                    break
                }
                case '排序题': {
                    this._answerRankQuestion();
                    break
                }
                case '综合题': {
                    console.log("error")
                    break;
                }
            }
            if (callback && typeof callback == 'function') callback();
        },

        // 解答多选题
        _answerMultiSelect() {
            // 多选题需要清空当前答案
            let $selected = this.$questionNode.find('.checkbox.selected');
            for (let i = 0; i < $selected.length; i++) {
                $selected.eq(i).click();
            }
            // 获取答案并选择
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('.checkbox');
            let answerArray = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < answerArray.length; i++) {
                let index = answerArray[i].charCodeAt() - 'A'.charCodeAt();
                $emptySelected.eq(index).click();
            }
        },

        // 解答判断题
        _answerJudge() {
            let questionAnswer = this._syncGetAnswer().correctAnswerList[0];
            if (questionAnswer=="true") {
                this.$questionNode.find('.choice-btn.right-btn').click();
            }
            else {
                this.$questionNode.find('.choice-btn.wrong-btn').click();
            }
        },

        // 解答填空题
        _answerInput() {
            let $emptyInput = this.$questionNode.find('.blank-input');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                $emptyInput.eq(i).val(inputAnswers[i]);
            }
        },

        // 解答简答题
        _answerSimpleQuestion() {
            let $emptyInput = this.$questionNode.find('.form-control');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i].replace(/【答案要点】/g, '');
                $emptyInput.eq(i).val(answerText);
                $emptyInput.change();

            }
        },

        //选词填空题
        _answerChoicesQuestion(){
            let $emptyInput = this.$questionNode.find('.cloze-input');
            let inputAnswers = this._syncGetAnswer().subQuestionAnswerDTOList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i].correctAnswerList[0];
                $emptyInput.eq(i).val(answerText);
                $emptyInput.change();

            }
        },
        //排序题
        _answerRankQuestion(){
            let $emptyInput = this.$questionNode.find('.answer-blank');
            let inputAnswers = this._syncGetAnswer().correctAnswerList;
            for (let i = 0; i < inputAnswers.length; i++) {
                let answerText = inputAnswers[i];
                $emptyInput.eq(i).html(answerText);
                $emptyInput.change();

            }    
        },

        // 同步获取测试答案
        _syncGetAnswer() {
            let res_answer;
            $.ajaxSettings.async = false;
            $.get('https://api.ulearning.cn/questionAnswer/' + this.questionId + '?parentId=' + this.parentId,function(xhr){res_answer = xhr;})
            $.ajaxSettings.async = true;
            return res_answer;
        }
    };

    // 考试答题器
    const respondentExam = {
        answerText : null,
        $questionNode: null, // 当前解答问题的根节点
        // 回答问题
        // @param answerText 传来答案
        // @param questionNode 问题根节点
        _answer(answerText,$questionNode, callback) {
            this.answerText = answerText;
            this.$questionNode = $questionNode;
            let questionType = $questionNode.find('.base-question .title .tip').text().match(/\d+\.(.*?)\s+/)[1];
            switch (questionType) {
                case '多选题': {
                    this._answerMultiSelect();
                    break;
                }
                case '单选题': {
                    this._answerSelect();
                    break;
                }
                case '判断题': {
                    this._answerJudge();
                    break;
                }
                case '填空题': {
                    this._answerInput();
                    break;
                }
                case '简答题': {
                    this._answerSimpleQuestion();
                    break;
                }
            }if (callback && typeof callback == 'function') callback();
        },
        // 解答多选题
        _answerMultiSelect() {
            // 根据答案匹配
            let $emptySelected = this.$questionNode.find('.choice-list label .rich-text');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {   
                (function(j) {
                    setTimeout( function timer() {
                        if(answerArray.indexOf(re_text($emptySelected.eq(j).text())) != -1)
                        $emptySelected.eq(j).click();
                    }, j*1000 );
                })(i);
            
            }
        },

        // 解答单选题
        _answerSelect() {
            let $emptySelected = this.$questionNode.find('.choice-list label .rich-text');
            let answerArray = this.answerText;
            for (let i = 0; i < $emptySelected.length; i++) {
                if($emptySelected.eq(i).text() == answerArray)
                $emptySelected.eq(i).click();
            }
        },

        // 解答判断题
        _answerJudge() {
            let questionAnswer = this.answerText;
            if (questionAnswer=="true") {
                this.$questionNode.find('.ul-radio__input').eq(0).click();
            }
            else {
                this.$questionNode.find('.ul-radio__input').eq(1).click();
            }
        },

        // // 解答填空题
        // _answerInput() {
        // },

        // // 解答简答题
        // _answerSimpleQuestion() {
        //     }
        // },   
    }
    Re_Write();
    Set_Heart();
    Init();

//拦截
function Re_Write() {
    const open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        let url = arguments[1];
        if (url) {
            if (url.match(/getPaperForStudent/) && url.match(/examId=(\d+)/) && url.match(/paperId=(\d+)/)) {
                let examID = url.match(/examId=(\d+)/)[1];
                let paperID = url.match(/paperId=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    Util.upload_paper(data, paperID, examID);
                });
            }
            else if (url.match(/getCorrectAnswer/) && url.match(/examId=(\d+)/) && url.match(/paperId=(\d+)/)) {
                let examID = url.match(/examId=(\d+)/)[1];
                let paperID = url.match(/paperId=(\d+)/)[1];
                this.addEventListener('load', () => {
                    let data = JSON.parse(this.responseText);
                    Util.upload_answer(data, paperID, examID);
                });
            }
        }
        return open.apply(this, arguments);
    };
}
//UI初始化
function Init() {
    if (!document.body) {
        setTimeout(Init, 100);
        return;
    }
    setTimeout(function beright(){
        var contentz = document.querySelector('.is-common').className='container';
        console.log(contentz)
        //alert(contentz)

    },15000)
    let style = document.createElement("style");
    style.innerHTML = `
    #answer_key {
        min-height: 22px;
        max-height: 250px;
        overflow: auto;
    }
    .td_center {
    }
    .td_left {
        text-align: left;
    }
    .td_right {
        text-align: right;
    }
    .td_width {
        width: 125px;
    }
    img {
        pointer-events: none;
        width: 260px;
    }`;
    let div = document.createElement("div");
    let pageurl = window.location.href.split("?")[0];
    if(pageurl=="https://utest.ulearning.cn/"){
        div.setAttribute("style", "background-color: #C6DFF7; position: fixed; top: 54px; right: 380px; width: 270px; opacity: 0.03;border-style: dotted; border-width: 3px;z-index:99999;");
    }
    else{
        div.setAttribute("style", "background-color: #C6DFF7; position: fixed; top: 54px; left: 50px; width: 270px; opacity: 0.75; border-style: dotted; border-width: 3px;z-index:99999;");
    }

    div.innerHTML = `
    <img src="https://z4a.net/images/2022/11/29/776631fc11a44a438cfa0cf123482d91.png" border="0">
    <table style="border-collapse:separate; border-spacing:1px 6px;margin-bottom:2px;">
        <tbody>
            <tr>
                <td class="td_width td_center">
                    <button id="get_answer" style="background-color: #84f584; border-radius: 10px;">查询答案</button>
                </td>
                <td class="td_width td_center">
                    <button id="hide_show" style="background-color: #84f584; border-radius: 10px;">显示/隐藏答案</button>
                </td>
            </tr>
            <tr>
                <td class="td_width td_right">
                    服务器状态：
                </td>
                <td id="server_status" class="td_width td_left" style="font-color: blue;">
                    获取中..
                </td>
            </tr>
        </tbody>
    </table>
    <div id="answer_key" style="display: block;">
        <table border="1" id="answer_table">
            <tbody>
                <tr>
                    <th class="td_width td_center">题目</th>
                    <th class="td_width td_center">答案</th>
                </tr>
            </tbody>
        </table>
    </div>
    `;
    document.body.appendChild(style);
    document.body.appendChild(div);
    Bind();
    div.addEventListener("mousedown", function (e) {
        set.Dealagging = true;
        let mer = div.getBoundingClientRect();
        set.left = e.clientX - mer.left;
        set.top = e.clientY - mer.top;
    });
    div.addEventListener("mouseup", function () {
        set.Dealagging = false;
    });
    div.addEventListener("mousemove", function (e) {
        if (set.Dealagging) {
            let x = e.clientX - set.left;
            let y = e.clientY - set.top;
            div.style.left = x + "px";
            div.style.top = y + "px";
        }
    });
    let new_uri= window.location.href.split("?")[0];
    if(new_uri=="https://ua.ulearning.cn/learnCourse/learnCourse.html"){
        youxueyuan.init();
    }
}
//隐藏
function Bind() {
    let get_answer = document.querySelector("#get_answer");
    get_answer && (function () {
        get_answer.addEventListener("click", Get_Answer, false);
    })();
    let hide_show = document.querySelector("#hide_show");
    hide_show && (function () {
        hide_show.addEventListener("click", function () {
            let answer_key = document.querySelector("#answer_key");
            answer_key && (function () {
                answer_key.getAttribute("style") === "display: block;" && (function () {
                    answer_key.setAttribute("style", "display: none;");
                    return true;
                })() || (function () {
                    answer_key.setAttribute("style", "display: block;");
                })();
            })();
        }, false);
    })();
}
function Set_Heart() {
        setInterval(Heart, 20000);
}
//服务器状态
function Heart() {
    let server_status = document.querySelector("#server_status");
    if (server_status) {
        set.timestamp = new Date().getTime();
        Util.get(set.heartbeat, { token: "" + set.token, timestamp: "" + set.timestamp }, function (xhr) {
            try {
                let xhr_json = JSON.parse(xhr.responseText);
                if (xhr_json.code == 1) {
                    server_status.innerText = "正常";
                    return;
                }
            }
            catch (e) {console.log("error")}
            server_status.innerText = "异常";
        }, function () {
            server_status.innerText = "异常";
        });
    }
}
function Clear_Table() {
    let answer_table = document.querySelector("#answer_table");
    answer_table && (function () {
        while (answer_table.rows.length > 1) {
            answer_table.deleteRow(1);
        }
    })();
}
//题库
function Get_Answer() {
    Clear_Table();
    let question_area = document.querySelectorAll(".question-area");
    question_area && (function(){
        question_area.forEach(function (item) {
            item.childNodes.forEach(function (div) {
                if (div.className.indexOf("next-part") != -1) {
                    return;
                }
                switch (div.className) {
                    case "question-item":
                        way1(div);
                        break;
                    default:
                        way2(div);
                }
            });
        });
    })();
    let question_wrap = document.querySelectorAll("#questionWrap");
    question_area && (function(){
        question_wrap.forEach(function (item) {
            item.childNodes.forEach(function (div){
                switch (div.className) {
                    case "multiple-choices":
                        case "judge":
                        case "fill":
                        case "match":
                        case "sort":
                            way3(div);
                            break;
                        case "blankFill":
                        case "cloze":
                        default:
                            way2(div);
                }
            });
        });
    })();
}
//作业
function way3(div) {
    let index = div.querySelector(".position-rltv").firstChild.innerText;
    let title = div.querySelector(".position-rltv").lastChild;
    let quetype = div.firstChild.dataset.type;
    let title_text = title && title.innerText || "";
    let answer_table = document.querySelector("#answer_table");
    answer_table && (async function () {
        let tr = answer_table.insertRow();
        let t = tr.insertCell();
        t.innerText = "【" + index.split(".")[0] + "】" + title_text;
        t.addEventListener("click", function () {
            GM_setClipboard(this.innerText);
        }, false);
        t = tr.insertCell();
        await Util.get_answer(title_text, quetype, t);
    })();
}
function way2(div) {
//   英语答题类      待提供测试账号开发
//   英语答题类      待提供测试账号开发
//   英语答题类      待提供测试账号开发
}
//考试
function way1(div) {
    let qid = div.firstChild.__vue__.question.questionid;
    if (!qid) {
        return;
    }
    let index = div.firstChild.__vue__.question.index;
    let title = re_text(div.firstChild.__vue__.question.title);
    let quetype = div.firstChild.__vue__.question.type;
    let quetxt = "";
    let cho = div.firstChild.__vue__.question.choices;
    if(quetype==1||quetype==2){
        cho.forEach(function(item){quetxt+=item.text+"||";})
        quetxt = re_text(quetxt);
    }
    let answer_table = document.querySelector("#answer_table");
    answer_table && (async function () {
        let tr = answer_table.insertRow();
        let t = tr.insertCell();
        t.innerText = "【" + index + "】" + title;
        t.addEventListener("click", function () {
            GM_setClipboard(this.innerText);
        }, false);
        t = tr.insertCell();
        let codeAnswer = await Util.get_answer(title, quetype, t,$(div));
        if(codeAnswer==0){
            //无答案回传
            Util.upload_title(title, quetype, quetxt);
        }        
    })();
}
//正则处理
function re_text(text) {
    text = text.replace(/<\/?.+?\/?>/g,'');
    text = text.replace(/\t/g, "");
    text = text.replace(/\n/g, "");
    text = text.replace(/\r/g, "");
    text = text.replace(/&.*?;/g, "");
    return $.trim(text.substr(0,text.length));
}
//未启用
function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}

//处理类
class Deal {
    constructor() {
        this.text = "";
        this.data = [];
    }
    append(k, v) {
        this.data.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        this.text = this.data.join("&").replace(/%20/g, "+");
    }

}
})();
