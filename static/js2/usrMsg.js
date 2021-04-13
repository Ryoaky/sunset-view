$(function(){
    initPage();
    $("#mod-imfo").on("click", function () {
        modImfo();
    });
});



function modImfo(uid){
    var userName = $("#userName").text();
    var userPhone = $("#userPhone").text();
    var contact = $("#contact").text();
    var contactPhone = $("#contactPhone").text();
    var data = {
        "uid":1,
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
            console.log("请求出错");
            console.log(e);
        }
    });
}


function personal(uid){
    // 个人信息

    data = {
        "uid":1
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
            console.log("请求出错");
            console.log(e);
        }
    });
};


function initPage(){
    personal();
}