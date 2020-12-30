export default {
	computed:{
		// 获取表头高度
		headerHeight(){
			let deep = this._titleDeep(this.expandCols);
			if(deep == 2){
				return 52;
			}else if(deep == 3){
				return 78;
			}else if(deep == 4){
				return 104;
			}else{
				return 36;
			}
		},
		// 获取表头宽度
		headerWidth(){
			let width = this.tableWidth;
			if(this.isShowScroll && width != "100%"){
				width = parseInt(width) + this.bodyScrollWidth + "px";
			}
			return width;
		},
		//获取最小宽度的索引
		minWidthIndex(){
			let minWidthIndex = 0;
			this.expandCols.forEach(function (col,index) {
				if (col.minWidth) {
					minWidthIndex = index;
				}
			});
			return minWidthIndex;
		}
	},
	methods:{
		// 展开Cols
		_expandCols: function (cols,level = 1) {
		    var newCols = [];
		    if (!cols) {
		        return newCols;
		    }
		    for (var colIndex = 0; colIndex < cols.length; colIndex++) {
		        var col = cols[colIndex];
		        if (col.cols) {
		            newCols.push(col);
		            newCols.push.apply(newCols, this._expandCols(col.cols,level ++ ));
		        } else {
		            newCols.push(col);
		        }
		    }
		    return newCols;
		},
		// 获取标题深度
		_titleDeep(cols){
			var deep = 1;
		    for (var colIndex = 0; colIndex < cols.length; colIndex++) {
		        var col = cols[colIndex];
		        if (col.cols) {
		            var newDeep = 1 + this._titleDeep(col.cols);
		            if (deep < newDeep) {
		                deep = newDeep;
		            }
		        }
		    }
		    return deep;
		},
		// 获取col宽度
		_colWidth(col,index){
			let width = col.width;
			let minWidth = col.minWidth ? (col.minWidth) / this.colsTotalWidth * 100 + "%" : '';
			if(index == this.expandCols.length - 1 && !this.minWidthIndex){
				width = minWidth;
			}else if(this.minWidthIndex == index){
				minWidth = "";
			}
			return width || minWidth || '';
		},
		// 获取显示列根数
		_getDisplayColumnLength(cols){
			let length = 0;
			cols.forEach(function (col,index) {
			    if (!col.cols && String(col.hide) != "true") {
			        length ++;
			    }
			});
			return length;
		},
		// 获取子级根数
		_getSubColsLength(col){
			let length = 0;
			if(col.cols){
				length = col.cols.length;
				col.cols.forEach(function (col,index) {
				    if (String(col.hide) == "true") {
				        length--;
				    } else if (col.cols) {
						length += col.cols.length - 1;
						col.cols.forEach(function (col,index) {
							if (String(col.hide) == "true") {
								length--;
							} else if (col.cols) {
								length += col.cols.length - 1;
							}
						});
				    }
				});
				if (length === 0) {
				    col.hide = true;
				}
			}
			return length;
		},
		// 获取对应层级的标题
		_colsWithTitleDeep: function (cols, deep) {
		    var newCols = [];
		    if (!cols) {
		        return newCols;
		    }
		    for (var colIndex = 0; colIndex < cols.length; colIndex++) {
		        var col = cols[colIndex];
				if (deep === 1) {
					newCols.push(col);
				} else {
					newCols.push.apply(newCols, this._colsWithTitleDeep(col.cols, deep - 1));
				}
		    }
		    return newCols;
		},
		//是否显示单元格
		_isShowCell(col){
			let is = true;
			if(col.cols || String(col.hide) == "true"){
				is = false;
			}
			return is;
		},
		// 获取总宽度
		_getColsWidth(cols){
			return  eval(
				cols.map(col=>{
					if(this._isShowCell(col)){
						return parseInt(col.width || col.minWidth || 0);
					}else{
						return 0;
					}
				}).join("+")
			)
		},
		// 是否存在指定列
		_isExistColumn(cols,type){
			let length = 0;
			cols.forEach(function (col,index) {
				if (col.type == type) {
					length ++ ;
				}
			});
			return length;
		},
		// 排序比较
		_sortCompare(prop,sort="asc"){
			return function (obj1, obj2) {
				var val1 = obj1[prop];
				var val2 = obj2[prop];
				if(sort=="desc"){
					if (val1 > val2) {
						return -1;
					} else if (val1 < val2) {
						return 1;
					} else {
						return 0;
					}
				}else{
					if (val1 < val2) {
						return -1;
					} else if (val1 > val2) {
						return 1;
					} else {
						return 0;
					}
				}
			}
		},
		// 创建guid
		_createGrid(){
			return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0;
				var v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		// 获取合并格式的数据
		_getMergesData(data){
			let datas = JSON.parse( JSON.stringify(data) );
			let cols= [];
			if(datas && datas[0]){
				for(let i in datas[0]){
					cols.push(i);
				}
			}
			for (let dataKey = datas.length - 1; dataKey >= 1; dataKey --) {
				let start = datas[dataKey];
                let target = datas[dataKey - 1];
				if (target.__merges == undefined) { target.__merges = {}; }
				if (start && start.__display == undefined) { start.__display = {}; }
				for (let colKey = 0; colKey < cols.length; colKey++) {
					let field = cols[colKey];
					if(target && String(start[field])==String(target[field]) && String(start[field])!=""){
						let rowSpan=1;
						if (start.__merges == undefined || start.__merges[field] == undefined) {
                            rowSpan = 2
                        } else if (start.__merges && start.__merges[field]) {
                            rowSpan = start.__merges[field] + 1;
                        }
                        target.__merges[field] = rowSpan;
                        start.__display[field] = "none";
					}
				}
			}
			return datas;
		},
    //转义html
    htmlEncode(html){
       let temp = document.createElement("div");
      (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
      var output = temp.innerHTML;
      temp = null;
      return output;
    }
	}
}
