<!-- 表头 -->
<template>
  <div class="dy-grid__header" ref="dy-grid__header">
    <table
      class="dy-grid__table"
      :class="{
        cellResize: cellResize,
        autoHeight: _titleDeep(expandCols) > 1,
      }"
      :style="_getTableStyle()"
    >
      <!-- 列宽度调度控制 -->
      <colgroup>
        <template v-for="(col, key) in expandCols">
          <col
            v-if="_isShowCell(col)"
            :width="_colWidth(col, key)"
            :key="key"
            :data-field="col.name || col.field"
          />
        </template>
      </colgroup>

      <thead>
        <tr v-for="(deep, deepKey) in _titleDeep(expandCols)" :key="deepKey">
          <template
            v-for="(col, colKey) in _colsWithTitleDeep(cols, deepKey + 1)"
          >
            <th
              :key="colKey"
              v-if="_isShowCell(col)"
              :style="{ 'text-align': col.align || 'left' }"
              :rowspan="_titleDeep(expandCols) - deep + 1 || 1"
              :data-colIndex="expandCols.indexOf(col)"
              :data-fixed="col.fixed"
              :data-field="col.name || col.field"
              :hide="col.hide"
            >
              <div class="cell" v-if="col.type == 'checkbox'">
                <span class="checkbox-all">
                  <input type="checkbox" class="checkbox" />
                </span>
              </div>
              <div class="cell" v-else-if="col.type == 'index'">
                <span v-html="col.title"></span>
              </div>
              <div
                v-else
                class="cell"
                :style="_isEnableSort(col) ? 'padding-right:18px;' : ''"
                @click="_sort(col, expandCols.indexOf(col))"
              >
                <span v-html="col.title"></span>
                <span
                  class="dy-table-sort"
                  :dy-sort="_sortStatus(col)"
                  v-if="_isEnableSort(col)"
                >
                  <i
                    :class="{
                      'dy-edge': true,
                      'dy-table-sort-asc': true,
                      'sort-caret-select': isTop,
                    }"
                    @click.stop="_sort(col, expandCols.indexOf(col), ' asc')"
                  ></i>
                  <i
                    :class="{
                      'dy-edge': true,
                      'dy-table-sort-desc': true,
                      'sort-top-select': isBom,
                    }"
                    @click.stop="_sort(col, expandCols.indexOf(col), ' desc')"
                  ></i>
                </span>
              </div>
              <div
                class="colResize"
                :style="{ height: headerHeight + 'px' }"
              ></div>
            </th>

            <th
              :key="colKey"
              v-if="col.cols"
              :style="{ 'text-align': col.align || 'left' }"
              :colspan="_getSubColsLength(col)"
              :data-colIndex="expandCols.indexOf(col)"
              :data-field="col.name || col.field"
              :hide="col.hide"
            >
              <div class="cell" v-html="col.title"></div>
            </th>
          </template>
        </tr>
      </thead>
    </table>

    <!-- 拖动线 -->
    <div
      class="dy-table__resize-proxy"
      v-show="resizeProxyRight"
      :style="{ left: resizeProxyRight }"
    ></div>
    <div
      class="dy-table__resize-proxy"
      v-show="resizeProxyLeft"
      :style="{ left: resizeProxyLeft }"
    ></div>
  </div>
</template>

<script>
import { eventDelegation } from "@/utils/index.js";
import method from "./method.js";

export default {
  name: "table-header",
  data() {
    return {
      resizeProxyLeft: 0,
      resizeProxyRight: 0,
      sortColIndex: -1,
      isTop: false,
      isBom: false,
      Val: "",
    };
  },
  mixins: [method],
  props: {
    cols: {
      type: Array,
      default: function () {
        return [];
      },
    },
    expandCols: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 是否显示滚动条
    isShowScroll: {
      type: Boolean,
      default: false,
    },
    // 是否允许拖动行
    cellResize: {
      type: Boolean,
      default: false,
    },
    // 总宽度
    colsTotalWidth: [Number],
    // 表格宽度
    tableWidth: [Number, String],
    // 滚动条宽度
    bodyScrollWidth: {
      type: Number,
      default: 17,
    },
    //偏移距离
    bodyRollingDistance: {
      type: Number,
      default: 0,
    },
    // 左右固定表格的宽度
    leftFixedTableWidth: [Number],
    rightFixedTableWidth: [Number],
    // 左右固列的根数
    leftFixedColumnLength: [Number],
    rightFixedColumnLength: [Number],
    //滚动条左距离
    scrollLeft: {
      type: Number,
      default: 0,
    },
    // 显示复选框
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    // 是否选中所有
    isCheckedAll: {
      type: Boolean,
      default: false,
    },
    //排序模式
    enableAllSort: [Boolean, String],
    sort: {
      type: String,
      default: "",
    },
  },
  computed: {},
  watch: {
    scrollLeft(newVal, oidVal) {
      // 更新横向滚动位置
      this._updateScrollLeft();
    },
    isCheckedAll(newVal, oidVal) {
      // 更新选中所有状态
      this._updateCheckedAllState();
    },
  },
  mounted() {
    this._updateCheckedAllState();
    this._initEvent();
  },
  methods: {
    //获取表格样式
    _getTableStyle() {
      let style = `width:${this.headerWidth};`;
      style += `padding-right:${this.bodyScrollWidth}px;`;
      if (this.rightFixedColumnLength) {
        let left =
          parseInt(this.tableWidth) -
          this.rightFixedTableWidth +
          this.bodyScrollWidth +
          1;
        style += `margin-left:-${left}px;`;
      }
      return style;
    },
    // 更新横向滚动位置
    _updateScrollLeft() {
      if (!this.rightFixedColumnLength && !this.leftFixedColumnLength) {
        this.$nextTick(() => {
          let $header = this.$refs["dy-grid__header"];
          if ($header) {
            $header.scrollLeft = this.scrollLeft;
          }
        });
      }
    },
    // 更新选中所有状态
    _updateCheckedAllState() {
      this.$nextTick(() => {
        let $header = this.$refs["dy-grid__header"];
        let $headerCheckbox = $header.querySelector(".checkbox");
        if ($headerCheckbox) {
          $headerCheckbox.checked = this.isCheckedAll;
        }
      });
    },
    // 是否启用排序
    _isEnableSort(col) {
      if (this.enableAllSort && String(col.sort) != "true") {
        return false;
      } else if (!this.enableAllSort && String(col.sort) == "true") {
        return true;
      } else {
        return true;
      }
    },
    // 排序状态
    _sortStatus(col) {
      let sorts = this.sort.split(".");
      let colIndex = this.expandCols.indexOf(col);
      if (sorts[0] == col.name && this.sortColIndex == colIndex) {
        return sorts[1];
      } else {
        return "";
      }
    },
    // 排序
    _sort(col, colIndex, sort) {
      let sortVal = "";
      if (this._isEnableSort(col) && col.field) {
        if (sort) {
          this.descSort(col.field, sort);
          sortVal = col.field + sort;
        } else {
          let sorts = this.sort.split(" ");
          if (sorts[0] == col.field && sorts[1] == "asc") {
            sortVal = col.field + " desc";
          } else {
            sortVal = col.field + " asc";
          }
        }
        this.sortColIndex = colIndex;
        let str = this.Val;
        let val = str.substring(1);
        let arr = val.split(",");
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr.length > 1) {
            if (arr[i].split(" ")[0].indexOf(arr[i + 1].split(" ")[0]) != -1) {
              arr.splice(i, 1);
            }
          }
        }
        this.$emit("sort", arr.join(","));
      }
    },
    // 积累排序条件
    descSort(val, sort) {
      let sortVal = val + sort;
      this.Val += "," + sortVal;
    },
    getOffset(ele) {
      let result = {
        top: 0,
        left: 0,
      };
      if (!ele.getClientRects().length) {
        return result;
      }
      if (window.getComputedStyle(ele)["display"] === "none") {
        return result;
      }
      result = ele.getBoundingClientRect();
      let document = ele.ownerDocument.documentElement;
      return {
        top: result.top + window.pageYOffset - document.clientTop,
        left: result.left + window.pageXOffset - document.clientLeft,
      };
    },
    // 初始事件
    _initEvent() {
      this.$nextTick(function () {
        var that = this;

        let $header = that.$refs["dy-grid__header"];

        //禁止选中文本
        $header.onselectstart = $header.ondrag = function () {
          return false;
        };

        // 添加标题
        eventDelegation($header, "mouseover", "div.cell", function (e, el) {
          let isOverflow = el.scrollWidth > el.parentNode.scrollWidth;
          if (isOverflow && !el.getAttribute("title")) {
            el.setAttribute("title", el.innerText);
          } else if (!isOverflow && el.getAttribute("title")) {
            el.removeAttribute("title");
          }
        });

        // 头部大小拖动调整宽度事件
        $header.onmousedown = (e) => {
          let cols = that.expandCols;
          let headerLeft = this.getOffset($header).left;
          let disX = e.clientX - headerLeft;
          let index = e.target.parentNode.getAttribute("data-colindex");
          let parentNodeWidth = e.target.parentNode.offsetWidth;
          let colsWidth = 0;
          let Left = 0;
          let leftDeviation =
            parseInt(that.tableWidth) -
            that.rightFixedTableWidth -
            that.bodyRollingDistance +
            that.bodyScrollWidth;

          if (e.target.className == "colResize") {
            colsWidth = parseInt(
              cols[index].width || cols[index].minWidth || 0
            );
            if (that.rightFixedColumnLength) {
              that.resizeProxyLeft =
                disX - parentNodeWidth - 0 - leftDeviation + "px";
              that.resizeProxyRight = disX - 0 - leftDeviation + "px";
            } else {
              that.resizeProxyLeft = disX - parentNodeWidth - 0 + "px";
              that.resizeProxyRight = disX - 0 + "px";
            }

            document.onmousemove = (ev) => {
              Left = ev.clientX - disX - headerLeft;
              if (
                that.rightFixedColumnLength &&
                (index || index === 0) &&
                that.cellResize
              ) {
                that.resizeProxyRight =
                  ev.clientX - leftDeviation - headerLeft + "px";
              } else if ((index || index === 0) && that.cellResize) {
                that.resizeProxyRight = ev.clientX - headerLeft + "px";
              }
            };

            document.onmouseup = (e) => {
              document.onmousemove = null;
              document.onmouseup = null;
              if ((index || index === 0) && that.cellResize) {
                that.resizeProxyLeft = 0;
                that.resizeProxyRight = 0;
                cols[index].width =
                  colsWidth + Left < 30 ? 30 : colsWidth + Left;
                that.$set(cols, index, cols[index]);
              }
            };
          }
        };

        // 选中所有事件
        eventDelegation(
          $header,
          "click",
          "span.checkbox-all,.checkbox",
          function (e, el) {
            let children = el.children[0];
            let isChecked = children ? !children.checked : el.checked;
            that.$emit("checked", isChecked);
          }
        );
      });
    },
  },
};
</script>
<style >
.sort-caret-select {
  border-bottom-color: #409eff !important;
}
.sort-top-select {
  border-top-color: #409eff !important;
}
</style>
