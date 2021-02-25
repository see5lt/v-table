
import layer from './layer'
window.$ = $;

$.isScrollFixed = function(el, options) {
    var base = this;
		base.$el = $(el);
		base.el = el;
		var target = base.$el;
		var original_left = parseInt(target.css('left'));
		var original_right = parseInt(target.css('right'));

		var _fix_position = function () {
			if (base.options.fixed == 'right') {
				target.css('right', ($(window).scrollLeft() + $(window).width() - $(document).width() + original_right) + 'px');
			} else if (base.options.fixed == 'left') {
				target.css('left', (original_left - $(window).scrollLeft()) + 'px');
			}
		};

		var windowResize = function () {
			_fix_position();
		};

		var windowScroll = function () {
			_fix_position();
		};

		base.init = function () {
			base.options = $.extend({}, $.isScrollFixed.defaultOptions, options);
			$(window).resize(windowResize);
			$(window).scroll(windowScroll);
			_fix_position();
		};

		base.init();
}

$.isScrollFixed.defaultOptions = {
    fixed: 'left'
};

$.fn.scrollFixed = function (options) {
    return this.each(function () {
        (new $.isScrollFixed(this, options));
    });
};

$.extend({
    openWin: function(sPath, sName, width, height) {
        /*
		 *  $.openWin(sPath, sName, width, height)   打开指定大小的浏览器窗口,宽高有默认值800x550
		 *  参数类型 sPath=String，sName=String ，width=Number，height=Number
		 *
		 * */
        var _width = parseInt(width) || 800,
			_height = parseInt(height) || 550,
			_sName = sName || "",
			_iL = (window.screen.availWidth - 10 - _width) / 2,
			_iT = (window.screen.availHeight - 30 - _height) / 2,
			_strTmp = (sPath.indexOf("?") == -1) ? "?" : "&";
		if (_iL < 0) _iL = 0;
		if (_iT < 0) _iT = 0;
		sPath += _strTmp + "rnd=" + Math.random();

		try {
			return window.open(sPath, _sName, "left=" + _iL + ",top=" + _iT + ",width=" + _width + ",height=" + _height + ",toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,help=no,center=yes");
		} catch (e) {
			$.toast(2, "打开窗口失败：" + e);
		}
    },
    openFullWin: function (sPath, sName) {
		/*
		 *  $.openFullWin(sPath, sName)  全屏打开一个浏览器窗口
		 *  参数类型 sPath=String，sName=String
		 * 
		 * */
		var _iX = window.screen.availWidth - 10,
			_iY = window.screen.availHeight - 50,
			_sName = sName || "",
			_strTmp = (sPath.indexOf("?") == -1) ? "?" : "&";

		sPath += _strTmp + "rnd=" + Math.random();

		try {
			return window.open(sPath, _sName, "left=0,top=0,width=" + _iX + ",height=" + _iY + ",toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
		} catch (e) {
			$.toast(2, "打开窗口失败：" + e);
		}
    },
    openModalDialog: function (content, title, successFn, yesFn, opt) {
		/*
		 *  打开【模态窗口】,宽高有默认值800x550
		 *  $.openModalDialog(content, title, successFn, yesFn, opt)
		 * 	参数类型:content=String, title=String, successFn=Function, yesFn=Function, opt=Object
		 *  opt = {
		 *      cancelFun:Function, 
		 *      area: [], 
		 *      isMaxmin: true/false, 
		 *      btnAlign: 'l/c/r', 
		 *      cancelFn: Func, 
		 *      fullFn: Func, 
		 *      minFull: Func, 
		 *      restoreFn: Func, 
		 *      endFn: Func
         *      btn:[]
		 *  }
		 * */
		var _layerIndex;
		var def_btn = ['确定', '取消'];
		if (opt && opt.btn) { def_btn = opt.btn; }
		if (opt && opt.btn === null) { def_btn = null; }
		_layerIndex = layer.open({
			type: (opt && opt.type) || 1,
			title: title,
			content: content,
			anim: -1,
			isOutAnim: false,
			area: (opt && opt.area) || ['800px', '550px'],
			maxmin: (opt && opt.isMaxmin) || true,
			fix: false,
			moveOut: true,
			resize: true,
			btnAlign: (opt && opt.btnAlign) || 'r',
			btn: def_btn,
			success: function (layero, index) {
				//layero 当前层 dom, index 当前层索引
				$.enterKeySave(layero);
				if (successFn) {
					successFn(index, layero);
				}
			},
			yes: function (index, layero) {
				if (yesFn) {
					yesFn(index, layero);
				} else {
					layer.close(index);
				}
			},
			btn2: function (index) {
				if (opt && opt.btn2) {
					return opt.btn2(index);
				}
				if (opt && opt.cancelFn) {
					opt.cancelFn(index);
				}
			},
			btn3: function (index, layero) {
				if (opt && opt.btn3) {
					return opt.btn3(layero);
				}
			},
			cancel: function (index) {
				//右上角关闭按钮
				if (opt && opt.cancelFn) {
					opt.cancelFn(index);
				}
			},
			end: function () {
				//层销毁就触发
				if (opt && opt.endFn) {
					opt.endFn();
				}
			},
			full: function (layero) {
				//最大化触发
				if (opt && opt.fullFn) {
					opt.fullFn();
				}
			},
			min: function (layero) {
				//最小化触发
				if (opt && opt.minFn) {
					opt.minFn();
				}
			},
			restore: function (layero) {
				//还原触发
				if (opt && opt.restoreFn) {
					opt.restoreFn();
				}
			}
		});
		return _layerIndex;
    },
    openIframe: function (url, title, area, opt) {
		/*
		 *  打开【Iframe窗口】,宽高有默认值800x550
		 *  $.openModalDialog(url,title,area,opt)
		 * */
		var _layerIndex;
		_layerIndex = layer.open({
			type: 2,
			title: title,
			skin: !title ? 'layer-empty-title' : '',
			content: url,
			anim: -1,
			isOutAnim: false,
			area: area || ['800px', '550px'],
			maxmin: (opt && opt.isMaxmin) || true,
			fix: false,
			moveOut: true,
			resize: true,
			btnAlign: (opt && opt.btnAlign) || 'r',
			btn: null,
			cancel: function (index) {
				//右上角关闭按钮
				if (opt && opt.cancelFn) {
					opt.cancelFn(index);
				}
			},
			end: function () {
				//层销毁就触发
				if (opt && opt.endFn) {
					opt.endFn();
				}
			},
			full: function (layero) {
				//最大化触发
				if (opt && opt.fullFn) {
					opt.fullFn();
				}
			},
			min: function (layero) {
				//最小化触发
				if (opt && opt.minFn) {
					opt.minFn();
				}
			},
			restore: function (layero) {
				//还原触发
				if (opt && opt.restoreFn) {
					opt.restoreFn();
				}
			}
		});
		return _layerIndex;
    },
    confirm: function (iconNum, content, yesFn, opt) {
		/* 模拟对话框,可确认，可取消
		 * iconNum = 0=感叹,1=成功,2=错误,3=疑问,4=锁，5=笑，6=笑
		 * 	opt = {
		 * 		title: '',
		 *   	cancelFn: func
		 * 	}
		 */
		layer.confirm(content, {
			icon: iconNum,
			title: (opt && opt.title) || '提示',
			offset: '25%',
			success: function (layero) {
				$(document.activeElement).blur();
				$.enterKeySave(layero);
			}
		}, function (index, layero) {
			if (yesFn) {
				yesFn(index, layero);
			} else {
				layer.close(index);
			}
		}, function (index) {
			if ((opt && opt.cancelFn)) opt.cancelFn(index);
		});
	},
	alert: function (iconNum, content, yesFn, title) {
		/*
		 * 	模拟确认提示框
		 * 	iconNum = 0=感叹,1=成功,2=错误,3=疑问,4=锁，5=笑，6=笑
		 * */
		layer.confirm(content, {
			icon: iconNum,
			title: title || "提示",
			offset: '25%',
			btn: ["确定"],
			success: function (layero) {
				$.enterKeySave(layero);
			}
		}, function (index, layero) {
			if (yesFn) {
				yesFn(index, layero);
			} else {
				layer.close(index);
			}
		});
	},
	toast: function (iconNum, content, callback, time) {
		/*
		 * 	消息框，自动隐藏
		 * 	iconNum = 0=感叹,1=成功,2=错误,3=疑问,4=锁，5=笑，6=笑
		 * */
		layer.msg(content, {
			icon: iconNum,
			time: time || 1500,
			offset: '25%'
		}, function (index) {
			if (callback) {
				callback(index);
			}
		});
    },
    enterKeySave: function (layero) {
		$(window).keydown(function (e) {
			if (e.keyCode == 13 && !$(e.target).is('textarea')) {
				if (window.webConfig && window.webConfig.enableAllEnterKeySave == true) {
					$.each($(layero).find(".layui-layer-btn a"), function () {
						var btnText = $(this).contents().filter(function () { return this.nodeType === 3; }).text();
						if (String($(this).attr("class")).indexOf("layui-layer-btn") != -1) {
							if (btnText == "保存" || btnText == "确定" || btnText == "确认") {
								if ($(this).width() > 0 && $(this).css("display") != "none") {
									$(this).click();
								}
							}
						}
					});
				}
				return false;
			}
		});
	}
})

// ajax
window.utils = {
     ajax: {
        get: function (url, params, successFn, opt) {
            return this.send('GET', url, params, successFn, opt);
        },
        post: function (url, params, successFn, opt) {
            return this.send('POST', url, params, successFn, opt);
        },
        send: function (type, url, params, successFn, opt) {
       
            var _async = true;
            if (opt && opt.async == false) _async = false;
            return $.ajax({
                type: type,
                url: url,
                data: params,
                timeout: (opt && opt.timeout) || 60000,
                dataType: (opt && opt.datatype) || "json",
                contentType: opt == "json" ? "application/json" : ((opt && opt.contentType) || "application/x-www-form-urlencoded"),
                async: _async,
                beforeSend: function (request) {
                   var Newtoken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6Iuezu-e7n-euoeeQhuWRmCIsImlhdCI6IjE2MTM3MTY1MzAiLCJuYmYiOjE2MTM3MTY1MzAsImV4cCI6MTYxMzcxNzEzMCwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjAyMS8yLzE5IDE0OjQ1OjMwIiwiaXNzIjoiVGVuYW50TWFuYWdlbWVudCIsImF1ZCI6WyJEeVNvZnQiLCJEeVNvZnQiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4ifQ.GUuRPSslvUEN4J9-vsnIJg6l0Xtg2SaCA6quGvL_zuY";
                   request.setRequestHeader("Authorization", Newtoken);
                },
                success: function (resp) {
                    if (resp.Code == 0) {
                        successFn(resp);
                    } else if (resp.Code == -2) {
                       $.alert(0, resp.Message);
                    } else {
                       $.alert(0, resp.Message);
                    }
                },
                complete: function () {
                    //关闭加载按钮
                  // layer.close(_loadingIdx);
                },
                error: function (xhr, textStatus, err) {
                    var errText = xhr.responseText || "";
                    if (errText) {
                        errText = errText.substring(errText.indexOf("<title>", 0) + 7, errText.indexOf("</title>", 0));
                    }
                    var errMsg = "报错信息： " + (errText || xhr.statusText) + "，状态码是： " + xhr.status;
                    if (errText.indexOf("将截断字符串或二进制数据") !== -1) {
                        errMsg = "字段内容超长，请修复后重新提交";
                    }
                    $.alert(2, errMsg);
                }
            })
        }
     },
     cookie: {
            /*
            * 设置【Cookie】
            * @param cookieName   String
            * @param cookieValue  String
            * @param expire       Number  有效天数  默认为永久    -1：关闭浏览器失效
            */
         setCookie : function(cookieName, cookieValue, expire) {
            if (expire == undefined) {
                expire = 0;
            }
            if (typeof (expire) == "string") {
                console.log("类型错误");
                return;
            }
            if (expire == -1) {
                document.cookie = cookieName + "=" + escape(cookieValue) + ";path=/";
                return;
            }
            var exp = new Date();
            if (expire == 0) {
                exp.setTime(exp.getTime() + 99999 * 24 * 60 * 60 * 1000);
            }
            else {
                exp.setTime(exp.getTime() + expire * 24 * 60 * 60 * 1000);
            }
            document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + exp.toGMTString() + ";path=/";
         },
         /*
        * 获取【Cookie】
        * @param cookieName  String
        * @ignore created  2019-07-18
        */
       getCookie: function (cookieName) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(cookieName + "=");
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_start != -1) {
                    c_start = c_start + cookieName.length + 1
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end))
                }
            }
            return "";
         }
     },
     crypto: {
         md5: function(string) {
            function md5_RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }
            function md5_AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }
            function md5_F(x, y, z) {
                return (x & y) | ((~x) & z);
            }
            function md5_G(x, y, z) {
                return (x & z) | (y & (~z));
            }
            function md5_H(x, y, z) {
                return (x ^ y ^ z);
            }
            function md5_I(x, y, z) {
                return (y ^ (x | (~z)));
            }
            function md5_FF(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_GG(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_HH(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_II(a, b, c, d, x, s, ac) {
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };
            function md5_ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            function md5_WordToHex(lValue) {
                var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };
            function md5_Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a; BB = b; CC = c; DD = d;
                a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = md5_AddUnsigned(a, AA);
                b = md5_AddUnsigned(b, BB);
                c = md5_AddUnsigned(c, CC);
                d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
         }
     },
     number: {
         /*
         * 【加】
         * @param  num1   Number
         * @param  num2   Number
         * @param  n      Numbern  保留小数位数
         * @return result Number
         * @ignore created  2019-07-18
        */
        Add: function (num1, num2, n) {
            num1 = Number(num1);
            num2 = Number(num2);
            var dec1, dec2, times;
            try {
                dec1 = countDecimals(num1) + 1;
            } catch (e) {
                dec1 = 0;
            }
            try {
                dec2 = countDecimals(num2) + 1;
            } catch (e) {
                dec2 = 0;
            }
            times = Math.pow(10, Math.max(dec1, dec2));
            //var result = (num1 * times + num2 * times) / times;
            var result = (DySoft.number.Mul(num1, times) + DySoft.number.Mul(num2, times)) / times;
            return getCorrectResult("add", num1, num2, result, n);
        },
         /*
         * 【减】
         * @param  num1   Number
         * @param  num2   Number
         * @param  n      Numbern  保留小数位数
         * @return result Number
         * @ignore created  2019-07-18
        */
       Sub: function (num1, num2, n) {
            num1 = Number(num1);
            num2 = Number(num2);
            var dec1, dec2, times;
            try {
                dec1 = countDecimals(num1) + 1;
            } catch (e) {
                dec1 = 0;
            }
            try {
                dec2 = countDecimals(num2) + 1;
            } catch (e) {
                dec2 = 0;
            }
            times = Math.pow(10, Math.max(dec1, dec2));
            //var result = Number(((num1 * times - num2 * times) / times));
            var result = Number((DySoft.number.Mul(num1, times) - DySoft.number.Mul(num2, times)) / times);
            return getCorrectResult("sub", num1, num2, result, n);
        },
         /*
         * 【乘】
         * @param  num1   Number
         * @param  num2   Number
         * @param  n      Numbern  保留小数位数
         * @return result Number
         * @ignore created  2019-07-18
        */
       Mul: function (num1, num2, n) {
            num1 = Number(num1);
            num2 = Number(num2);
            var times = 0, s1 = num1.toString(), s2 = num2.toString();
            try {
                times += countDecimals(s1);
            } catch (e) {
            }
            try {
                times += countDecimals(s2);
            } catch (e) {
            }
            var result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times);
            return getCorrectResult("mul", num1, num2, result, n);
        },
         /*
         * 【除】
         * @param  num1   Number
         * @param  num2   Number
         * @param  n      Numbern  保留小数位数
         * @return result Number
         * @ignore created  2019-07-18
        */
       Div: function (num1, num2, n) {
            num1 = Number(num1);
            num2 = Number(num2);
            var t1 = 0, t2 = 0, dec1, dec2;
            try {
                t1 = countDecimals(num1);
            } catch (e) {
            }
            try {
                t2 = countDecimals(num2);
            } catch (e) {
            }
            dec1 = convertToInt(num1);
            dec2 = convertToInt(num2);
            var result = DySoft.number.Mul((dec1 / dec2), Math.pow(10, t2 - t1));
            return getCorrectResult("div", num1, num2, result, n);
        },
         /*
         * 【拆分】
         * @param  num      Number
         * @param  percent  Array
         * @return result   Array
         * @ignore created  2019-07-18
        */
       splitNum: function (num, percent) {
            if (!num) return;
            if (!percent) return;
            var p_arr = [];
            var checkPercent = 0;
            //将百分比转为小数
            $.each(percent, function (index, value) {
                var _percent = value.toString();
                _percent = _percent.replace("%", "") / 100;
                checkPercent = DySoft.number.Add(_percent, checkPercent)
                p_arr.push(_percent);
            });
            if (checkPercent != 1) {
                DySoft.toast(2, "百分比之和不为100%,请检查数据");
                return;
            }

            //方法1 按照【percent数组】顺序最后一项进行补差
            var n_value = 0;
            var n_arr = [];
            $.each(p_arr, function (index, value) {
                //循环到最后一个
                if (index == p_arr.length - 1) {
                    var res = DySoft.number.Sub(num, n_value)
                    n_arr[index] = res;
                } else {
                    //当前占比
                    var res = DySoft.number.Mul(num, value);
                    //目前已计算的金额
                    n_value = DySoft.number.Add(res, n_value);
                    n_arr[index] = res;
                }
            });
            return n_arr;
            // //方法2 用占比最大的值进行补差
            // //获取最大占比的index value
            // var arrMax_Index =  p_arr.indexOf(Math.max.apply(null, p_arr));
            // var arrMsx_Value = 0;
            // //拆分
            // var n_arr = new Array(percent.length);
            // $.each(p_arr, function(index, value) {
            //     //循环到最大值
            //     if (index == arrMax_Index){
            //         return;
            //     }
            //     //循环到最后一个
            //     else if(index == p_arr.length-1){
            //         var res = DySoft.number.Mul(num,value)
            //         n_arr[index]=res;
            //         //补差法 计算 最大值
            //         n_arr[arrMax_Index] =num - arrMsx_Value - res;
            //
            //     }else{
            //         var res = DySoft.number.Mul(num,value);
            //         n_arr[index]=res;
            //         arrMsx_Value += res;
            //     }
            // });
            //return n_arr;
        },
        /*
         * 转千分号
         * @param  num  Number
         * @return String
         * @ignore created  2019-07-18
        */
       commafy: function (num) {
            var decimalPart = '';
            num = (num + '').toString();
            if (num.indexOf('.') != -1) {
                decimalPart = '.' + num.split('.')[1];
                num = parseInt(num.split('.')[0]);
            }
            var array = num.toString().split('');
            var index = -3;
            while (array.length + index > 0 && array[array.length + index - 1] != "-") {
                array.splice(index, 0, ',');
                index -= 4;
            }
            return array.join('') + decimalPart;
        },
        /*
         * 去除千分号
         * @param  num  Number
         * @return String
         * @ignore created  2019-07-18
        */
       delcommafy: function (num) {
            if ((num + "").trim() == "") { return ""; }
            return (num + '').replace(/\,/ig, '');
        },
        /*
         * 【数组去重】
         * @param  arr     Array
         * @return result  Array
         * @ignore created  2019-07-18
        */
       unique: function (arr) {
            var tmpArr = [], hash = {};
            for (var i = 0; i < arr.length; i++) {
                if (!hash[arr[i]]) {
                    hash[arr[i]] = true;
                    tmpArr.push(arr[i]);
                };
            };
            return tmpArr;
        },
        /*
         * 123转 '一', '二', '三',
         * @param  n     Number
         * @return s     String
         * @ignore created  2019-07-18
        */
       typeConversion: function (n) {
            var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', "十"];
            var s = '';
            n = '' + n; // 数字转为字符串
            for (var i = 0; i < n.length; i++) {
                s += cnum[parseInt(n.charAt(i))];
            }
            if (s.length == 2) { // 两位数的时候
                // 如果个位数是0的时候，令改成十
                if (s.charAt(1) == cnum[0]) {
                    s = s.charAt(0) + cnum[10];
                    // 如果是一十改成十
                    if (s == cnum[1] + cnum[10]) {
                        s = cnum[10]
                    }
                } else if (s.charAt(0) == cnum[1]) {
                    // 如果十位数是一的话改成十
                    s = cnum[10] + s.charAt(1);
                }
            }
            return s;
        }    
     },
     /*
     * Private Function 私有
     * ============================================================================
    */
    //计算小数位的长度
     countDecimals: function(num) {
            var len = 0;
            try {
                num = Number(num);
                var str = num.toString().toUpperCase();
                if (str.split('E').length === 2) { // scientific notation
                    var isDecimal = false;
                    if (str.split('.').length === 2) {
                        str = str.split('.')[1];
                        if (parseInt(str.split('E')[0]) !== 0) {
                            isDecimal = true;
                        }
                    }
                    var x = str.split('E');
                    if (isDecimal) {
                        len = x[0].length;
                    }
                    len -= parseInt(x[1]);
                } else if (str.split('.').length === 2) { // decimal
                    if (parseInt(str.split('.')[1]) !== 0) {
                        len = str.split('.')[1].length;
                    }
                }
            } catch (e) {
                throw e;
            } finally {
                if (isNaN(len) || len < 0) {
                    len = 0;
                }
                return len;
            }
        },
        //将小数转成整数
        convertToInt: function(num) {
            num = Number(num);
            var newNum = num;
            var times = countDecimals(num);
            var temp_num = num.toString().toUpperCase();
            if (temp_num.split('E').length === 2) {
                newNum = Math.round(num * Math.pow(10, times));
            } else {
                newNum = Number(temp_num.replace(".", ""));
            }
            return newNum;
        },
        //确认计算结果无误
        getCorrectResult: function(type, num1, num2, result, n) {
            var temp_result = 0;
            switch (type) {
                case "add":
                    temp_result = num1 + num2;
                    break;
                case "sub":
                    temp_result = num1 - num2;
                    break;
                case "div":
                    temp_result = num1 / num2;
                    break;
                case "mul":
                    temp_result = num1 * num2;
                    break;
            }
            if (Math.abs(result - temp_result) > 1) {
                if (n) {
                    return getFloat(temp_result, n);
                }
                return temp_result;
            }
            if (n) {
                return getFloat(result, n);
            };
            return result;
        },
        //四舍五入
        round: function(num, decimal) {
            if (isNaN(num)) {
                return 0;
            }
            var p1 = Math.pow(10, decimal + 1);
            var p2 = Math.pow(10, decimal);
            return Math.round(num * p1 / 10) / p2;
        },
        //保留小数位
        getFloat: function(num, decimal) {
            return round(num, decimal).toFixed(decimal);
        }
}


// 千分号
export  function commafy(num){
 if(!Number(num)){ return num;}
 let decimalPart = '';
 num =(num+'').toString();
 if (num.indexOf('.') != -1) {
     decimalPart = '.' + num.split('.')[1];
     num = parseInt(num.split('.')[0]);
 }
 let array = num.toString().split('');
 let index = -3;
 while (array.length + index > 0 && array[array.length + index-1] !="-") {
     array.splice(index, 0, ',');
     index -= 4;
 }
 return array.join('') + decimalPart;
}
//去除千分号
export function delcommafy(num){
 if((num+"").trim()==""){ return"";}
 return (num +'').replace(/\,/ig,'');
}










































export const ajax = {
    get: function (url, params, successFn, opt) {
        return this.send('GET', url, params, successFn, opt);
    },
    post: function (url, params, successFn, opt) {
        return this.send('POST', url, params, successFn, opt);
    },
    send: function (type, url, params, successFn, opt) {
       
        var _async = true;
        if (opt && opt.async == false) _async = false;
        return $.ajax({
            type: type,
            url: url,
            data: params,
            timeout: (opt && opt.timeout) || 60000,
            dataType: (opt && opt.datatype) || "json",
            contentType: opt == "json" ? "application/json" : ((opt && opt.contentType) || "application/x-www-form-urlencoded"),
            async: _async,
            beforeSend: function (request) {
               var Newtoken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6Iuezu-e7n-euoeeQhuWRmCIsImlhdCI6IjE2MTM3MTY1MzAiLCJuYmYiOjE2MTM3MTY1MzAsImV4cCI6MTYxMzcxNzEzMCwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjAyMS8yLzE5IDE0OjQ1OjMwIiwiaXNzIjoiVGVuYW50TWFuYWdlbWVudCIsImF1ZCI6WyJEeVNvZnQiLCJEeVNvZnQiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4ifQ.GUuRPSslvUEN4J9-vsnIJg6l0Xtg2SaCA6quGvL_zuY";
               request.setRequestHeader("Authorization", Newtoken);
            },
            success: function (resp) {
                if (resp.Code == 0) {
                    successFn(resp);
                } else if (resp.Code == -2) {
                   $.alert(0, resp.message);
                } else {
                   $.alert(0, resp.message);
                }
            },
            complete: function () {
                //关闭加载按钮
              // layer.close(_loadingIdx);
            },
            error: function (xhr, textStatus, err) {
                var errText = xhr.responseText || "";
                if (errText) {
                    errText = errText.substring(errText.indexOf("<title>", 0) + 7, errText.indexOf("</title>", 0));
                }
                var errMsg = "报错信息： " + (errText || xhr.statusText) + "，状态码是： " + xhr.status;
                if (errText.indexOf("将截断字符串或二进制数据") !== -1) {
                    errMsg = "字段内容超长，请修复后重新提交";
                }
                $.alert(2, errMsg);
            }
        })
    }
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

export default utils;
