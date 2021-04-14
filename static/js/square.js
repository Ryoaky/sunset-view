// var serverAddress = "http://121.4.195.196:8080";
var serverAddress = "https://www.clearwing.top:8080"


var localStorage = window.localStorage
var sessionStorage = window.sessionStorage

var userLocation;  //地点String
var userName;
// var postItem;
// var joinItem;
var recorder;
var uid;


$(function(){
    // getLocation();
    recorder = new Recorder({
        sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
        bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
        success: function () { //成功回调函数
            $(".start").each(function(index,item){
                this.disabled = false;
            });
            
        },
        error: function (msg) { //失败回调函数
            alert(msg);
        },
        fix: function (msg) { //不支持H5录音回调函数
            alert(msg);
        }
    });
    initpage();
})

function bindEvent(){
    $('#btn-crt-atvt').on('click', function (e) {
        $('#crt-atvt').show();
        $('#mask').show();
        $("#mask").one("click", function (e) {
            $("#crt-atvt").hide();
            $("#mask").hide();
            return false;
        });
    });

    $("#btn-crt-help").on("click", function () {
        $("#crt-help").show();
        $('#mask').show();
        $("#mask").one("click", function (e) {
            $("#crt-help").hide();
            $("#mask").hide();
            return false;
        });
    });

    $("#btn-mod-imfo").on("click", function () {
        modImfo();
    });

    $("#tap-help").on('click', function () {
        $($("#btn-crt-help").siblings("button")).hide();
        $('#btn-crt-help').show();
        $('#section-help,.filter').show();
        $($("#section-help").siblings(".section")).hide();
    });

    $("#tap-atvt").on('click', function () {
        $($("#btn-crt-atvt").siblings("button")).hide();
        $('#btn-crt-atvt').show();
        $($("#section-atvt,.filter").siblings(".section")).hide();
        $('#section-atvt').show();
    });

    $("body").on('click',".btn-atvt-join", function () {
        $(this).hide();
        $($(this).next()).show();
        var aid = $($(this).parent().parent()).attr("id");
        console.log(aid);
        oprAtvt(aid);
    });

    $("body").on('click',".btn-atvt-finish", function () {
        $(this).hide();
        $($(this).prev()).show();
        var aid = $($(this).parent().parent()).attr("id");
        console.log(aid);
        oprAtvt(aid);
    });


    $("body").on('click',".btn-help-join", function () {
        $(this).hide();
        $($(this).next()).show();
        var hid = $($(this).parent().parent()).attr("id");
        console.log(hid);
        oprHelp(hid);
    });

    $("body").on('click', ".btn-help-finish", function () {
        $(this).hide();
        $($(this).prev()).show();
        var hid = $($(this).parent().parent()).attr("id");
        console.log(hid);
        oprHelp(hid);
    });
    $(".start").on("click", function () {
        this.disabled = true;
        // console.log($(this).next()[0].disabled)
        $(this).next()[0].disabled = false;
        var audio = document.querySelectorAll('audio');
        for(var i = 0; i < audio.length; i++){
            if(!audio[i].paused){
                audio[i].pause();
            }
        }
        recorder.start();
    });
    $(".stop").on("click", function () {
        this.disabled = true;
        $(this).prev()[0].disabled = false;
        // start.disabled = false;
        recorder.stop();
    });

    $("#send_activity").on("click", function () {
        postAtvt(recorder);
    });

    $("#send_help").on("click", function () {
        postHelp(recorder);
    });

    
    $("#person").on("click", function () {
        $("#section-stats").show();
        $($("#section-stats").siblings(".section,.filter")).hide();
        $("#btn-mod-imfo").show();
        $($("#btn-mod-imfo").siblings("button")).hide();
        $($("#person").siblings('li')).one("click", function () {
            $("#section-stats").hide();
            $(".filter").show();
            $("#btn-crt-atvt").show();
            $($("#btn-crt-atvt").siblings("button")).hide();
        });
    });
    
    $("#stage").on("click", function () {
        $('#section-atvt,#section-help').empty();
        getNearAtvt();
        getNearHelp();
        $("#section-atvt").show();
        $($("#section-atvt").siblings(".section")).hide();
    });

    $("#joined").on('click', function () {
        $('#section-atvt,#section-help').empty();
        getJoinedAtvt();
        getJoinedHelp();
        $("#section-atvt").show();
        $($("#section-atvt").siblings(".section")).hide();
        });

    $("#posted").on('click', function () {
        $('#section-atvt,#section-help').empty();
        getPostedAtvt();
        getPostedHelp();
        $("#section-atvt").show();
        $($("#section-atvt").siblings(".section")).hide();
    });

    $("#btn-search").on("click", function () {
        search();
    });
 
    $("#index").on("click", function () {
        window.location = serverAddress + "/index"
    });

    $("#logout").on("click", function () {
        window.location = serverAddress + "/login"
    });
};



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            onSuccess(position);
        } , onError,{enableHighAccuracy: true, timeout:5000, maximumAge:7200000});
    }else{
        alert("您的浏览器不支持使用HTML 5来获取地理位置服务");
    }
    //定位数据获取成功响应
    function  onSuccess(position){
        lat= position.coords.latitude;
        ing = position.coords.longitude;
        var data={
            "lat":lat,
            "ing":ing
        };
        
        $.ajax({
            type: "get",
            url: serverAddress +"/setLoc.do",
            data: data,
            dateType:'json',
            async: false,
            success: function (response) {
                console.log("------定位信息-------")
                console.log(data);
                userLocation = response;
                getNearAtvt();
                getNearHelp();
                alert("您当前位置为："+userLocation);
                console.log(userLocation); 
            },
            error: function(e){
                console.log("定位信息获取失败.....")
            }
        });
    }
    //定位数据获取失败响应
    function onError(error) {
        
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                // alert("您拒绝对获取地理位置的请求");
                break;
            case error.POSITION_UNAVAILABLE:
                // alert("位置信息是不可用的");
                break;
            case error.TIMEOUT:
                // alert("请求您的地理位置超时");
                break;
            case error.UNKNOWN_ERROR:
                // alert("未知错误");
                break;
        }
        $.ajax({
            type: "get",
            url: serverAddress +"/historyLoc.do",
            data: data,
            dateType:'json',
            async: false,
            success: function (response) {
                console.log("------定位信息-------")
                console.log(data);;
                userLocation = response;
                getNearAtvt();
                getNearHelp();
                alert("您当前位置为："+userLocation);
                console.log(userLocation);
            },
            error: function(e){
                console.log("出错了!!!!!!!!")
                console.log(e);
            }
        });
    };    
};


function getRightSide(){
    //右边栏
    data = {
    };
    $.ajax({
        type: "post",
        url: serverAddress + "/usrhistory.do",
        data: data,
        dataType: 'json',
        success: function(response){
            if(response){
                uid=response.uid
                console.log("------右侧栏获取成功-------")
                content1='<div>\
                              <p>' + response.userName + '</p>\
                              <span>自 ' + response.regiYear + '</span>\
                          </div>';
                content2='<h3>在<strong> ' + response.year + ' </strong>你已经<br/>参加活动\
                        <strong> <span>' + response.activityJoined + '</span> </strong>次</h3>\
                        <h3>发布活动 <strong> <span>' + response.activityPosted + '</span> </strong>次</h3>\
                        <h3>发布帮助 <strong> <span> ' + response.helpPosted + '</span> </strong>次</h3>';
                $("#profileUserInfo").append(content1);
                $("#profileRecord").append(content2);
            }
        },
        error: function(e){
            console.log("用户记录获取失败......")
        }
    });
};




function getNearAtvt(){
    //获取活动，返回给该用户附近的活动
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    
    var data={
        "location": userLocation
    };
    $.ajax({
        type: "post",
        url: serverAddress +"/square/nearActi.do",
        data: data,
        dateType:'json',
        success: function (response) {
            console.log("-----附近活动获取成功-------");
            console.log(response);
            // <div id="1" class="item-wrap" style="background-color:#F1CECD;"> <img
            //             src="https://www.clearwing.top:8080/img/SunsetMulti/sunsetRedPic/4a472bb1-ee6a-4eb5-9a0a-46b92edc25e0.jpg"
            //             alt="pick">
            //         <div class="item-imfo">
            //             <p>名称: <span class="atvt-name">硬汉不走步</span></p>
            //             <p>时间: <span class="atvt-start">2021-03-08 11:13</span>~<span class="atvt-end">2021-03-16
            //                     11:00</span></p>
            //             <p>地点: <span class="atvt-lctn">广东省广州市番禺区大学城星海东路</span></p>
            //             <p>所需人数|已有人数: <span class="atvt-req">9|2</span></p>
            //             <p>播放录音: <span class="atvt-play"></span><a
            //                     href="https://www.clearwing.top:8080/audio/SunsetMulti/sunsetRedAudio/85e90b83-2599-4f57-b3ed-731d0cd1cdf4.mp3"><svg
            //                         t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1"
            //                         xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17">
            //                         <path
            //                             d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z"
            //                             fill="" p-id="1161"></path>
            //                         <path
            //                             d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z"
            //                             fill="" p-id="1162"></path>
            //                     </svg></a></p>
            //             <p>具体信息: <span class="atvt-imfo">老兄们，明天球场组三个队吧！</span></p>
            //             <div class="op-item">
            //                 <div class="btn-group">
            //                     <button class="btn-atvt-join">参加活动</button>
            //                     <button class="btn-atvt-finish">结束活动</button>
            //                 </div>
            //                 <div class="join-list">
            //                     <div class="show-joiner"><i class="fas fa-user"></i></div>
            //                     <div class="triangle"></div>
            //                     <div class="joiner-imfo">
            //                         <h4>参与者</h4>
            //                         <p>顺数据来看</p>
            //                         <p>我喜欢睡觉</p>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            for(var i = 0; i<response.length; i++){
                if(response[i].isPoster>0){
                    content='<div id="'+ response[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                                <img src="'+ serverAddress + response[i].pic +'" alt="pick">\
                                <div class="item-imfo">\
                                    <p>名称: <span class="atvt-name">'+ response[i].actiObject.name +'</span></p>\
                                    <p>时间: <span class="atvt-start">'+ response[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response[i].endTimeFormed +'</span></p>\
                                    <p>地点: <span class="atvt-lctn">'+ response[i].actiObject.location +'</span></p>\
                                    <p>所需人数|已有人数:: <span class="atvt-req">'+ response[i].needNum+'|'+response[i].peopleNum +'</span></p>\
                                    <p>播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                    <p>具体信息: <span class="atvt-imfo">'+ response[i].actiObject.intro +'</span></p>\
                                    <div class="op-item">\
                                        <div class="btn-group">\
                                            <button class="btn-atvt-finish">撤销活动</button>\
                                        </div>\
                                        <div class="join-list">\
                                            <div class="show-joiner"><i class="fas fa-user"></i></div>\
                                            <div class="triangle"></div>\
                                            <div class="joiner-imfo">\
                                                <h4>参与者</h4>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                    $("#section-atvt").append(content);
                }else if(response[i].isPoster<=0&&response[i].hasJoined>0){
                    content='<div id="'+ response[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                                <img src="'+ serverAddress + response[i].pic +'" alt="pick">\
                                <div class="item-imfo">\
                                    <p>名称: <span class="atvt-name">'+ response[i].actiObject.name +'</span></p>\
                                    <p>时间: <span class="atvt-start">'+ response[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response[i].endTimeFormed +'</span></p>\
                                    <p>地点: <span class="atvt-lctn">'+ response[i].actiObject.location +'</span></p>\
                                    <p>所需人数|已有人数:: <span class="atvt-req">'+ response[i].needNum+'|'+response[i].peopleNum +'</span></p>\
                                    <p>播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                    <p>具体信息: <span class="atvt-imfo">'+ response[i].actiObject.intro +'</span></p>\
                                    <div class="op-item">\
                                        <div class="btn-group">\
                                            <button class="btn-atvt-join">参加活动</button>\
                                            <button class="btn-atvt-finish">退出活动</button>\
                                        </div>\
                                        <div class="join-list">\
                                            <div class="show-joiner"><i class="fas fa-user"></i></div>\
                                            <div class="triangle"></div>\
                                            <div class="joiner-imfo">\
                                                <h4>参与者</h4>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                        $("#section-atvt").append(content);
                }else{
                    content='<div id="'+ response[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                                <img src="'+ serverAddress + response[i].pic +'" alt="pick">\
                                <div class="item-imfo">\
                                    <p>名称: <span class="atvt-name">'+ response[i].actiObject.name +'</span></p>\
                                    <p>时间: <span class="atvt-start">'+ response[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response[i].endTimeFormed +'</span></p>\
                                    <p>地点: <span class="atvt-lctn">'+ response[i].actiObject.location +'</span></p>\
                                    <p>所需人数|已有人数:: <span class="atvt-req">'+ response[i].needNum+'|'+response[i].peopleNum +'</span></p>\
                                    <p>播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                    <p>具体信息: <span class="atvt-imfo">'+ response[i].actiObject.intro +'</span></p>\
                                    <div class="op-item">\
                                        <div class="btn-group">\
                                            <button class="btn-atvt-join">参加活动</button>\
                                            <button class="btn-atvt-finish">结束活动</button>\
                                        </div>\
                                        <div class="join-list">\
                                            <div class="show-joiner"><i class="fas fa-user"></i></div>\
                                            <div class="triangle"></div>\
                                            <div class="joiner-imfo">\
                                                <h4>参与者</h4>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
                        $("#section-atvt").append(content);
                }
                for(var j = 0; j<response[i].joinerNames.length; i++){
                    $("#"+response[i].actiObject.aid).append(response[i].joinerNames[i]);
                }
            }
        },
        error: function(e){
            console.log("附近活动获取失败......")
        }
    });
};

function getNearHelp(){
    //获取帮助，返回该用户附近的帮助    
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    data = {
        "location":userLocation
    };
    $.ajax({
        url: serverAddress + "/square/nearHelp.do",
        type: "post",
        data: data,
        dateType: "json",
        success: function(response){
            console.log(response);
            console.log("-----附近帮助获取成功-------");
            for(var i = 0;i<response.length;i++){
                if(response[i].isPoster>0){
                    content='<div id="'+ response[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ response[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="help-name">'+ response[i].helpObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="help-start">'+ response[i].timeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="help-lctn">'+ response[i].helpObject.location +'</span></p>\
                                <p class="font-medium">已有人数: <span class="ahelp-lctn">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response[i].helpObject.introduce +'</span></p>\
                                <button class="btn-help-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">撤销帮助</button>\
                            </div>\
                        </div>'
                    $("#section-help").append(content);
                }else if(response[i].isPoster<=0&&response[i].hasJoined>0){
                    content='<div id="'+ response[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ response[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="help-name">'+ response[i].helpObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="help-start">'+ response[i].timeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="help-lctn">'+ response[i].helpObject.location +'</span></p>\
                                <p class="font-medium">已有人数: <span class="ahelp-lctn">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response[i].helpObject.introduce +'</span></p>\
                                <button class="btn-help-join hidden shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">参加帮助</button>\
                                <button class="btn-help-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">退出帮助</button>\
                            </div>\
                        </div>'
                    $("#section-help").append(content);
                }else{
                    content='<div id="'+ response[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ response[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="help-name">'+ response[i].helpObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="help-start">'+ response[i].timeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="help-lctn">'+ response[i].helpObject.location +'</span></p>\
                                <p class="font-medium">已有人数: <span class="ahelp-lctn">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response[i].helpObject.introduce +'</span></p>\
                                <button class="btn-help-join shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">参加帮助</button>\
                                <button class="btn-help-finish hidden shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">结束帮助</button>\
                            </div>\
                        </div>'
                    $("#section-help").append(content);
                }  
            }   
        },
        error: function(e){
            console.log("附近帮助获取失败......");
        }
    });
};


function getPostedAtvt(){
    //获取活动，返回给该用户附近的活动
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    
    var data={
        "location": userLocation
    };
    $.ajax({
        type: "post",
        url: serverAddress +"/square/nearActi.do",
        data: data,
        dateType:'json',
        success: function (response) {
            console.log("-----成功获取已发布的活动-------");
            //遍历返回数据，将活动逐个添加到活动栏
            console.log(response);
            for(var i = 0; i<response.length; i++){
                if(response[i].isPoster>0){
                    content='<div id="'+ response[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ serverAddress + response[i].pic +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="atvt-name">'+ response[i].actiObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="atvt-start">'+ response[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response[i].endTimeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="atvt-lctn">'+ response[i].actiObject.location +'</span></p>\
                                <p class="font-medium">所需人数: <span class="atvt-req">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="atvt-imfo">'+ response[i].actiObject.intro +'</span></p>\
                                <button class="btn-atvt-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">撤销活动</button>\
                            </div>\
                        </div>'
                    $("#section-atvt").append(content);
                }
            }
        },
        error: function(e){
            console.log("已发布的活动获取失败......")
        }
    });
};

function getPostedHelp(){
    //获取帮助，返回该用户附近的帮助    
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    data = {
        "location":userLocation
    };
    $.ajax({
        url: serverAddress + "/square/nearHelp.do",
        type: "post",
        data: data,
        dateType: "json",
        success: function(response){
            console.log("-----成功获取已发布的帮助-------");
            console.log(response);
            for(var i = 0;i<response.length;i++){
                if(response[i].isPoster>0){
                    content='<div id="'+ response[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ response[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="help-name">'+ response[i].helpObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="help-start">'+ response[i].timeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="help-lctn">'+ response[i].helpObject.location +'</span></p>\
                                <p class="font-medium">已有人数: <span class="ahelp-lctn">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response[i].helpObject.introduce +'</span></p>\
                                <button class="btn-help-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">撤销活动</button>\
                            </div>\
                        </div>'
                    $("#section-help").append(content);
                }
            }   
        },
        error: function(e){
            console.log("已发布的帮助获取失败......");
        }
    });
};

function getJoinedAtvt(){
    //获取活动，返回给该用户附近的活动
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    
    var data={
        "location": userLocation
    };
    $.ajax({
        type: "post",
        url: serverAddress +"/square/nearActi.do",
        data: data,
        dateType:'json',
        success: function (response) {
            console.log("-----成功获取已参加的活动-------");
            //遍历返回数据，将活动逐个添加到活动栏
            console.log(response);
            for(var i = 0; i<response.length; i++){
                if(response[i].hasJoined>0){
                    content='<div id="'+ response[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ serverAddress + response[i].pic +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="atvt-name">'+ response[i].actiObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="atvt-start">'+ response[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response[i].endTimeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="atvt-lctn">'+ response[i].actiObject.location +'</span></p>\
                                <p class="font-medium">所需人数|已有人数: <span class="atvt-req">'+ response[i].needNum+'|'+response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="atvt-imfo">'+ response[i].actiObject.intro +'</span></p>\
                                <button class="btn-atvt-join hidden shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">参加活动</button>\
                                <button class="btn-atvt-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">退出活动</button>\
                            </div>\
                        </div>'
                    $("#section-atvt").append(content);
                }
            }
        },
        error: function(e){
            console.log("已参加的活动获取失败......")
        }
    });
};

function getJoinedHelp(){
    //获取帮助，返回该用户附近的帮助    
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']
    data = {
        "location":userLocation
    };
    $.ajax({
        url: serverAddress + "/square/nearHelp.do",
        type: "post",
        data: data,
        dateType: "json",
        success: function(response){
            console.log("-----成功获取已参加的帮助-------");
            console.log(response);
            for(var i = 0;i<response.length;i++){
                if(response[i].hasJoined>0){
                    content='<div id="'+ response[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                            <img src="'+ response[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                            <div class="item-imfo">\
                                <p class="font-medium">名称: <span class="help-name">'+ response[i].helpObject.name +'</span></p>\
                                <p class="font-medium">时间: <span class="help-start">'+ response[i].timeFormed +'</span></p>\
                                <p class="font-medium">地点: <span class="help-lctn">'+ response[i].helpObject.location +'</span></p>\
                                <p class="font-medium">已有人数: <span class="help-lctn">'+ response[i].peopleNum +'</span></p>\
                                <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response[i].helpObject.introduce +'</span></p>\
                                <button class="btn-help-join hidden shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">参加活动</button>\
                                <button class="btn-help-finish shadow-md mt-3 bg-grey-lightest hover:bg-white text-indigo-darker text-xs py-2 px-4 rounded-full transition-normal hover:shadow hover:translate-y-1 active:translate-y-1 focus:outline-none">退出帮助</button>\
                            </div>\
                        </div>'
                    $("#section-help").append(content);
                }  
            }   
        },
        error: function(e){
            console.log("已参加的帮助获取失败......");
        }
    });
};


function oprAtvt(aid){
    data = {
        "aid":aid
    };
    $.ajax({
        type: "post",
        url: serverAddress +"/square/operActi.do",
        data: data,
        dateType:'json',
        success: function (response) {
            console.log(response);
        },
        error: function(e){
            console.log("操作活动失败......")
        }
    });

}

function oprHelp(hid){
    data = {
        "hid":hid
    };
    $.ajax({
        type: "post",
        url: serverAddress +"/square/operHelp.do",
        data: data,
        dateType:'json',
        success: function (response) {
            console.log(response);
        },
        error: function(e){
            console.log("操作帮助失败......")
        }
    });

}

//发布帮助的函数
function postHelp(){
    recorder.getBlob(function(blob){
        //创建临时url进行后续播放
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        au.controls = true;
        au.src = url;

        //创建一个空对象
        // var atvtName = document.getElementsByName("atvt-name");
        var formData = new FormData(document.querySelector("#helpform"));//获取form值
        // var formData = new FormData();
        formData.append("audio", blob);
        formData.append("uid", uid);
        formData.append("location", userLocation);

        // console.log(formData.get("uid"));
        // console.log(formData.get("name"));
        // console.log(formData.get("type"));
        // console.log(formData.get("picture"));
        // console.log(formData.get("startTime"));
        // console.log(formData.get("endTime"));
        // console.log(formData.get("needNum"));
        // console.log(formData.get("intro"));

        $.ajax({
            url: serverAddress + '/square/postHelp.do', // 存储音频接口
            type: 'POST',
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            beforeSend: function () {
                console.log("正在进行，请稍候");
            },
            success: function (responseStr) {
                console.log("成功" + responseStr);
                $("#crt-help, #mask").hide();
                $("#section-help").show();
                $($("#section-help").siblings(".section")).hide();
            },
            error: function (responseStr) {
                console.log("error");
            }
        });
    });

}



//上传音频
function postAtvt(recorder) {
    recorder.getBlob(function(blob){
        //创建临时url进行后续播放
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        au.controls = true;
        au.src = url;

        //创建一个空对象
        // var atvtName = document.getElementsByName("atvt-name");
        var formData = new FormData(document.querySelector("#activityform"));//获取form值
        // var formData = new FormData();
        formData.append("audio", blob);
        formData.append("uid", uid);
        formData.append("location", userLocation);

        // console.log(formData.get("uid"));
        // console.log(formData.get("name"));
        // console.log(formData.get("type"));
        // console.log(formData.get("picture"));
        // console.log(formData.get("startTime"));
        // console.log(formData.get("endTime"));
        // console.log(formData.get("needNum"));
        // console.log(formData.get("intro"));

        $.ajax({
            url: serverAddress + '/square/postActi.do', // 存储音频接口
            type: 'POST',
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            beforeSend: function () {
                console.log("正在进行，请稍候");
            },
            success: function (responseStr) {
                console.log("成功" + responseStr);
                $("#crt-atvt, #mask").hide();
                $("#section-atvt").show();
                $($("#section-atvt").siblings(".section")).hide();
            },
            error: function (responseStr) {
                console.log("error");
            }
        });
    });
}

function modImfo(){
    var userName = $("#userName").text();
    var userPhone = $("#userPhone").text();
    var contact = $("#contact").text();
    var contactPhone = $("#contactPhone").text();
    var data = {
        "uid": uid,
        "name": userName,
        "phone": userPhone,
        "guardianName": contact,
        "guardianPhone": contactPhone
    }
    console.log(data);
    $.ajax({
        url: serverAddress + "/updateUsrMsg.do",
        type: "post",
        data: data,
        dateType: "json",
        success: function(response){
            alert("修改成功");
            console.log(response);
        },
        error: function(e){
            console.log("个人信息修改失败......");
        }
    });
}


function personal(){
    // 个人信息
    data = {
    };
    $.ajax({
        url: serverAddress + "/usrMsg.do",
        type: "post",
        data: data,
        dateType: "json",
        success: function(response){
            console.log(response);
            $("#userName").text(response.user.name);
            $("#userPhone").text(response.user.phone);
            $("#contact").text(response.user.guardianName);
            $("#contactPhone").text(response.user.guardianPhone);
        },
        error: function(e){
            console.log("个人信息获取失败");
        }
    });
};

function search(){
    var bgcolor = ['#FBC164', '#F1CECD','#ECE7E9', '#D0E3E8']

    var str =  $("#search").val();
        data = {
            "name":str
        }
        console.log(data);
        $.ajax({
            type: "post",
            url: serverAddress +"/search.do",
            data: data,
            dateType:'json',
            success: function (response) {
                console.log("------搜索信息-------")
                console.log(response);
                $("#section-atvt").empty();
                $("#section-help").empty();
                if(response.help){
                    for(var i = 0;i<response.help.length;i++){
                            content='<div id="'+ response.help[i].helpObject.hid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                                    <img src="'+ response.help[i].picUrl +'" alt="pick" class="shadow-md w-1/3">\
                                    <div class="item-imfo">\
                                        <p class="font-medium">名称: <span class="help-name">'+ response.help[i].helpObject.name +'</span></p>\
                                        <p class="font-medium">时间: <span class="help-start">'+ response.help[i].timeFormed +'</span></p>\
                                        <p class="font-medium">地点: <span class="help-lctn">'+ response.help[i].helpObject.location +'</span></p>\
                                        <p class="font-medium">已有人数: <span class="ahelp-lctn">'+ response.help[i].peopleNum +'</span></p>\
                                        <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response.help[i].voice +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                        <p class="mt-3 text-sm">具体信息: <span class="help-imfo">'+ response.help[i].helpObject.introduce +'</span></p>\
                                    </div>\
                                </div>'
                            $("#section-help").append(content);
                    }; 
                }
                if(response.acti){
                    for(var i = 0; i<response.acti.length; i++){
                        content='<div id="'+ response.acti[i].actiObject.aid +'" class="item-wrap" style="background-color:'+ bgcolor[i%4] +';">\
                                <img src="'+ serverAddress + response.acti[i].pic +'" alt="pick" class="shadow-md w-1/3">\
                                <div class="item-imfo">\
                                    <p class="font-medium">名称: <span class="atvt-name">'+ response.acti[i].actiObject.name +'</span></p>\
                                    <p class="font-medium">时间: <span class="atvt-start">'+ response.acti[i].startTimeFormed +'</span>~<span class="atvt-end">'+ response.acti[i].endTimeFormed +'</span></p>\
                                    <p class="font-medium">地点: <span class="atvt-lctn">'+ response.acti[i].actiObject.location +'</span></p>\
                                    <p class="font-medium">所需人数|已有人数: <span class="atvt-req">'+ response.acti[i].needNum+'|'+response.acti[i].peopleNum +'</span></p>\
                                    <p class="font-medium">播放录音: <span class="atvt-play"></span><a href="'+serverAddress+response.acti[i].audio +'"><svg t="1614866250411" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" width="17" height="17"><path d="M473.088 125.44L256 256H52.224C23.552 256 0 279.552 0 308.224V716.8c0 28.16 23.04 51.2 51.2 51.2h204.8l217.088 130.56c16.896 10.24 38.912-2.048 38.912-22.016V147.456c0-19.968-21.504-32.256-38.912-22.016zM699.904 320.512c-20.992-18.944-53.248-17.408-72.192 3.584-18.944 20.992-17.408 53.248 3.584 72.192 0.512 0.512 58.368 54.784 58.368 121.344 0 37.888-19.456 74.752-58.368 110.08-20.992 18.944-22.528 51.2-3.584 72.192 10.24 11.264 24.064 16.896 37.888 16.896 12.288 0 24.576-4.608 34.304-13.312 61.44-55.296 92.16-117.76 92.16-185.856 0-112.64-88.576-193.536-92.16-197.12z" fill="" p-id="1161"></path><path d="M853.504 166.4c-20.992-18.944-53.248-16.896-72.192 4.096-18.944 20.992-16.896 53.248 4.096 72.192 1.536 1.024 135.68 122.88 135.68 280.576 0 90.624-45.568 177.152-135.68 257.536-20.992 18.944-23.04 51.2-4.096 72.192 10.24 11.264 24.064 16.896 38.4 16.896 12.288 0 24.576-4.096 34.304-12.8 112.64-100.864 169.984-212.992 169.984-333.824-1.024-202.752-163.84-350.208-170.496-356.864z" fill="" p-id="1162"></path></svg></a></p>\
                                    <p class="mt-3 text-sm">具体信息: <span class="atvt-imfo">'+ response.acti[i].actiObject.intro +'</span></p>\
                                </div>\
                            </div>'
                        $("#section-atvt").append(content);
                    }
                }
            },
            error: function(e){
                console.log("搜索信息获取失败.....")
            }
        });
}


function initpage(){
    uid  = sessionStorage.getItem("uid");
    console.log(uid);
    if(uid){
        console.log("欢迎登陆您的id是: " + uid)
    }else{
        // alert("未登录");
        // window.location = serverAddress+"/login";
    }
    getLocation();
    personal();
    bindEvent();
    getNearAtvt();
    getNearHelp();
    getRightSide();
    
}

