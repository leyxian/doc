var device = Device.getMain();
var ret = device.getForegroundApp();

// 截屏
// var usermenu = "C:\\Users\\idear777\\Documents\\Plugin\\usermenu.bmp";
// var usermenu2 = "C:\\Users\\idear777\\Documents\\Plugin\\usermenu2.bmp";
// var buys = "C:\\Users\\idear777\\Documents\\Plugin\\buys.bmp";

// C:\Users\idear_0121\Documents\mercari
var usermenu = "C:\\Users\\idear_0121\\Documents\\Plugin\\usermenu.bmp";
var usermenu2 = "C:\\Users\\idear_0121\\Documents\\Plugin\\usermenu2.bmp";
var buys = "C:\\Users\\idear_0121\\Documents\\Plugin\\buys.bmp";
var send = "C:\\Users\\idear_0121\\Documents\\Plugin\\send.bmp";

var apppkg = "com.kouzoh.mercari";

// 个人中心菜单
// var ret = device.screenshot("C:\\Users\\idear777\\Documents\\Plugin\\usermenu.bmp", sigmaConst.IMG_BMP, 839,1626,1049,1761); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 购买列表菜单
// var ret = device.screenshot("C:\\Users\\idear777\\Documents\\Plugin\\buys.bmp", sigmaConst.IMG_BMP, 40,1418,349,1476); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 发货状态
var ret = device.screenshot(send, sigmaConst.IMG_BMP, 260,1233,514,1277); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }

//1800 460
if(ret == apppkg){
	var ret = device.seekImage(usermenu2);
	if(ret == null){
		print("未找到菜单"+lastError());
	}else{
		if(ret.rect){
			var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
			print("Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
		}else{
			print("Image found, Center x: " + ret.x + ", Center y: " + ret.y );
		}
		var ret = device.click(ret.x,ret.y);
		if(ret != 0){
			print("菜单点击失败"+lastError());
		}
	}
	//判断是否激活状态
	var ret = device.seekImage(usermenu);
	if(ret == null){
		print("菜单未激活"+lastError());
	}else{
		var ret = device.seekImage(buys);
		if(ret == null){
			print("未找到购买菜单"+lastError());
		}else{
			var ret = device.click(ret.x,ret.y);
			if(ret != 0){
				print("购买菜单点击失败"+lastError());
			}
		}
	}
	//购买列表
	if(ret == 0){
		print('识别购买列表');
		var page = 1,offset = 0;
		for (var i = 0; i < 6; i++) {
			offset = 460+(i*224);
			var ret = device.seekImage(0,offset,1076,offset);
			if(ret == null){
				print(page+'页'+i+'行未匹配');
			}else{
				var ret = device.click(ret.x,ret.y);
				if(ret != 0){
					print('进入详情页失败');
				}
			}
			if(ret == 0){
				print('详情页');
			}
		}
	}
}else{
	print("未打开应用"+ret)
}


