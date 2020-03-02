var device = Device.getMain();
var ret = device.getForegroudApp();
if(res == "com.kouzoh.mercari"){
	
}


// 截屏
var device = Device.getMain(); var ret = device.screenshot("C:\\Users\\idear777\\Documents\\Plugin\\mercari\imgs\usermenu.bmp", sigmaConst.IMG_BMP, 839,1626,1049,1761); if(ret == 0){ print("成功获取设备全屏图象"); } else { print("失败获取设备全屏图象"); }