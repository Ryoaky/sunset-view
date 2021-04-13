
/**window.DeviceMotionEvent：判斷浏览器是否支持此时间*/
if (window.DeviceMotionEvent) {
    /**
     * speed：速度，根据摇一摇的动作幅度可以适当增加或减小
     * cx、cy、cz：分别是当前在 x,y,z 3个方向上的加速度
     * lastX、lastY、lastZ：分别是上一次在 x,y,z 3个方向上的加速度
     */
    var speed = 60;
    var cx = cy = cz = lastX = lastY = lastZ = 0;
// alert("支持");
    /**注册devicemotion(设备运动)事件
     * Window.prototype.addEventListener = function(type,listener,useCapture)
     * type：事件类型，如 devicemotion、deviceorientation、compassneedscalibration 等
     * listener：事件触发的回调函数，也可以提取出来单独写
     * useCapture：是否捕获
     * */
    window.addEventListener('devicemotion', function (evenData) {
        /**获取重力加速度
         * x、y、z 三个属性，分别表示 3 个方向上的重力加速度
         * */
        var acceleration = evenData.accelerationIncludingGravity;
        cx = acceleration.x;
        cy = acceleration.y;
        cz = acceleration.z;

        /**只要手机有稍微的抖动，就会进入此回调函数
         * 当某一个方向上的加速度超过 speed 的值时，改变背景色
         */
        if (Math.abs(cx - lastX) > speed || Math.abs(cy - lastY) > speed || Math.abs(cz - lastZ) > speed) {
            // document.body.style.backgroundColor = colorArray[Math.round(Math.random() * 10) % 8];
            // alert("变速度了");
            $.ajax({
                type: "post",
                url: "http://localhost:8080/alarm.do",
                data: data ,
                dateType:'json',
                success: function (response) {
                    if(response){
                        console.log("发送预警信息了");
                    }
                    console.log("有返回，成功调用");
                    console.log(response);
                },
                error: function(e){
                    console.log("出错了!!!!!!!!")
                    console.log(e);
                }
            });
            // window.location.href="login.html";
            /** 将数据打印出来瞧一瞧*/
            // $("#x").append("cx:" + cx + "\r\n");
            // $("#y").append("cy:" + cy + "\r\n");
            // $("#z").append("cz:" + cz + "\r\n");
        }
        lastX = cx;
        lastY = cy;
        lastZ = cz;
    }, true);
} else {
    alert('您的浏览器无法获得加速度.');
}
