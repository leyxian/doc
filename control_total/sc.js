var device = Device.getMain(); var ret=device.scroll(500, 700, 0, 500); if(ret) { print("滑动操作成功"); } else { print("滑动操作失败。其错误为："+lastError()); } 

var device = Device.getMain(); var ret = device.getForegroundApp(); print(ret);

var device = Device.getMain();
var ret = device.openActivity("com.kouzoh.mercari/com.tencent.qqmusic.activity.AppStarterActivity",false);
if(ret == true){
    print("成功打开指定的activity");
} else {
    print("打开指定的activity失败"+lastError());
}

var device = Device.getMain();
var runapp=device.runApp("com.kouzoh.mercari");
if (runapp == 0){
    print("成功打开");   
} else{
    print(lastError());
}

var device = Device.getMain();
var ret = device.shift(tcConst.KEY_UP);
if(ret == 0) {
    print("Successful sliding");
} else {
    print(lastError());
}

var device = Device.getMain(); 
var ret = device.screenshot("C:\\Users\\idear_0121\\Documents\\Plugin\\send.bmp", sigmaConst.IMG_BMP, 270,800,490,840); 
if(ret == 0){ print("成功获取设备图象"); } 
else { print(lastError()); }

var device = Device.getMain();
var psend = "C:\\Users\\idear_0121\\Documents\\Plugin\\psend.bmp";
var ret = device.screenshot(psend, sigmaConst.IMG_BMP, 40,997,220,1034); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }

var device = Device.getMain();
var iexpno = "C:\\Users\\idear_0121\\Documents\\Plugin\\iexpno.bmp";
var ret = device.screenshot(psend, sigmaConst.IMG_BMP, 240,1520,480,1570); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }

var device = Device.getMain();
var send = "C:\\Users\\idear_0121\\Documents\\Plugin\\send.bmp";
var ret = device.seekImage(send);
if(ret.rect){
	var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
	print("Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
}else{
	print("Image found, Center x: " + ret.x + ", Center y: " + ret.y );
}

var device = Device.getMain();
var res=device.width;
print("设备屏幕分辨率宽度: "+res);

var device = Device.getMain();
var send = "C:\\Users\\idear_0121\\Documents\\Plugin\\send.bmp";
ret = device.seekImage(260,460,440,684, send);
if(ret==null){
	print('未匹配');
}else{
	if(ret.rect){
		var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
		print("send Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
	}else{
		print("send Image found, Center x: " + ret.x + ", Center y: " + ret.y );
	}
}

var device = Device.getMain(); 
if(ret==true){
	var text = device.analyzeText(260,460,515,684,"jpn", "singleline");
	print("获取到的文字是 : " + text);
}else{
	print("字库上传失败"+lastError());
}

var device = Device.getMain();
var res = device.loginBaiduCloud('1qlttBjp8YBGdsF4G68WwxwG', 'sneSSAEsMxaCkBHviVd0fy9B0DQLLGBv');
if (res == false) {
    print(lastError());
} else {
	res = device.getTextByBaiduCloudOnAndroid();
    print("获取到的文字:\n"+res);
}

var device = Device.getMain();
var ret =device.rmDir("/sdcard/Total Control/tesseract/tessdata/jpn.traineddatadoes");
if(ret == 0) {
    print("成功删除指定文件夹"); 
} else {
    print(lastError());
}