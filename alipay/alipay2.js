
setTimeout(function(){
    console.clear()
    console.log('执行开始')
    autoscript()
}, 1500)

var requrl = 'https://www.transportjp.com';

function autoscript(){
    if(document.createEvent){
        var evObj = document.createEvent('MouseEvents')
        evObj.initEvent('mousedown', true, false)
    }
    if(document.title == "安全校验 - 支付宝"){
        alert("请扫描校验")
    }else if(document.title == '登录 - 支付宝'){
        document.querySelector('li[data-status="show_login"]').dispatchEvent(evObj)
        document.querySelector('li[data-status="show_login"]').click()
        if(document.createEvent){            
            document.querySelector('#J-input-user').dispatchEvent(evObj)
            document.querySelector('#J-input-user').value = '15339699513'
            document.querySelector('#password_rsainput').dispatchEvent(evObj)
            document.querySelector('#password_rsainput').value = '623863rzw'
        }else if(document.createEventObject){
            document.querySelector('#J-input-user').fireEvent("mousedown")
            document.querySelector('#J-input-user').value = '15339699513'
            document.querySelector('#password_rsainput').fireEvent("mousedown")
            document.querySelector('#password_rsainput').value = '623863rzw'
        }        
        if(document.querySelector('#J-input-checkcode').className.indexOf('fn-hide')===false)
            alert('请输入验证码并登录')
        else{
            if(document.createEvent)
                document.querySelector('#J-login-btn').dispatchEvent(evObj)
            else if(document.createEventObject)        
                document.querySelector('#J-login-btn').fireEvent("mousedown")
            document.querySelector('#J-login-btn').click()
        }
    }else{
        var xmlhttp
        if (window.XMLHttpRequest)
            xmlhttp=new XMLHttpRequest();
        else
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        if(xmlhttp!=null){
            xmlhttp.open("POST", requrl + "/api/pay.php?action=getnopays", false)
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
            xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c")
            console.log(xmlhttp.responseText)
            var jsondata = JSON.parse(xmlhttp.responseText)
            if(jsondata.status=='1'){
                var k = Math.floor(Math.random()*jsondata.content.length)
                var row = jsondata.content[k]
                if(document.title == '交易记录 - 支付宝' && !row.payno){
                    var match = 0,payno='',title='',money = 0;
                    for (var i = 0; i < document.querySelectorAll('#tradeRecords tbody tr').length; i++) {
                        payno = document.querySelectorAll('#tradeRecords tbody tr')[i].querySelector('div.consumeBizNo').innerHTML.trim()
                        title = document.querySelectorAll('#tradeRecords tbody tr')[i].querySelector('span.ft-gray') ? document.querySelectorAll('#tradeRecords tbody tr')[i].querySelector('span.ft-gray').innerHTML.trim() : ''
                        money = document.querySelectorAll('#tradeRecords tbody tr')[i].querySelector('td.amount.income') ? parseFloat(document.querySelectorAll('#tradeRecords tbody tr')[i].querySelector('td.amount.income').innerHTML.trim()) : 0
                        if(row.payno && payno==row.payno){
                            match = 1
                            break
                        }else if(row.title==title){
                            match = 1
                            break
                        }
                    }
                    if(match == 1){
                        console.log("成功：" + "id=" + row.id + "&res=" + payno + "|" + title + "|" + money)
                        xmlhttp.open("POST", requrl + "/api/pay.php?action=topays", false)
                        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                        xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c&id=" + row.id + "&res=" + payno + "|" + title + "|" + money)
                        console.log("res：" + xmlhttp.responseText)
                    }else{
                        // if(document.querySelector('#J-keyword') && document.querySelector('#J-keyword').value==''){
                        //     console.log("查询："+row.title)
                        //     if(document.createEvent){
                        //         var evObj = document.createEvent('MouseEvents')
                        //         evObj.initEvent('mousedown', true, false)
                        //         document.querySelector('#supper').dispatchEvent(evObj)
                        //         document.querySelector('#supper').click()
                        //         document.querySelector('#J-keyword').dispatchEvent(evObj)
                        //         document.querySelector('#J-keyword').focus()  
                        //         document.querySelector('#J-keyword').value=row.title
                        //         document.querySelector('input[value="筛 选"]').dispatchEvent(evObj)
                        //     }else if(document.createEventObject){
                        //         document.querySelector('#supper').fireEvent('mousedown')
                        //         document.querySelector('#supper').click()
                        //         document.querySelector('#J-keyword').fireEvent('mousedown')
                        //         document.querySelector('#J-keyword').focus()
                        //         document.querySelector('#J-keyword').value=row.title
                        //         document.querySelector('input[value="筛 选"]').fireEvent("mousedown")
                        //     }
                        // }else{
                        //     if(document.querySelector('div.tip-angle-content span') && document.querySelector('div.tip-angle-content span').innerHTML=="没有符合条件的记录。"){
                                console.log("失败：" + "id=" + row.id + "title=" + row.title + "&res=-1")
                                xmlhttp.open("POST", requrl + "/api/pay.php?action=topays", false)
                                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                                xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c&id=" + row.id + "&res=-1")
                                console.log("res：" + xmlhttp.responseText)
                            // }else{
                            //     console.log('数据不匹配:'+row.payno+'|'+row.title+'|'+row.money)
                            // }
                        // }
                    }
                }else if(document.title=='支付宝 - 网上支付 安全快速！' && document.querySelector('div.notice.n-error-m h3') && document.querySelector('div.notice.n-error-m h3').innerHTML.trim()=="查询交易详情失败。"){
                    console.log("失败：" + "id=" + row.id + "payno=" + row.payno + "&res=-1")
                    xmlhttp.open("POST", requrl + "/api/pay.php?action=topays", false)
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                    xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c&id=" + row.id + "&res=-1")
                    console.log("res：" + xmlhttp.responseText)
                }else if(document.title=='支付宝' && document.querySelector('div.notice.n-error-m h3') && document.querySelector('div.notice.n-error-m h3').innerHTML=="暂时无法查询交易详情") {
                    console.log("失败：" + "id=" + row.id + "payno=" + row.payno + "&res=-1")
                    xmlhttp.open("POST", requrl + "/api/pay.php?action=topays", false)
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                    xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c&id=" + row.id + "&res=-1")
                    console.log("res：" + xmlhttp.responseText)
                }else if(document.title=='记录详情'){
                    var payno='',title='',money = 0;
                    if(document.querySelectorAll('td.name ul li')){
                        var payno = document.querySelectorAll('td.name ul li')[1].innerHTML.replace('交易号 ', '').trim()
                        var money = document.querySelectorAll('td.amount')[1].innerHTML.trim()
                        if(payno==row.payno){
                            console.log("成功：" + "id=" + row.id + "&res=" + payno + "|" + money)
                            xmlhttp.open("POST", requrl + "/api/pay.php?action=topays", false)
                            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                            xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c&id=" + row.id + "&res=" + payno + "||" + money)
                            console.log("res：" + xmlhttp.responseText)
                        }else
                            console.log(payno+"||"+money);
                    }else
                        alert("特殊情况，请判断处理")
                }else{
                    var length = row.payno.length
                    var url = ''
                    if(length<=10)
                        url = "https://lab.alipay.com/consume/record/items.htm"
                    else if(length==28)
                        url = "https://lab.alipay.com/consume/queryTradeDetail.htm?tradeNo=" + row.payno
                    else
                        url = "https://shenghuo.alipay.com/send/queryTransferDetail.htm?tradeNo=" + row.payno
                    window.location.href = url
                }

                console.log('执行结束, 稍后重启')
                setTimeout(function(){
                    window.location.href = "https://lab.alipay.com/consume/record/items.htm"
                }, 10000)
            }else{
                console.log('执行查询')
                var t = setInterval(function(){
                    xmlhttp.open("POST", requrl + "/api/pay.php?action=getnopays", false)
                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                    xmlhttp.send("APPKEY=android&APPSECRET=2793003ce8104768fe5f562922e5be9c")
                    console.log(xmlhttp.responseText)
                    var jsondata = JSON.parse(xmlhttp.responseText)
                    if(jsondata.status=='1'){
                        console.log('数据查找匹配')
                        clearInterval(t)
                        window.location.href = "https://lab.alipay.com/consume/record/items.htm"
                    }
                }, 2000)
            }
        }
    }
}

