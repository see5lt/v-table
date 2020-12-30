// ajax
export function ajax(options) {
    function empty() {}
    function obj2Url(obj) {
        if (obj && obj instanceof Object) {
            var arr = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (typeof obj[i] == 'function') obj[i] = obj[i]();
                    if (obj[i] == null) obj[i] = '';
                    arr.push(escape(i) + '=' + escape(obj[i]));
                }
            }
            return arr.join('&').replace(/%20/g, '+');
        } else {
            return obj;
        }
    };
    var opt = {
        url: '', //请求地址
        sync: true, //true，异步 | false　同步，会锁死浏览器，并且open方法会报浏览器警告
        method: 'GET', //提交方法
        data: null, //提交数据
        dataType: null, //返回数据类型
        success: empty, //成功返回回调
        beforeSend: empty, //请求前
        error: empty, //错误信息回调
        timeout: 0, //请求超时ms
        headers:{}
    };
    for (var i in options) if (options.hasOwnProperty(i)) opt[i] = options[i];
    var accepts = {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: 'application/json',
        xml: 'application/xml, text/xml',
        html: 'text/html',
        text: 'text/plain'
    };
    var abortTimeout = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
		if (xhr.readyState == 1) {
			opt.beforeSend(xhr);
		}
        if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty;
            clearTimeout(abortTimeout);
            var result,dataType, error = false;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && xhr.protocol == 'file:')) {
                if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') {
                    result = xhr.response;
                } else {
                    result = xhr.responseText;
                    dataType = opt.dataType ? opt.dataType : xhr.getResponseHeader('content-type').split(';', 1)[0];
                    for (var i in accepts) {
                        if (accepts.hasOwnProperty(i) && accepts[i].indexOf(dataType) > -1) dataType = i;
                    }
                    try {
                        if (dataType == 'script') {
                            eval(result);
                        } else if (dataType == 'xml') {
                            result = xhr.responseXML
                        } else if (dataType == 'json') {
                            result = result.trim() == '' ? null : JSON.parse(result)
                        }
                    } catch (e) {
                        opt.error(e, xhr);
                        xhr.abort();
                    }
                }
                opt.success(result, xhr);
            } else {
                opt.error(xhr.statusText, xhr);
            }
        }
    };
    if (opt.method == 'GET') {
        var parse = opt.url.parseURL();
        opt.data = Object.assign({}, opt.data, parse.params);
        opt.url = parse.pathname + '?' + obj2Url(opt.data);
        opt.data = null;
    }
    xhr.open(opt.method, opt.url, opt.sync, opt.username, opt.password);
    if (opt.method == 'POST'){
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		for (let i in opt.headers){
			xhr.setRequestHeader(i, opt.headers[i]);
		}
	}
    if (opt.timeout > 0) {
        abortTimeout = setTimeout(function() {
            xhr.onreadystatechange = empty
            xhr.abort();
            opt.error('timeout', xhr);
        }, opt.timeout)
    }
    console.log(opt.data)
    xhr.send(opt.data ? obj2Url(opt.data) : null);
    console.log(opt.data);
	return xhr;
}


// get合计
export function getTotal(data=[],name) {
	let  total = "";
	if(name){
		total =  eval(
			data.map( h=> {
				return Number( h[name] );
			}).join("+")
		);
	}
	return total;
}

// 获取时间
export function dateFormat(format,d){
	if(d=="") return "";
  var format= format || "yyyy-MM-dd HH:mm:ss";
  var d = String(d).indexOf(" ") == -1 ? d + " " : d  + ":" ;
  var date  = d ? new Date(d.replace(/-/g, '/')) : new Date();

  var o = {
      "M+" : date.getMonth()+1, //月份
      "d+" : date.getDate(), //日
      "D+" : date.getDate(), //日
      "h+" : date.getHours(), //小时
      "H+" : date.getHours(), //小时
      "m+" : date.getMinutes(), //分
      "s+" : date.getSeconds(), //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S" : date.getMilliseconds() //毫秒
  };
  var week = {
      "0" : "/u65e5",
      "1" : "/u4e00",
      "2" : "/u4e8c",
      "3" : "/u4e09",
      "4" : "/u56db",
      "5" : "/u4e94",
      "6" : "/u516d"
  };
  if(/(y+)/.test(format)){
    format= format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(Y+)/.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(format)){
    format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(format)){
      format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return format;
}

// 事件委托
export function eventDelegation(el,event,str,callbackFn,leaveFn){
	let evTimeStamp = 0;
	var strs= str.split(",");
	el.addEventListener(event,e=>{
	 	e.stopPropagation();
		let now = +new Date();
		if (now - evTimeStamp < 100 && event == "click"){
			return;
		}
		evTimeStamp = now;
		let elf = e.target;
		while(
			elf &&
			strs.indexOf(elf.tagName) == -1 &&
			strs.indexOf(elf.localName) == -1 &&
			strs.indexOf("#"+ elf.id) == -1 &&
			strs.indexOf(elf.localName+"#"+ elf.id) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[0]) ) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[1]) ) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[2]) ) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[3]) ) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[4]) ) == -1 &&
			strs.indexOf("."+ (elf.classList && elf.classList[5]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[0]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[1]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[2]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[3]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[4]) ) == -1 &&
			strs.indexOf(elf.localName +"."+ (elf.classList && elf.classList[5]) ) == -1
		){
			if(elf === parent){
				elf = null
				break
			}
			elf = elf.parentNode
		}
		if(elf && callbackFn){
			callbackFn(e,elf);
		}else if(leaveFn && leaveFn !== true){
			leaveFn(e,elf);
		}
	},leaveFn === true ? true : false);
}


//全局重置 toFixed 方法，纠正四舍五入错误
Number.prototype.toFixed = function(n){
    var n = n < 0 ? 0 : n;
    var decimal = n < 1  ?  1 : Math.pow(10,n);
    var data = String(Math.round(this * decimal) / decimal);
    if(!data.split('.')[1] && n>0){
        data += '.'+ getDecimal(n);
    }else if(n>0 && data.split('.')[1].length < n){
        data += getDecimal( n - data.split('.')[1].length  );
    }
    function getDecimal(n){
        var s = '' ;
        for (var i=0; i<n; i++) { s += "0";  }
        return s;
    }
    return data;
};
