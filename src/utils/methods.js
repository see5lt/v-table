const methods = {
	onfocus:function(e){
		let that = e.target;
		let permil = that.getAttribute("permil");
		if(permil == "true"){
			that.value = this.delcommafy( that.value );
			that.setAttribute('type','number');
		}
	},
	onblur:function(e){
		let that = e.target;
		let acc = that.getAttribute("acc") || 2;
		let permil = that.getAttribute("permil");
		if(permil == "true"){
			that.setAttribute('type','text');
			that.value = this.commafy( Number(that.value).toFixed(acc) );
		}
	},
	oninput:function(e){
		let that = e.target;
		let maxlength = that.getAttribute("maxlength");
		let acc = that.getAttribute("acc") || 2;
    let decimals = String(that.value).split('.')[1];
		if(that.max && that.value > Number(that.max || Infinity)){
			that.value = Number(that.max).toFixed(acc);
			this.tips(that,"不能大于"+that.value);
		}
		if(that.min && that.value < Number(that.min || -Infinity)){
			that.value = Number(that.min).toFixed(acc);
			this.tips(that,"不能小于"+that.value);
		}
		if(maxlength && String(that.value).length >= Number(maxlength || Infinity)){
			that.value = String(that.value).substr(0,maxlength);
			this.tips(that,"最多只能输入"+maxlength +"位数");
		}
    if(decimals && decimals.length > acc){
      that.value =  Math.floor( Number(that.value) * Math.pow(10,acc) ) / Math.pow(10,acc);
    }
	},
	commafy: function(num){
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
	},
	delcommafy:function (num){
		if((num+"").trim()==""){ return"";}
		return (num +'').replace(/\,/ig,'');
	},
	tips(e,title){
    let offset = this.getOffset(e);
    let label = document.createElement("label");
    label.classList.add("dy__layer-tips");
    label.innerHTML=title;
    label.style.left= offset.left +'px';
    label.style.top= offset.top - 38 +'px';
    if(document.body.querySelector('.dy__layer-tips')){
      clearInterval(window.layertipstimoutide);
      document.body.removeChild( document.body.querySelector('.dy__layer-tips') );
    }
    document.body.appendChild(label);
    window.layertipstimoutide = setTimeout(()=>{ document.body.removeChild(label);},1500);
	},

  getOffset(ele){
    let result = {
      top: 0,
      left: 0
    }
    if (!ele.getClientRects().length) {
      return result
    }
    if (window.getComputedStyle(ele)['display'] === 'none') {
      return result
    }
    result = ele.getBoundingClientRect()
    let document = ele.ownerDocument.documentElement
    return {
      top: result.top + window.pageYOffset - document.clientTop,
      left: result.left + window.pageXOffset - document.clientLeft
    }
  },
	
	
	createGuid(){
		return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0;
			let v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
}

export default methods
