var device = Device.getMain();
var ret = device.getForegroundApp();

// 截屏
// var usermenu = "C:\\Users\\idear777\\Documents\\Plugin\\usermenu.bmp";
// var usermenu2 = "C:\\Users\\idear777\\Documents\\Plugin\\usermenu2.bmp";
// var buys = "C:\\Users\\idear777\\Documents\\Plugin\\buys.bmp";
// var send = "C:\\Users\\idear777\\Documents\\Plugin\\send.bmp";

// C:\Users\idear_0121\Documents\mercari
var usermenu = "C:\\Users\\idear_0121\\Documents\\Plugin\\usermenu.bmp";
var usermenu2 = "C:\\Users\\idear_0121\\Documents\\Plugin\\usermenu2.bmp";
var buys = "C:\\Users\\idear_0121\\Documents\\Plugin\\buys.bmp";
var send = "C:\\Users\\idear_0121\\Documents\\Plugin\\send.bmp";
var psend = "C:\\Users\\idear_0121\\Documents\\Plugin\\psend.bmp";
var iexpno = "C:\\Users\\idear_0121\\Documents\\Plugin\\iexpno.bmp";
var font = "C:\\Users\\idear_0121\\Documents\\Plugin\\jpn.traineddata";

var ret = device.uploadTessData("E:\\mytest\\产品20180611\\orc\\chi_sim.traineddata"); 
if(!ret){
	print("字库上传失败");
}

var apppkg = "com.kouzoh.mercari";

// 个人中心菜单
// var ret = device.screenshot("C:\\Users\\idear777\\Documents\\Plugin\\usermenu.bmp", sigmaConst.IMG_BMP, 839,1626,1049,1761); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 购买列表菜单
// var ret = device.screenshot("C:\\Users\\idear777\\Documents\\Plugin\\buys.bmp", sigmaConst.IMG_BMP, 40,1418,349,1476); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 发货状态
// var ret = device.screenshot(send, sigmaConst.IMG_BMP, 260,1233,514,1277); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 配送
// var ret = device.screenshot(psend, sigmaConst.IMG_BMP, 40,997,220,1034); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
// 物流单号
// var ret = device.screenshot(iexpno, sigmaConst.IMG_BMP, 240,1520,480,1570); if(ret == 0){ print("成功获取设备全屏图象"); } else { print(lastError()); }
//1800 460
if(ret == apppkg){
	var ret = device.seekImage(usermenu2);
	if(ret == null){
		print("未找到菜单");
	}else{
		if(ret.rect){
			var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
			print("Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
		}else{
			print("Image found, Center x: " + ret.x + ", Center y: " + ret.y );
		}
		ret = device.click(ret.x,ret.y);
		if(ret != 0){
			print("菜单点击失败"+lastError());
		}
	}
	//判断是否激活状态
	ret = device.seekImage(usermenu);
	if(ret == null){
		print("菜单未激活");
	}else{
		ret = device.seekImage(buys);
		if(ret == null){
			print("未找到购买菜单");
		}else{
			if(ret.rect){
				var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
				print("buys Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
			}else{
				print("buys Image found, Center x: " + ret.x + ", Center y: " + ret.y );
			}
			ret = device.click(ret.x,ret.y);
			if(ret != 0){
				print("购买菜单点击失败"+lastError());
			}
		}
	}
	//购买列表
	if(ret == 0){
		delay(2000);
		var ret = device.screenshotToMemory("@0");
		if(ret == 0){
			print('循环识别购买列表');
			var offset = 0, i = 0, offset2 = 0;
			while(i<6){
				offset = 460+(i*224);
				offset2 = 460+(i*224)+224;
				print('查找坐标10,'+offset+',1070,'+offset2);
				ret = device.seekImage("@0", 10,offset,1070,offset2, send);
				if(ret == null){
					print('未匹配');
				}else{
					if(ret.rect){
						var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
						print("send Image found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
					}else{
						print("send Image found, Center x: " + ret.x + ", Center y: " + ret.y );
					}
					print("X:"+(ret.x-215)+"Y:"+(ret.y-460));
					// ret = device.click(ret.x,ret.y);
					// if(ret != 0){
					// 	print('进入详情页失败'+lastError());					
					// }else{
					// 	ret = device.waitForImage(psend, 1.0, 5000);
					// 	if(ret == null){
					// 		print("未找到发货信息后退"+lastError());
					// 		device.send(tcConst.KEY_BACK);
					// 	}else{
					// 		print("查找物流信息");
					// 		ret = device.seekImage(iexpno);
					// 		if(ret == null){
					// 			print("未找到物流信息"+lastError());
					// 		}else{
					// 			if(ret.rect){
					// 				var arr=[ret.rect[0],ret.rect[1],ret.rect[2],ret.rect[3]];
					// 				print("expno found, Center x: " + ret.x + ", Center y: " + ret.y + ", rect: " + JSON.stringify(arr));
					// 			}else{
					// 				print("expno found, Center x: " + ret.x + ", Center y: " + ret.y );
					// 			}
					// 		}
					// 	}
					// }
				}
				i++;
			}
		}else{
			print(lastError());
		}
	}
}else{
	print("未打开应用"+ret)
}


