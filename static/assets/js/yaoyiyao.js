//先判断设备是否支持HTML5摇一摇功能
if(window.DeviceMotionEvent){
    alert("支持支持！")
    document.addEventListener('devicemotion', deviceMotionHandler, false)
} else{
    alert('您好，你目前所用的设置好像不支持重力感应哦！');
}
//设置临界值,这个值可根据自己的需求进行设定，默认就3000也差不多了
let shakeThreshold = 20;
//设置最后更新时间，用于对比
let lastUpdate = 0;
//设置位置速率
let curShakeX=0;
let curShakeY=0;
let curShakeZ=0;
let lastShakeX=0;
let lastShakeY=0;
let lastShakeZ=0;
function deviceMotionHandler(event){
    //获得重力加速
    let acceleration =event.accelerationIncludingGravity;
    //获得当前时间戳
    let curTime = new Date().getTime();
    if ((curTime - lastUpdate)> 100) {
        //时间差
        let diffTime = curTime -lastUpdate;
        lastUpdate = curTime;
        //x轴加速度
        curShakeX = acceleration.x;
        //y轴加速度
        curShakeY = acceleration.y;
        //z轴加速度
        curShakeZ = acceleration.z;
        let speed = Math.abs(curShakeX + curShakeY + curShakeZ - lastShakeX - lastShakeY - lastShakeZ)/ diffTime * 10000;
        if (speed > shakeThreshold) {
            // window.history.back(-1);
            //播放音效
            alert("速度很快了！");
            // shakeAudio.play();
            //商务通传参
            // openswt('移动站通过-手机摇一摇-咨询');
        }
        lastShakeX = curShakeX;
        lastShakeY = curShakeY;
        lastShakeZ = curShakeZ;
    }
}
// //预加摇一摇声音
// var shakeAudio = new Audio();
// //摇一摇声音路径
// shakeAudio.src = '/eg/sound/yyy.wav';
// var shake_options = {
//     preload : 'auto'
// }
// for(var key in shake_options){
//     if(shake_options.hasOwnProperty(key) && (key in shakeAudio)){
//         shakeAudio[key] = shake_options[key];
//     }
// }