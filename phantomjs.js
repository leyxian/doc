<?php 
require_once dirname(dirname(__file__)).'/comm.php';

set_time_limit(600);

use JonnyW\PhantomJs\Client;
use JonnyW\PhantomJs\DependencyInjection\ServiceContainer;
use Medoo\Medoo;

$db = new Medoo(array(
            'database_type' => 'mysql',
            'database_name' => 'wushi',
            'server' => '47.91.19.80',
            'username' => 'huhuhu',
            'password' => '12dercsclrt',
            'charset' => 'utf8',
            'port' => 3306,
            'prefix' => 'ws_',
        ));

$rows = $db->select('surugaya_order_goods', array('[>]surugaya_order'=>array('oid'=>'id')), array('surugaya_order_goods.url', 'surugaya_order_goods.quantity(num)', 'surugaya_order.totalprice', 'surugaya_order_goods.code', 'surugaya_order.uid', 'surugaya_order.id'), array('AND'=>array('surugaya_order.state'=>2, 'surugaya_order.repaystate'=>2, 'surugaya_order.uid[!]'=>3)));

$user_goods = array();
foreach ($rows as $v) {
    $user_goods[$v['uid']][] = $v;
} unset($rows);

$path = ROOT_PATH.'/suruga/logs';

if($user_goods){
    foreach ($user_goods as $uid => $goods) {
        $content = ''; $totalprice = $id = $price = 0; $carts = $carts2 = array();
        $username = 'date_15235ki@yahoo.co.jp';
        $password = '7128916jh';

        $location = dirname(__file__);

        $serviceContainer = ServiceContainer::getInstance();

        $procedureLoader = $serviceContainer->get('procedure_loader_factory')
            ->createProcedureLoader($location);
            
        $client = Client::getInstance();
        $client->getEngine()->setPath(ROOT_PATH.'/bin/phantomjs');
        $client->setProcedure('suruga');
        $client->getProcedureLoader()->addLoader($procedureLoader);

        $request  = $client->getMessageFactory()->createRequest();
        $response = $client->getMessageFactory()->createResponse();

        echo '检查登录'."\r\n";
        $request->setHeaders(array('useragent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'action'=>'checklogin', 'path'=>$path));
        $request->setUrl('https://www.suruga-ya.jp/pcmypage/');
        $request->setViewportSize(1024, 768);
        try{
            $client->send($request, $response);
            if($response->getStatus() === 200){
                $content = $response->getContent();
            }
        }catch(Exception $e){
            echo $e->getMessage();
        }

        if(strpos($content, 'edit-mail')!==false){
            echo '请求登录'."\r\n";
            $request->setHeaders(array('User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'username'=>$username, 'password'=>$password, 'uid'=>2882, 'action'=>'login', 'path'=>$path));
            try{
                $client->send($request, $response);
                if($response->getStatus() === 200){
                    if(strpos($content, 'edit-mail')!==false){
                        echo '登录失败'."\r\n"; die;
                    }else
                        echo '登录成功'."\r\n";
                }else{
                    echo '登录失败'."\r\n";
                }
            }catch(Exception $e){
                echo $e->getMessage();
            }
        }

        echo '加入购物车'."\r\n";
        foreach ($goods as $k => $v) {
            $carts2[$v['code']] = $v['num'];
            $totalprice = $v['totalprice']; $id = $v['id'];
            $request->setUrl($v['url']);
            $request->setHeaders(array('User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'action'=>'addcart', 'num'=>$v['num'], 'index'=>$k, 'price'=>$v['totalprice'], 'path'=>$path));
            try {
                $client->send($request, $response);
                if($response->getStatus()==200){
                    echo '加入购物车'.$k."\r\n";
                }else{
                    echo '商品访问失败'."\r\n";
                }
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }

        echo '查看购物车'."\r\n";
        $url = 'http://www.suruga-ya.jp/cargo/detail';
        $request->setUrl($url);
        $request->setHeaders(array('User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'action'=>'cart', 'path'=>$path));
        try {
            $client->send($request, $response);
            if($response->getStatus()==200){
                $html = new \HtmlParser\ParserDom($response->getContent());
                $items = $html->find('.item');
                foreach ($items as $v) {
                    $dom = $v->find('.item_name a');
                    preg_match('/l\/([\w]+)/', $dom[0]->getAttr('href'), $code);
                    $dom = $v->find('.quantity');
                    $quantity = intval($dom[0]->innerHtml());
                    if(isset($carts[$code[1]]))
                        $carts[$code[1]]++;
                    else
                        $carts[$code[1]] = $quantity;
                }
                $price = intval(str_replace(array('円',','), array('', ''), $html->find('.total_price', 0)->innerHtml()));
            }else{
                echo '购物车请求失败'."\r\n";
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        if(!$carts){
            echo 'ID:'.$id.'购物车为空'."\r\n";
        }elseif($price<$totalprice){
            echo 'ID:'.$id.'商品总价:'.$totalprice.'错误,实际:'.$price."\r\n";
        }else{
            $diff = array_diff_assoc($carts, $carts2);
            if(!$diff){
                echo '购买'."\r\n";
                $url = 'https://www.suruga-ya.jp/cargo/orderkiyaku';
                $request->setUrl($url);
                $request->setHeaders(array('User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'action'=>'agree', 'path'=>$path));
                try {
                    $client->send($request, $response);
                    if($response->getStatus()==200){
                        preg_match('/S\d+/', $response->getContent(), $code);
                        if($code && $code[0]){
                            $db2->update('surugaya_order', array('surugaya_sn'=>$code[0], 'state'=>3), array('id'=>$id));
                        }else{
                            $db2->update('surugaya_order', array('surugaya_sn'=>'未找到', 'state'=>3), array('id'=>$id));
                        }
                    }else{
                        echo '购买失败'."\r\n";
                    }
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            }else{
                echo 'ID:'.$id.'购物车数据:'.json_encode($carts2).'错误,实际:'.json_encode($carts).",清空购物车\r\n";
                $request->setUrl('http://www.suruga-ya.jp/cargo/detail');
                $request->setHeaders(array('User-Agent'=>'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36', 'action'=>'del', 'path'=>$path));
                try {
                    $client->send($request, $response);
                    if($response->getStatus()==200){
                        echo '清空完成'."\r\n";
                    }else{
                        echo '清空失败'."\r\n";
                    }
                } catch (Exception $e) {
                    echo $e->getMessage();
                }
            }
        }
    } unset($user_goods);
}else{
    sleep(10);
}
?>


// .proc
[% autoescape false %]
{% autoescape false %}

var page = require('webpage').create(),
    fs = require('fs'),
    system = require('system'),
    response   = {},
    debug      = [],
    logs       = [],
    procedure  = {},
    resources  = 0,
    index = 0,
    action = '',
    username = '',
    password = '',
    num = 0,
    price = 0,
    goods = {},
    content = '',
    path = '',
    headers = {{ input.getHeaders('json') }},
    viewportWidth  = {{ input.getViewportWidth() }},
    viewportHeight = {{ input.getViewportHeight() }};

if(headers.hasOwnProperty('action'))
    action = headers.action
if(headers.hasOwnProperty('useragent'))
    page.settings.userAgent = headers.useragent
if(headers.hasOwnProperty('username'))
    username = headers.username
if(headers.hasOwnProperty('password'))
    password = headers.password
if(headers.hasOwnProperty('goods'))
    goods = headers.goods
if(headers.hasOwnProperty('index'))
    index = headers.index
if(headers.hasOwnProperty('num'))
    num = parseInt(headers.num)
if(headers.hasOwnProperty('price'))
    price = parseInt(headers.price)
if(headers.hasOwnProperty('path'))
    path = headers.path+'/'

var CookieJar = path+"cookiejar.json"

if(fs.isFile(CookieJar))
    Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
        phantom.addCookie(x);
    });
page.viewportSize = { width: viewportWidth, height: viewportHeight };

page.open('{{ input.getUrl() }}', function(status) {
    if(status === "success"){
        if(action=='checklogin'){
            setTimeout(function(){
                response.status = 200;
                response.content = page.content;
                page.render(path+action+'.png')
                system.stdout.write(JSON.stringify(response, undefined, 4));
                phantom.exit(1)
            }, 1500);
        }else if(action=="login"){
            setTimeout(function(){  
                page.evaluate(function(username, password) {
                    document.querySelector('#edit-mail').value=username
                    document.querySelector('#edit-password').value=password
                    document.querySelector('#edit-submit').click()
                }, username, password)
                setTimeout(function(){
                    response.status = 200;
                    response.content = page.content;
                    var cookies = JSON.stringify(page.cookies)
                    fs.write(CookieJar, cookies, 'w')
                    page.render(path+action+'.png')
                    system.stdout.write(JSON.stringify(response, undefined, 4));
                    phantom.exit(1)
                }, 1500)
            }, 2000)
        }else if(action=='addcart'){
            setTimeout(function(num){
                var mnum = page.evaluate(function(){
                    document.querySelector('#cart input.cart1').click()
                    if(num>1 && document.querySelector('input[name="amount"]').length>0)
                        document.querySelector('input[name="amount"]').value = num
                    if(num>1 && document.querySelector('input[name="amount"]').length<=0)
                        return num-1;
                    else
                        return 0
                }, num)
                setTimeout(function(){
                    mnum = parseInt(mnum)
                    if(mnum>0){
                        for (var i = 0; i < mnum; i++) {
                            page.open('{{ input.getUrl() }}', function(status) {
                                if(status==='success'){
                                    setTimeout(function(){
                                        page.evaluate(function(){
                                            document.querySelector('#cart input.cart1').click()
                                        })
                                        setTimeout(function(){
                                            page.render(path+action+'_'+index+'_'+i+'.png')
                                            if(i==num-1){
                                                response.status = 200;
                                                response.content = page.content;
                                                system.stdout.write(JSON.stringify(response, undefined, 4));
                                                phantom.exit(1)
                                            }
                                        }, 1500)
                                    }, 2000)
                                }else{
                                    response.status = 500;
                                    response.content = page.content;
                                    system.stdout.write(JSON.stringify(response, undefined, 4));
                                    phantom.exit(1)
                                }
                            })
                        }
                    }else{
                        response.status = 200;
                        response.content = page.content;
                        var cookies = JSON.stringify(page.cookies)
                        fs.write(CookieJar, cookies, 'w')
                        page.render(path+action+'_'+index+'.png')
                        system.stdout.write(JSON.stringify(response, undefined, 4));
                        phantom.exit(1)
                    }
                }, 1500)
            }, 2000);
        }else if(action=='cart'){
            setTimeout(function(){
                response.status = 200;
                response.content = page.content;
                page.render(path+action+'.png')
                system.stdout.write(JSON.stringify(response, undefined, 4));
                phantom.exit(1)
            }, 1500);
        }else if(action=='del'){
            var tags = page.evaluate(function(){
                var tags = document.querySelectorAll('.remove_product');
                for (var i = 0; i < tags.length; i++) {
                    tags[i].click()
                }
            })
            setTimeout(function(){
                response.status = 200;
                response.content = page.content;
                var cookies = JSON.stringify(page.cookies)
                fs.write(CookieJar, cookies, 'w')
                page.render(path+action+'.png')
                system.stdout.write(JSON.stringify(response, undefined, 4));
                phantom.exit(1)
            }, 2000)
        }else if(action=='agree'){
            page.evaluate(function(){
                document.querySelector('#edit-comfirm-yes').click()
            })
            setTimeout(function(){
                page.render(path+action+'.png')
                page.evaluate(function(){
                    document.querySelector('#edit-submit').click()
                })
                setTimeout(function(){
                    page.render(path+action+'2.png')
                    page.evaluate(function(){
                        document.querySelector('#edit-submit-1').click()
                    })
                    setTimeout(function(){
                        response.status = 200;
                        response.content = page.content;
                        page.render(path+action+'3.png')
                        system.stdout.write(JSON.stringify(response, undefined, 4));
                        phantom.exit(1)
                    }, 2000)
                }, 2000)
            }, 2000)
        }else{
            response.status = 500;
            system.stdout.write('what are you doing？');
            phantom.exit(1)
        }
    }else{
        response.status = 500;
        system.stdout.write(JSON.stringify(response, undefined, 4));
        phantom.exit(1)
    }
})

{% endautoescape %}
[% endautoescape %]