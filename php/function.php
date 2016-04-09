<?php
if(!function_exists('array_column')){
    function array_column($input, $columnKey, $indexKey=null){
        $columnKeyIsNumber      = (is_numeric($columnKey)) ? true : false;
        $indexKeyIsNull         = (is_null($indexKey)) ? true : false;
        $indexKeyIsNumber       = (is_numeric($indexKey)) ? true : false;
        $result                 = array();
        foreach((array)$input as $key=>$row){
            if($columnKeyIsNumber){
                $tmp            = array_slice($row, $columnKey, 1);
                $tmp            = (is_array($tmp) && !empty($tmp)) ? current($tmp) : null;
            }else{
                $tmp            = isset($row[$columnKey]) ? $row[$columnKey] : null;
            }
            if(!$indexKeyIsNull){
                if($indexKeyIsNumber){
                    $key        = array_slice($row, $indexKey, 1);
                    $key        = (is_array($key) && !empty($key)) ? current($key) : null;
                    $key        = is_null($key) ? 0 : $key;
                }else{
                    $key        = isset($row[$indexKey]) ? $row[$indexKey] : 0;
                }
            }
            $result[$key]       = $tmp;
        }
        return $result;
    }
}

//手机/电脑访问WEB
function checkWap() {  
    if (isset($_SERVER['HTTP_VIA'])) return true;  
    if (isset($_SERVER['HTTP_X_NOKIA_CONNECTION_MODE'])) return true;  
    if (isset($_SERVER['HTTP_X_UP_CALLING_LINE_ID'])) return true;  
    if (strpos(strtoupper($_SERVER['HTTP_ACCEPT']),"VND.WAP.WML") > 0) {  
        // Check whether the browser/gateway says it accepts WML.  
        $br = "WML";  
    } else {  
        $browser = isset($_SERVER['HTTP_USER_AGENT']) ? trim($_SERVER['HTTP_USER_AGENT']) : '';  
        if(empty($browser)) return true;
        $mobile_os_list=array('Google Wireless Transcoder','Windows CE','WindowsCE','Symbian','Android','armv6l','armv5','Mobile','CentOS','mowser','AvantGo','Opera Mobi','J2ME/MIDP','Smartphone','Go.Web','Palm','iPAQ');  
              
        $mobile_token_list=array('Profile/MIDP','Configuration/CLDC-','160×160','176×220','240×240','240×320','320×240','UP.Browser','UP.Link','SymbianOS','PalmOS','PocketPC','SonyEricsson','Nokia','BlackBerry','Vodafone','BenQ','Novarra-Vision','Iris','NetFront','HTC_','Xda_','SAMSUNG-SGH','Wapaka','DoCoMo','iPhone','iPod');  
              
        $found_mobile=LLcheckSubstrs($mobile_os_list,$browser) ||  
                  LLcheckSubstrs($mobile_token_list,$browser); 
		if($found_mobile)
			$br ="WML";
		else $br = "WWW";
    }  
    if($br == "WML") {  
        return true;  
    } else {  
        return false;  
    }  
}
function checkSubstrs($list,$str){
	$flag = false;
	for($i=0;$i<count($list);$i++){
		if(strpos($str,$list[$i]) > 0){
			$flag = true;
			break;
		}
	}
	return $flag;
}

//图片裁剪
function cropImg($src,$dst){
	if(!is_file($src)) return null;
	list($width,$height,$type) = getimagesize($src);
	$oldheight = $height-36;
	$new = imagecreatetruecolor($width, $height);
	switch($type){
		case IMAGETYPE_JPEG:
			$old = imagecreatefromjpeg($src);
			break;
		case IMAGETYPE_PNG :
			$old = imagecreatefrompng($src);
			break;
		case IMAGETYPE_GIF :
			$old = imagecreatefromgif($src);
			break;
        default :
            return null;
            break;
	}
	imagecopyresized($new,$old,0,0,0,0,$width,$height,$width,$oldheight);
	switch($type){
		case IMAGETYPE_JPEG:
			$old = imagejpeg($new,$dst);
			break;
		case IMAGETYPE_PNG :
			$old = imagepng($src,$dst);
			break;
		case IMAGETYPE_GIF :
			$old = imagegif($src,$dst);
			break;
	}
	imagedestroy($new);
	imagedestroy($old);
}

function isAjax() {
    if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) ) {
        if('xmlhttprequest' == strtolower($_SERVER['HTTP_X_REQUESTED_WITH']))
           return true;
    }
    if(!empty($_POST[C('VAR_AJAX_SUBMIT')]) || !empty($_GET[C('VAR_AJAX_SUBMIT')]))
        return true;
    return false;
}

//桌面快捷图标
function shortCut($url){
    $Shortcut = "[InternetShortcut] 
    URL=http://www.jb51.net/ 
    IDList= 
    [{000214A0-0000-0000-C000-000000000046}] 
    Prop3=19,2 
    "; 
    Header("Content-type: application/octet-stream"); 
    header("Content-Disposition: attachment; filename=脚本之家.url;"); 
    echo $Shortcut; 
}

function checkAddslashes($str){        
    if(strpos(str_replace("\'",""," $str"),"'")!=false)
        return addslashes($str);
    else
        return $str;
}

function rrmdir($dir) {
    foreach(glob($dir . '/*') as $file) {
        if(is_dir($file))
            rrmdir($file);
        else
            unlink($file);
    }
    rmdir($dir);
}

function my_unserialize($str){
    $data = @unserialize($str);
    if(empty($data)){
        $data = @unserialize(preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'", $str ));
    }
    return $data;
}

function arrayToObject($e){
    if( gettype($e)!='array' ) return;
    foreach($e as $k=>$v){
        if( gettype($v)=='array' || getType($v)=='object' )
            $e[$k]=(object)arrayToObject($v);
    }
    return (object)$e;
}
 
function objectToArray($e){
    $e=(array)$e;
    foreach($e as $k=>$v){
        if( gettype($v)=='resource' ) return;
        if( gettype($v)=='object' || gettype($v)=='array' )
            $e[$k]=(array)objectToArray($v);
    }
    return $e;
}

function is_utf8($string) {
return preg_match('%^(?:
[\x09\x0A\x0D\x20-\x7E] # ASCII
| [\xC2-\xDF][\x80-\xBF] # non-overlong 2-byte
| \xE0[\xA0-\xBF][\x80-\xBF] # excluding overlongs
| [\xE1-\xEC\xEE\xEF][\x80-\xBF]{2} # straight 3-byte
| \xED[\x80-\x9F][\x80-\xBF] # excluding surrogates
| \xF0[\x90-\xBF][\x80-\xBF]{2} # planes 1-3
| [\xF1-\xF3][\x80-\xBF]{3} # planes 4-15
| \xF4[\x80-\x8F][\x80-\xBF]{2} # plane 16
)*$%xs', $string);
}

//数据检查
function filter_str($str) {
    return filter_var($str,FILTER_SANITIZE_STRING,FILTER_FLAG_NO_ENCODE_QUOTES);
}
function filter_int($str) {
    return filter_var($str,FILTER_VALIDATE_INT);
}
function filter_email($str) {
    return filter_var($str,FILTER_VALIDATE_EMAIL);
}
function filter_url($str) {
    return filter_var($str,FILTER_VALIDATE_URL);
}
function filter_float($str) {
    return filter_var($str,FILTER_VALIDATE_FLOAT);
}

//指定时间
function getWeekDay($date='',$weekday=1,$format='Y-m-d') {
    $time = strtotime($date);
    $time = ($time=='') ? time() : $time;
    return date($format, $time-86400*(date('N',$time)-$weekday));
}
//乱码
mb_convert_encoding($content, 'Windows-1252','UTF-8');
?>