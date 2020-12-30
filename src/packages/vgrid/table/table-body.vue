<!-- 内容区 -->
<template>
  <!-- 内容 -->
  <div class="dy-grid__body" ref="dy-grid__body" :style="tableHeight">
    <div v-html="bodyHtml" :id="bodyId"></div>
    <div
      class="dy-grid__hint"
      v-show="isShowErrorTips"
      v-text="errorTips"
    ></div>
    <div class="dy-grid__loading" v-show="showLoading">
      <div class="dy-grid__loading_git"></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { ajax, eventDelegation, dateFormat } from "@/utils/index.js";
import method from "./method.js";
import laydate from "@/utils/laydate";

export default {
  name: "table-body",
  mixins: [method],
  data() {
    return {
      bodyId: this._createGrid(),
      bodyHtml: "",
      url: "",
      overflow:'hidden'
    };
  },
  props: {
    id: String,
    data: [Array],
    expandCols: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //当前页面
    page: [Number],
    // 页面大小
    pageSize: [Number],
    //汇总行高度
    totalRowHeight: {
      type: [Number, String],
      default: 0,
    },
    //错误提示
    errorTips: [String],
    //显示加载层
    showLoading: [Boolean],
    // 是否显示复选框列
    showCheckbox: [Boolean],
    // 是否显示索引列
    showIndex: [Boolean],
    // 是否显示汇总行
    isShowTotal: [Boolean],
    // 是否显示底部滚动条
    isShowBottonScroll: [Boolean],
    // 是否显示错误提示
    isShowErrorTips: [Boolean],
    // 总宽度
    colsTotalWidth: [Number],
    // 表格宽度
    tableWidth: [String],
    // 滚动条宽度
    bodyScrollWidth: [Number],
    // 左右固定表格的宽度
    leftFixedTableWidth: [Number],
    rightFixedTableWidth: [Number],
    // 左右固列的根数
    leftFixedColumnLength: [Number],
    rightFixedColumnLength: [Number],
    //滚动条顶部距离
    scrollTop: [Number],
    //当前鼠标停留的行
    hoverRowIndex: [Number],
    //合并复选框
    mergeCheck: [String, Boolean],
    mergeIndex: [String, Boolean],
  },
  computed: {
    // 重计算表格高度
    tableHeight() {
      let height = this.headerHeight || 0;
      let style = `height:calc(100% - ${height + 1}px)`;
      if (this.isShowTotal) {
        style = `height:calc(100% - ${height + this.totalRowHeight + 1}px)`;
      }
      return style;
    },
  },
  watch: {
    data(newVal, oidVal) {
      if (JSON.stringify(newVal) != JSON.stringify(oidVal)) {
        //更新内容与选中状态
        this._loadBodyHtml();
        this._updateCheckedState();
      }
    },
    expandCols(newVal, oidVal) {
      //同步调整单元格宽度
      this._updateCellWidth();
    },
    tableWidth(newVal) {
      // 同步调整表格宽度
      this._updateTableWidth();
      //更新左边距
      this._updateTableMgLeft();
    },
    rightFixedTableWidth() {
      //更新左边距
      this._updateTableMgLeft();
    },
    hoverRowIndex(newVal, oidVal) {
      //同步调整鼠标停留的行颜色
      this._updateHoverRow(newVal);
    },
    scrollTop(newVal, oidVal) {
      //同步调整滚动条位置
      this._updateScrollTop();
    },
  },
  mounted() {
    this._loadBodyHtml();
    this._updateScrollTop();
    this._updateCheckedState();
    this._initEvent();
  },
  methods: {
    // 加载内容
    _loadBodyHtml() {
      this.__rowIndex = 0; //计算分页索引用
      this.__rowIndex__rowspan = 1; //计算分页索引用
      this.__rightFixedColumnRowKey = null;
      let key = this._createGrid();
      let html = `<table class="dy-grid__table" style="width:${this.tableWidth};" key="${key}">`;
      html += this._getColgroupHtml();
      html += "<tbody>";
      if (!this.data[0]) {
        html += `<tr class="dy-table__row empty"><td style="height:1px;"></td></tr>`;
      } else {
        let data = this._getMergesData(this.data);
        html += this._getDataRows(data);
      }
      html += "</tbody>";
      html += "</table>";
      this.bodyHtml = html;
      this._updateTableMgLeft();
      if (this.$parent && this.$parent.$parent) {
        this.$parent.$parent._viewChange();
      }
      html = null;
    },
    //获取数据行
    _getDataRows(data = []) {
      let html = "";
      let columnLength = this._getDisplayColumnLength(this.expandCols);
      let stripe = this.$parent.stripe;
      let rowClassName = this.$parent.rowClassName;
      let cellClassName = this.$parent.cellClassName;
      data.forEach((row, rowKey) => {
        let striped = stripe && rowKey % 2 == 1 ? "true" : "false";
        let className = "";
        if (typeof rowClassName === "function") {
          className = rowClassName(row, rowKey) || "";
        } else if (typeof rowClassName === "string") {
          className = rowClassName;
        }

        html += `<tr class="dy-table__row ${className}"  data-rowIndex="${rowKey}" >`;
        this.expandCols.forEach((col, colKey) => {
          if (
            this._isShowCell(col) &&
            ((this.leftFixedColumnLength && col.fixed == "left") ||
              (this.rightFixedColumnLength && col.fixed == "right") ||
              (!this.leftFixedColumnLength && !this.rightFixedColumnLength))
          ) {
            let className = "";
            if (typeof cellClassName === "function") {
              className = cellClassName(row, rowKey, col, colKey) || "";
            } else if (typeof cellClassName === "string") {
              className = cellClassName;
            }
            html += this._getCell(
              row,
              rowKey,
              col,
              colKey,
              columnLength,
              className
            );
          }
        });
        html += `</tr>`;
      });
      return html;
    },
    //获取单元格
    _getCell(row, rowKey, col, colKey, columnLength, className) {
      let html = "",
        rowspan = this._getMergesRowspan(row, col);

      //右边固定列额外添加的占位
      if (
        this.rightFixedColumnLength &&
        rowKey != this.__rightFixedColumnRowKey
      ) {
        this.__rightFixedColumnRowKey = rowKey;
        let colspan = columnLength - this.rightFixedColumnLength;
        html += `
					<td style="text-align:${col.align};" colspan="${colspan}" data-field="${col.field}">
						<div class="cell"></div>
					</td>`;
      }

      // 正常内容
      let overflow = 'hidden';
      if(col.btn) overflow = 'visible';
      else overflow = 'hidden';
      html += `
					<td style="text-align:${col.align};overflow:${overflow}" hide="${col.hide || "false"}"
						class="${className} ${col.type == "checkbox" ? "checkbox-label" : ""}"
						rowspan="${rowspan}"
						data-field="${col.field}"
					>
        `;
      //操作内容
      
      html += this._getCellData(row, rowKey, col, colKey, rowspan);
      html += `</td>`;

      //左边固定列额外添加的占位
      if (
        this.leftFixedColumnLength &&
        colKey == this.leftFixedColumnLength - 1
      ) {
        let colspan = columnLength - this.leftFixedColumnLength;
        html += `
					<td style="text-align:${col.align};" colspan="${colspan}" data-field="${col.field}">
						<div class="cell"></div>
					</td>`;
      }

      return html;
    },
    // 获取单元格数据
    _getCellData(row, rowKey, col, colKey, rowspan) {
      let that = this;
      let type = col.type;
      let dataType = col.vtype ? "dataType=" + (col.vtype || "") : "";
      let acc = col.acc || this.$parent.acc;
      let isEdit = String(
        row["_isEdit"] || row["_isedit"] || col.isEdit || col.isedit
      );
      let permil = col.enabledPermil || this.$parent.enabledPermil || false;
      let value = row[col.field] || "";
      let format = col.format || "YYYY-MM-DD";
      let nowrap = this.$parent.$parent.nowrap;
      let min = col.min || -Infinity,
        max = col.max || Infinity,
        maxLength = col.maxLength || Infinity;

      if (type == "number") {
        value = Number(value).toFixed(acc);
        value = permil ? this.$dyMethods.commafy(value) : value;
      }

      //时间类型初始化值
      if (type == "datetime") {
        value = dateFormat(format, value || "");
      }

      let html = `<div style="overflow:${this.overflow}" class="cell ${nowrap ? "space" : ""}" >`;
      if (type == "index") {
        this.__rowIndex__rowspan != 0 ? this.__rowIndex++ : "";
        this.__rowIndex__rowspan = rowspan;
        let rowIndex = col.merge ? this.__rowIndex : rowKey + 1;
        html += `${rowIndex + (this.page - 1) * this.pageSize}`;
      } else if (type == "checkbox") {
        html += `<input type="checkbox" class="checkbox">`;
      }
      //数字类型
      else if (type == "number" && isEdit == "true") {
        html += `
						<input type="text" class="dy-edit"
							data-type="number"
							name="${col.name}"
							align="${col.align}"
							value="${value}"
							acc="${acc}"
							min="${min}"
							max="${max}"
							maxlength="${maxLength}"
							permil="${permil}"
							${isEdit != "true" ? "disabled" : ""}
              ${dataType}
						/>
					`;
      }
      //下拉类型
      else if (type == "select" && isEdit == "true") {
        let data = [];
        if (!this._selectData) {
          this._selectData = {};
        }
        if (this._selectData[col.name]) {
          data = this._selectData[col.name];
        } else if (String(col.data).indexOf("/") != -1) {
          this._selectData[col.name] = [];
          data = this._getUrldata(col.data);
          this._selectData[col.name] = data;
        } else {
          data = eval(col.data);
        }
        let options = data
          .map((h) => {
            let selected =
              String(value).indexOf(h.value) != -1 ? "selected" : "";
            return `<option value="${h.value}" ${selected}>${h.text}</option>`;
          })
          .join("");
        html += `
						<select class='dy-edit' name="${col.name}" ${dataType}>${options}</select>
					`;
      }
      //时间类型
      else if (type == "datetime" && isEdit == "true") {
        let min = col.min || "1900-01-01 00:00:00";
        let max = col.max || "2099-12-31 23:59:59";
        let istime = String(format).indexOf("h") != -1 ? true : false;
        html += this._removeTrim(`
						<input class="dy-edit laydate-icon dy_table_datetime" readonly
              data-type='datetime'
							format="${format}"
							value="${value}"
							name="${col.name}"
              align="${col.align}"
							ignore = "${col.ignore && col.ignore == "true" ? "ignore" : ""}"
              min = "${min}"
              max = "${max}"
              istime="${istime}"
							${dataType}
						/>
					`);
      }
      // 查找类型
      else if (type == "lookup" && isEdit == "true") {
        html += `
          	<div class="dy_table_lookup">
              <input type="text" class="dy-edit" readonly
                value="${value}"
                name="${col.name}"
                align="${col.align}"
                ignore = "${col.ignore && col.ignore == "true" ? "ignore" : ""}"
                ${dataType}
              >
              <a class="dy_table_lookup_btn" click="${
                col.click || ""
              }" data-rowindex="${rowKey}">+</a>
            </div>
          `;
      }
      //操作类型
      else if (type == "btn") {

        let text = col.btn,btn;
        let more = "";
        html = '<div style="overflow:visible" class="cell " >'
        text.forEach(function (eve) {
          if(eve.btn) {
            eve.btn.forEach(function(e){
               more += `<li>${e.name}</li>`
            })
          }
          html += `
          		<a class="dy-bar"  style="margin:0 4px;"
                field="${col.field}"
                data-rowindex="${rowKey}"
                click="${eve.click}"
              ><span>${eve.name}</span>
              ${eve.btn ? '<ul class="dy-ul">'+ more +'</ul>' : ''}     
              </a>
          	`;
        });
      }

      // link 类型
      else if (type == "link") {
        let url = String(col.url).split("?"),
          blank = "",
          click = "";
        this.url = that._getLinkUrl(url, row);
        this.url == "#" ? (blank = "") : (blank = "_blank");
        col.click == "" ? (click = "") : (click = col.click);
        html += `
			 <a  
			 class="dy-edit-link dy-url-link" 
			 target="${blank}" 
			 href="${that._getLinkUrl(url, row)}" 
			 style="margin:0 4px;"
			 click="${click}"
			 data-rowindex="${rowKey}"
			 
			 >${value}</a>
			`;
      }
      //函数类型
      else if (
        type &&
        that.$parent.$parent.$parent &&
        that.$parent.$parent.$parent[type]
      ) {
        let typeFn = that.$parent.$parent.$parent[type];
        if (typeof typeFn !== "function") {
          console.error("自定义类型必须是已定义好的方法！");
        } else {
          html += `
            <div class="dy-edit-Fntype dy-add-mount"
              data-fun='${type}' name="${col.name}"
              data-colIndex='${colKey}'
            >${typeFn(row, rowKey, col, colKey)}</div>`;
        }
      }
      // 图片类型
      else if (type == "valid") {
        html += `
          <svg class="icon">
            <use xlink:href="${
              ["是", "1", 1].indexOf(value) != -1 ? "#icongou" : "#iconx"
            }"></use>
          </svg>`;
      }
      // 图片类型
      else if (type == "img") {
        html += `<img class="dy-grid-img" src='${value}' /> `;
      }
      // 可编辑模式-空类型
      else if (isEdit == "true") {
        html += `
						<input type="text" class="dy-edit"
              name="${col.name}"
							align="${col.align}"
							value="${value}"
							maxlength="${maxLength}"
							${dataType}
						/>
					`;
      } else if (type == "html") {
        html += `${value}`;
      } else {
        html += `${that.htmlEncode(value)}`;
      }
      return (html += "</div>");
    },

    //获取link类型 url 地址参数
    _getLinkUrl(url, row) {
      var str = "";
      if (url.length > 1) {
        let params = url[1].split("&");
        let obj = {};
        params.forEach(function (p) {
          let params = p.split("=");
          let key = params[0];
          let value = row[params[1].match(/{(\S*)}/)[1]];
          obj[key] = value;
        });
        for (var o in obj) {
          if (obj[o] != -1) {
            str += o + "=" + obj[o] + "&";
          }
        }
        var str = str.substring(0, str.length - 1);
        return url[0] + "?" + str;
      } else {
        if (url[0] == "undefined") return "#";
        else return url[0];
      }
    },
    // 获取url数据 返回格式 ：{data: [{text:1,value:1}]}
    _getUrldata(url) {
      let that;
      let data = [];
      ajax({
        url: url,
        sync: false,
        method: "POST",
        dataType: "json",
        timeout: 0,
        success: function (res) {
          //成功返回回调
          data = (res && res.data) || [];
        },
        error: function (err, xhr) {
          //错误信息回调
          let responseText = xhr.responseText || "";
          let titleIndex1 = responseText.indexOf("<title>", 0) + 7;
          let titleIndex2 = responseText.indexOf("</title>", 0);
          let errText =
            responseText.substring(titleIndex1, titleIndex2) || xhr.statusText;
          let errorTips = "报错信息： " + errText + "，状态码是：" + xhr.status;
          console.error(errorTips);
        },
      });
      return data;
    },
    // 去除空格
    _removeTrim(txt) {
      return txt
        .replace(/undefined/g, "")
        .replace(/[\r\n]/g, "")
        .replace(/\ +/g, " ");
    },
    // 获取ColgroupHtml
    _getColgroupHtml(isData) {
      let cols = [];
      let colgroupHtml = "<colgroup>";
      this.expandCols.forEach((col, index) => {
        if (this._isShowCell(col)) {
          let width = this._colWidth(col, index);
          cols.push(width);
          colgroupHtml += `<col width="${width}">`;
        }
      });
      colgroupHtml += "</colgroup>";

      return isData ? cols : colgroupHtml;
    },
    // 获取合并rowspan
    _getMergesRowspan(row, col) {
      let rowspan = 1;
      let merge = String(col.merge);
      if (merge == "true" || row[merge] !== undefined) {
        merge = row[merge] !== undefined ? merge : col.name;
        if (row.__merges) {
          rowspan = row.__merges[merge] || rowspan;
        }
        if (row.__display) {
          rowspan = row.__display[merge] == "none" ? 0 : rowspan;
        }
      }
      return rowspan;
    },
    //获取事件
    _getEvent(eve, row, rowIndex) {
      let edittype = String(eve);
      let eventName = "";
      let param = "";
      let $event = "";
      let leftIndex = edittype.indexOf("(");
      let rightIndex = edittype.indexOf(")");
      if (leftIndex != -1) {
        eventName = edittype.substring(edittype.indexOf("=") + 1, leftIndex);
        param = edittype.substring(leftIndex + 1, rightIndex).split(",");
        param = param.map(function (h) {
          let param = "";
          if (row[h] != undefined) {
            param = row[h];
          } else if (h == "rowIndex") {
            param = rowIndex;
          } else if (h == "row") {
            param = row;
          } else {
            param = h;
          }
          return param;
        });
        $event = eventName + "(" + param + ")";
      }
      return {
        event: $event,
        eventName: eventName,
        param: param,
      };
    },
    //获取事件标题
    _getEventTitle(eve, row, col) {
      return eve || "编辑";
    },
    // 更新表格宽度
    _updateTableWidth() {
      this.$nextTick(function () {
        let $body = this.$refs["dy-grid__body"];
        let $table = $body.querySelector(".dy-grid__table");
        if ($table) {
          $table.style.width = this.tableWidth;
        }
      });
    },
    // 更新表格左边距
    _updateTableMgLeft() {
      if (this.rightFixedColumnLength) {
        this.$nextTick(function () {
          let $body = this.$refs["dy-grid__body"];
          let $table = $body.querySelector(".dy-grid__table");
          let left =
            parseInt(this.tableWidth) -
            this.rightFixedTableWidth +
            this.bodyScrollWidth +
            1;
          if ($table) {
            $table.style.marginLeft = -left + "px";
          }
        });
      }
    },
    // 更新单元格宽度
    _updateCellWidth() {
      this.$nextTick(function () {
        let $colgroup = this.$refs["dy-grid__body"].querySelector("colgroup");
        let colsData = this._getColgroupHtml(true);
        if ($colgroup) {
          let $allCol = $colgroup.querySelectorAll("col");
          if ($allCol) {
            for (var i = 0; i < $allCol.length; i++) {
              $allCol[i].setAttribute("width", colsData[i]);
            }
          }
        }
      });
    },
    //更新选中状态
    _updateCheckedState() {
      this.$nextTick(() => {
        let $body = this.$refs["dy-grid__body"];
        let $bodyRow = $body.querySelectorAll(".dy-table__row");
        let $bodyCheckbox = $body.querySelectorAll(".checkbox");
        let checkedNum = 0;
        let dataLenght = 0;
        this.data.forEach((h, index) => {
          dataLenght++;
          let isChecked = h._isChecked;
          if (this.showCheckbox && $bodyCheckbox[index]) {
            $bodyCheckbox[index].checked = isChecked;
          }
          if (isChecked) {
            checkedNum++;
            $bodyRow[index].classList.add("current-row");
          } else {
            $bodyRow[index].classList.remove("current-row");
          }
        });
        return checkedNum == dataLenght;
      });
    },
    //更新当前鼠标所停留的行
    _updateHoverRow(index) {
      this.$nextTick(() => {
        let $body = this.$refs["dy-grid__body"];
        if ($body) {
          let $hoverRow = $body.querySelector(`tr.hover-row`);
          let $thatRow = $body.querySelector(`tr[data-rowindex='${index}']`);
          if ($hoverRow) {
            $hoverRow.classList.remove("hover-row");
          }
          if ($thatRow) {
            $thatRow.classList.add("hover-row");
          }
        }
      });
    },
    //更新滚动条位置
    _updateScrollTop() {
      if (this.isShowBottonScroll) {
        this.$nextTick(() => {
          let $body = this.$refs["dy-grid__body"];
          if ($body && $body.scrollTop != this.scrollTop) {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
              setTimeout(() => {
                $body.scrollTop = this.scrollTop;
              }, 5);
            } else {
              $body.scrollTop = this.scrollTop;
            }
          }
        });
      }
    },
    // 初始事件
    _initEvent() {
      let that = this;
      let timeoutRowClick = null;
      this.$nextTick(function () {
        let $body = that.$refs["dy-grid__body"];

        //ie下因为设置滚动宽度，所以左边冻结列不能显示滚动条，也就不能滚动
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          if (this.leftFixedColumnLength) {
            $body.style.overflowY = "hidden";
          }
        }

        //监听输入框事件
        //输入
        eventDelegation($body, "input", "input.dy-edit", function (e, el) {
          let rowIndex = el.parentNode.parentNode.parentNode.getAttribute(
            "data-rowindex"
          );
          let field = el.parentNode.parentNode.getAttribute("data-field");
          let oidValue = that.data[rowIndex][field];
          that.$dyMethods.oninput(e);
          that.$emit(
            "editInput",
            e,
            field,
            Number(el.value),
            Number(oidValue),
            rowIndex
          );
        });

        // 失去焦点
        eventDelegation(
          $body,
          "blur",
          "input.dy-edit",
          function (e, el) {
            let rowIndex = el.parentNode.parentNode.parentNode.getAttribute(
              "data-rowindex"
            );
            let field = el.parentNode.parentNode.getAttribute("data-field");
            that.$dyMethods.onblur(e);
          },
          true
        );

        // 获取焦点
        eventDelegation(
          $body,
          "focus",
          "input.dy-edit",
          function (e, el) {
            that.$dyMethods.onfocus(e);
            that.$emit("editFocus", e, el);
          },
          true
        );

        //下拉框选择事件
        eventDelegation(
          $body,
          "change",
          "select.dy-edit",
          function (e, el) {
            let rowIndex = el.parentNode.parentNode.parentNode.getAttribute(
              "data-rowindex"
            );
            let field = el.parentNode.parentNode.getAttribute("data-field");
            setTimeout(function () {
              clearInterval(timeoutRowClick);
            }, 10);
            that.$emit("editInput", e, field, el.value, null, rowIndex);
          },
          true
        );

        //添加滚动条监听事件
        $body.addEventListener(
          "scroll",
          (e) => {
            if (this.rightFixedColumnLength || this.leftFixedColumnLength) {
              that.$emit("scroll", false, $body.pageYOffset || $body.scrollTop);
            } else {
              that.$emit(
                "scroll",
                $body.scrollLeft,
                $body.pageYOffset || $body.scrollTop
              );
            }
          },
          true
        );

        // 动态添加标题
        eventDelegation(
          $body,
          "mouseover",
          "div.cell,.dy-edit",
          function (e, el) {
            let isOverflow = el.scrollWidth > el.parentNode.scrollWidth;
            if (String(el.className).indexOf("dy-edit") != -1) {
              isOverflow = el.scrollWidth + 6 > el.parentNode.scrollWidth;
            }
            if (isOverflow && !el.getAttribute("title")) {
              el.setAttribute("title", el.innerText || el.value);
            } else if (!isOverflow && el.getAttribute("title")) {
              el.removeAttribute("title");
            }
          }
        );

        // 动态更新自定义类型
        eventDelegation(
          $body,
          "mouseover",
          "div.dy-add-mount",
          function (e, el) {
            let $parent = that.$parent.$parent.$parent;
            let myTemplate = Vue.extend({
              template: el.innerHTML,
              data() {
                return {
                  slApp: $parent,
                };
              },
              methods: { ...$parent.$options.methods },
            });
            el.innerHTML = "";
            el.appendChild(new myTemplate().$mount().$el);
            el.classList.remove("dy-add-mount");
          }
        );

        // 鼠标经过行颜色
        eventDelegation(
          $body,
          "mousemove",
          "tr.dy-table__row",
          function (e, el) {
            let rowindex = el.getAttribute("data-rowindex");
            if (rowindex != that.hoverRowIndex && rowindex) {
              let hoverRowIndex = el.getAttribute("data-rowindex");
              that.$emit("hoverRow", Number(hoverRowIndex));
            }
          },
          function () {
            if (that.hoverRowIndex != -1) {
              that.$emit("hoverRow", -1);
            }
          }
        );
        $body.onmouseleave = function (e) {
          if (that.hoverRowIndex != -1) {
            that.$emit("hoverRow", -1);
          }
        };

        //添加滚动条监听事件
        $body.addEventListener(
          "scroll",
          (e) => {
            if (this.rightFixedColumnLength || this.leftFixedColumnLength) {
              that.$emit("scroll", false, $body.pageYOffset || $body.scrollTop);
            } else {
              that.$emit(
                "scroll",
                $body.scrollLeft,
                $body.pageYOffset || $body.scrollTop
              );
            }
          },
          true
        );

        //按钮类型点击事件
        eventDelegation(
          $body,
          "click",
          "a.dy-edit-link,a.dy_table_lookup_btn",
          function (e, el) {
            if (el.getAttribute("click")) {
              let index = el.getAttribute("data-rowindex");
              let rowIndex = index
                ? index
                : el.parentNode.parentNode.parentNode.getAttribute(
                    "data-rowindex"
                  );
              let row = that.data[rowIndex];
              let obj = that._getEvent(el.getAttribute("click"), row, rowIndex);
              let param = obj.param;
              let parentEventName = that.$parent.$parent.$parent[obj.eventName];
              if (parentEventName) {
                parentEventName(
                  param[0],
                  param[1],
                  param[2],
                  param[3],
                  param[4],
                  param[5],
                  param[6]
                );
              } else if (window[obj.eventName]) {
                eval(
                  window[obj.eventName](
                    param[0],
                    param[1],
                    param[2],
                    param[3],
                    param[4],
                    param[5],
                    param[6]
                  )
                );
              }
            }
          }
        );

        // link 点击事件
        eventDelegation($body, "click", "a.dy-url-link", function (e, el) {
          //console.log(el);
        });

        //时间控件
        eventDelegation(
          $body,
          "click",
          "input.dy_table_datetime",
          function (e, el) {
            if (!el.getAttribute("disabled")) {
              let rowIndex = el.parentNode.parentNode.parentNode.getAttribute(
                "data-rowindex"
              );
              let field = el.parentNode.parentNode.getAttribute("data-field");
              if (!el.getAttribute("disabled")) {
                window.laydate({
                  elem: el, //需显示日期的元素选择器
                  format: el.getAttribute("format"),
                  istime:
                    el.getAttribute("format").indexOf("hh") == -1
                      ? false
                      : true,
                  min: el.getAttribute("min") || "",
                  max: el.getAttribute("max") || "",
                  choose: function (value) {
                    that.$emit(
                      "editInput",
                      e,
                      field,
                      value,
                      null,
                      rowIndex,
                      "datetime"
                    );
                  },
                });
              }
            }
          }
        );

        //图片放大事件
        eventDelegation($body, "click", "img.dy-grid-img", function (e, el) {
          let a = document.createElement("a");
          a.setAttribute("href", el.getAttribute("src"));
          a.setAttribute("target", "_blank");
          a.click();
        });

        // 单击事件
        eventDelegation(
          $body,
          "click",
          ".dy-table__row,select.dy-edit",
          function (e, el) {
            let rowIndex = el.sectionRowIndex;
            let row = that.data[rowIndex];
            clearInterval(timeoutRowClick);
            timeoutRowClick = setTimeout(function () {
              that.$parent.$parent.$emit("row-click", row, rowIndex, el);
              that.$parent.$parent.$emit("rowClick", row, rowIndex, el);
            }, 200);
          }
        );

        // 双击事件
        eventDelegation($body, "dblclick", ".dy-table__row", function (e, el) {
          clearInterval(timeoutRowClick);
          let rowIndex = el.sectionRowIndex;
          let row = that.data[rowIndex];
          that.$parent.$parent.$emit("row-dblclick", row, rowIndex, el);
          that.$parent.$parent.$emit("rowDblClick", row, rowIndex, el);
        });

        //选中事件
        eventDelegation(
          $body,
          "click",
          ".dy-table__row,.checkbox-label,.checkbox",
          function (e, el) {
            if (String(el.className).indexOf("empty") != -1) {
              return false;
            }
            let className = String(el.className);
            let isChecked,
              rowIndex,
              row = {};
            let mergeNama =
              that.showCheckbox && that.mergeCheck ? that.mergeCheck : "";
            if (
              className.indexOf("checkbox-label") != -1 ||
              className.indexOf("checkbox") != -1
            ) {
              if (el.tagName == "INPUT") {
                isChecked = !el.checked;
                rowIndex = el.parentNode.parentNode.parentNode.sectionRowIndex;
              } else {
                isChecked = el.querySelector(".checkbox").checked;
                rowIndex = el.parentNode.sectionRowIndex;
              }
              row = that.data[rowIndex];
              that.data.forEach((h, key) => {
                if (rowIndex == key) {
                  h._isChecked = !isChecked;
                } else if (
                  mergeNama &&
                  h[mergeNama] &&
                  h[mergeNama] == row[mergeNama]
                ) {
                  h._isChecked = !isChecked;
                } else {
                  h._isChecked = h._isChecked || false;
                }
              });
            } else if (
              el.tagName == "TR" &&
              className.indexOf("dy-table__row") != -1
            ) {
              let $checkbox = el.querySelector(".checkbox");
              if ($checkbox) {
                isChecked = !that.showCheckbox ? false : $checkbox.checked;
              }
              rowIndex = el.sectionRowIndex;
              row = that.data[rowIndex];
              that.data.forEach((h, key) => {
                if (rowIndex == key) {
                  h._isChecked = e.ctrlKey ? !isChecked : true;
                } else if (
                  mergeNama &&
                  h[mergeNama] &&
                  h[mergeNama] == row[mergeNama]
                ) {
                  h._isChecked = e.ctrlKey ? !isChecked : true;
                } else if (!e.ctrlKey || !that.showCheckbox) {
                  // 按下ctrl 时进行多选
                  h._isChecked = false;
                } else {
                  h._isChecked = h._isChecked || false;
                }
              });
            }
            that.$emit("checked", el);
          }
        );
      });
    },
  },
};
</script>
<style lang="scss" scoped>


</style>
