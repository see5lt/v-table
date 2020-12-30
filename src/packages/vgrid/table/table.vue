<template>
  <div :id="id" :style-border="border" ref="tableWarp">
    <!-- 表头 -->
    <tableHeader
      ref="tableHeader"
      :cols="newCols"
      :cellResize="cellResize"
      :expandCols="expandCols"
      :tableWidth="tableWidth"
      :bodyScrollWidth="bodyScrollWidth"
      :colsTotalWidth="colsTotalWidth"
      :scrollLeft="scrollLeft"
      :isShowScroll="isShowRightScroll"
      :isCheckedAll="isCheckedAll"
      :enableAllSort="enableAllSort"
      :sort="sort"
      @checked="_checkedAllFn"
      @sort="_sort"
    ></tableHeader>

    <!-- 内容 -->
    <tableBody
      ref="tableBody"
      :id="id"
      :data="data"
      :expandCols="expandCols"
      :errorTips="errorTips"
      :isShowErrorTips="isShowErrorTips"
      :showLoading="showLoading"
      :totalRowHeight="totalRowHeight"
      :isShowTotal="isShowTotal"
      :isShowBottonScroll="isShowBottonScroll"
      :tableWidth="tableWidth"
      :scrollTop="scrollTop"
      :colsTotalWidth="colsTotalWidth"
      :showCheckbox="showCheckbox"
      :showIndex="showIndex"
      :hoverRowIndex="hoverRowIndex"
      :page="page"
      :page-size="pageSize"
      :mergeCheck="mergeCheck"
      :mergeIndex="mergeIndex"
      @hoverRow="_hoverRow"
      @scroll="_bodyScroll"
      @checked="_updateChecked"
      @editInput="_editInput"
    ></tableBody>

    <!-- 合计行 -->
    <tableFooter
      :data="data"
      :summary="summary"
      :expandCols="expandCols"
      :totalRowHeight="totalRowHeight"
      :isShowScroll="isShowRightScroll"
      :tableWidth="tableWidth"
      :bodyScrollWidth="bodyScrollWidth"
      :colsTotalWidth="colsTotalWidth"
      :scrollLeft="scrollLeft"
      :showCheckbox="showCheckbox"
      :showIndex="showIndex"
      :totalRowTitle="totalRowTitle"
      v-if="isShowTotal"
    ></tableFooter>

    <!-- 左边冻结列 - 只有宽度大于0且存在底部滚动条的时候才显示 -->
    <template v-if="leftFixedTableWidth && isShowBottonScroll">
      <div class="dy-grid__fixed left shadow" :style="_bodyStyle('left')">
        <tableHeader
          :cols="newCols"
          :cellResize="cellResize"
          :expandCols="expandCols"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :colsTotalWidth="colsTotalWidth"
          :leftFixedTableWidth="leftFixedTableWidth"
          :leftFixedColumnLength="leftFixedColumnLength"
          :scrollLeft="0"
          :isShowScroll="isShowRightScroll"
          :isCheckedAll="isCheckedAll"
          :enableAllSort="enableAllSort"
          :sort="sort"
          @checked="_checkedAllFn"
          @sort="_sort"
        ></tableHeader>
        <tableBody
          ref="leftTableBody"
          :id="id"
          :data="data"
          :expandCols="expandCols"
          :headerHeight="headerHeight"
          :scrollTop="scrollTop"
          :isShowTotal="isShowTotal"
          :isShowBottonScroll="isShowBottonScroll"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :colsTotalWidth="colsTotalWidth"
          :leftFixedTableWidth="leftFixedTableWidth"
          :leftFixedColumnLength="leftFixedColumnLength"
          :showCheckbox="showCheckbox"
          :showIndex="showIndex"
          :hoverRowIndex="hoverRowIndex"
          :page="page"
          :page-size="pageSize"
          :mergeCheck="mergeCheck"
          :mergeIndex="mergeIndex"
          @scroll="_bodyScroll"
          @hoverRow="_hoverRow"
          @checked="_updateChecked"
          @editInput="_editInput"
        ></tableBody>
      </div>
      <div
        class="dy-grid__footer__fixed left shadow"
        :style="_footerStyle('left')"
        v-if="isShowTotal"
      >
        <tableFooter
          :data="data"
          :summary="summary"
          :expandCols="expandCols"
          :totalRowHeight="totalRowHeight"
          :isShowScroll="isShowRightScroll"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :colsTotalWidth="colsTotalWidth"
          :leftFixedTableWidth="leftFixedTableWidth"
          :leftFixedColumnLength="leftFixedColumnLength"
          :showCheckbox="showCheckbox"
          :showIndex="showIndex"
          :totalRowTitle="totalRowTitle"
        ></tableFooter>
      </div>
    </template>

    <template v-if="rightFixedTableWidth && isShowBottonScroll">
      <div class="dy-grid__fixed right shadow" :style="_bodyStyle('right')">
        <tableHeader
          :cols="newCols"
          :expandCols="expandCols"
          :cellResize="cellResize"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :bodyRollingDistance="bodyRollingDistance"
          :colsTotalWidth="colsTotalWidth"
          :rightFixedTableWidth="rightFixedTableWidth"
          :rightFixedColumnLength="rightFixedColumnLength"
          :scrollLeft="scrollLeft"
          :isShowScroll="isShowRightScroll"
          :isCheckedAll="isCheckedAll"
          :enableAllSort="enableAllSort"
          :sort="sort"
          @checked="_checkedAllFn"
          @sort="_sort"
        ></tableHeader>
        <tableBody
          ref="rightTableBody"
          :id="id"
          :data="data"
          :expandCols="expandCols"
          :headerHeight="headerHeight"
          :scrollTop="scrollTop"
          :isShowTotal="isShowTotal"
          :isShowBottonScroll="isShowBottonScroll"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :colsTotalWidth="colsTotalWidth"
          :showCheckbox="showCheckbox"
          :showIndex="showIndex"
          :hoverRowIndex="hoverRowIndex"
          :rightFixedTableWidth="rightFixedTableWidth"
          :rightFixedColumnLength="rightFixedColumnLength"
          :page="page"
          :page-size="pageSize"
          :mergeCheck="mergeCheck"
          :mergeIndex="mergeIndex"
          @scroll="_bodyScroll"
          @hoverRow="_hoverRow"
          @checked="_updateChecked"
          @editInput="_editInput"
        ></tableBody>
      </div>
      <div
        class="dy-grid__footer__fixed right shadow"
        :style="_footerStyle('right')"
        v-if="isShowTotal"
      >
        <tableFooter
          :data="data"
          :summary="summary"
          :expandCols="expandCols"
          :totalRowHeight="totalRowHeight"
          :isShowScroll="isShowRightScroll"
          :tableWidth="tableWidth"
          :bodyScrollWidth="bodyScrollWidth"
          :colsTotalWidth="colsTotalWidth"
          :rightFixedTableWidth="rightFixedTableWidth"
          :rightFixedColumnLength="rightFixedColumnLength"
          :showCheckbox="showCheckbox"
          :showIndex="showIndex"
          :totalRowTitle="totalRowTitle"
        ></tableFooter>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { dateFormat } from "@/utils/index.js";
import tableHeader from "./table-header.vue";
import tableBody from "./table-body.vue";
import tableFooter from "./table-footer.vue";
import method from "./method.js";

export default {
  name: "v-table",
  components: {
    tableHeader,
    tableBody,
    tableFooter,
  },
  mixins: [method],
  data() {
    return {
      id: this._createGrid(),
      data: [],
      newCols: [],
      expandCols: [],
      tableWidth: "100%", //表格宽度
      bodyScrollWidth: 0, //内容区滚动条的宽度
      bodyRollingDistance: 0, //内容区滚动条的可滚动距离
      scrollLeft: 0, //滚动条左边距离
      scrollTop: 0, //滚动条顶部距离
      hoverRowIndex: -1, //当前鼠标停留的行
      isShowRightScroll: false, //是否显示右边滚动条
      isShowBottonScroll: false, //是否显示底部滚动条
      isShowErrorTips: true, //是否显示错误提示
      isCheckedAll: false, //是否选中所有
      leftFixedTableWidth: 0, //左固定列的宽度
      rightFixedTableWidth: 0, //右固定列的宽度
      leftFixedColumnLength: 0, //左固定列的根数
      rightFixedColumnLength: 0, //右固定列的根数
    };
  },
  props: {
    //配置
    cols: [Array],
    //当前页面
    page: [Number],
    // 页面大小
    pageSize: [Number],
    //显示索引行
    showIndex: [Boolean],
    //显示复选框
    showCheckbox: [Boolean],
    //许拖动行大小
    cellResize: [Boolean],
    //国定默认列
    fixedIndexColumn: [Boolean],
    //汇总行高度
    totalRowHeight: [Number],
    //汇总行标题
    totalRowTitle: [String],
    //合计值
    summary: [Object],
    //提示
    errorTips: [String],
    //启用所有排序
    enableAllSort: [Boolean],
    //当前排序
    sort: [String],
    //启用远程排序
    remoteSort: [Boolean],
    //显示加载层
    showLoading: [Boolean],
    // 合并复选框列
    mergeCheck: [String, Boolean],
    // 合并索引
    mergeIndex: [String, Boolean],
    //是否为斑马纹 table
    stripe: [Boolean],
    //是否带有纵向边框
    border: [Boolean],
    // 高亮当前行
    highlightCurrentRow: [Boolean],
    //行的 className 的回调方法
    rowClassName: [Function, String],
    //单元格的 className 的回调方法
    cellClassName: [Function, String],
    // 小数位
    acc: [Number],
    // 启用千分号
    enabledPermil: [Boolean],
  },
  computed: {
    // 获取总宽度
    colsTotalWidth() {
      return eval(
        this.expandCols
          .map((col) => {
            if (this._isShowCell(col)) {
              return parseInt(col.width || col.minWidth || 0);
            } else {
              return 0;
            }
          })
          .join("+")
      );
    },
    //是否显示合计行
    isShowTotal() {
      let showTotal = false;
      this._expandCols(this.cols).forEach((col) => {
        if (col.total && String(col.total) != "false") {
          showTotal = true;
        }
      });

      return showTotal;
    },
  },
  watch: {
    data(newVal, oidVal) {
      this.initlayout();
      // 更新提示
      if (newVal[0]) {
        this.isShowErrorTips = false;
      } else {
        this.isShowErrorTips = true;
      }
      this._updateCheckedAll();
    },
    expandCols(newVal, oidVal) {
      this.initlayout();
    },
  },
  mounted() {
    this._formatCols();
    this._monitorResize();
    this.initlayout();
  },
  methods: {
    // 格式化Cols
    _formatCols() {
      let cols = this.cols;
      // 如果存在汇总行，则必须存在复选框或索引行
      if (!this.showCheckbox && !this.showIndex && this.showTotal) {
        this.showIndex = true;
      }

      // 加载复选框
      if (this.showCheckbox && !this._isExistColumn(cols, "checkbox")) {
        cols.unshift({
          title: "",
          type: "checkbox",
          align: "center",
          width: 52,
          merge: this.mergeCheck,
          fixed: this.fixedIndexColumn ? "left" : "",
        });
      }

      // 加载索引列
      if (this.showIndex && !this._isExistColumn(cols, "index")) {
        cols.unshift({
          title: "#",
          type: "index",
          align: "center",
          width: 52,
          merge: this.mergeIndex,
          fixed: this.fixedIndexColumn ? "left" : "",
        });
      }

      //调整排序
      let left = [];
      let center = [];
      let right = [];
      cols.forEach((col) => {
        if (col.fixed == "left") {
          left.push(col);
        } else if (col.fixed == "right") {
          right.push(col);
        } else {
          center.push(col);
        }
      });

      // 新的cols与 展开层级后的cols
      this.newCols = left.concat(center, right);
      this.expandCols = this._expandCols(left.concat(center, right));

      //左右固定列的宽度与根数
      this.leftFixedColumnLength = left.length;
      this.rightFixedColumnLength = right.length;
      this.leftFixedTableWidth = this._getColsWidth(this._expandCols(left));
      this.rightFixedTableWidth = this._getColsWidth(this._expandCols(right));
    },
    //  冻结列样式
    _bodyStyle(isleft) {
      let width = 0;
      let height = this.isShowBottonScroll ? 17 : 0;
      let negative = 0;
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        negative = -2;
      }
      let style = `height:calc(100% - ${height}px);`;
      if (this.isShowTotal) {
        style = `height:calc(100% - ${
          height + this.totalRowHeight + negative
        }px);`;
      }
      if (isleft == "right") {
        width = this.rightFixedTableWidth;
      } else {
        width = this.leftFixedTableWidth;
      }
      style += `width:${width}px;`;
      return style;
    },
    // 冻结列样式
    _footerStyle(isleft) {
      let width = 0;
      let negative = 0;
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        negative = 2;
      }
      let style = `height:${this.totalRowHeight - negative}px;`;
      if (isleft == "right") {
        width = this.rightFixedTableWidth;
      } else {
        width = this.leftFixedTableWidth;
      }
      style += `width:${width}px;`;
      return style;
    },
    // 排序
    _sort(val) {
      if (String(this.remoteSort) != "true") {
        let sorts = val.split(".");
        let tableData = JSON.parse(JSON.stringify(this.data));
        this.data = tableData.sort(this._sortCompare(sorts[0], sorts[1]));
      }
      this.$emit("sort", val);
    },
    // 更新全选状态
    _updateCheckedAll() {
      let checkedNum = 0;
      this.data.forEach((h, index) => {
        if (h._isChecked) {
          checkedNum++;
        }
      });
      if (checkedNum == this.data.length) {
        this.isCheckedAll = true;
      } else {
        this.isCheckedAll = false;
      }
    },
    // 选中所有函数
    _checkedAllFn(val) {
      if (val == true) {
        this.$emit("rowSelected");
      }
      this.$nextTick((e) => {
        let $body = this.$refs["tableBody"];
        let $leftBody = this.$refs["leftTableBody"];
        let $rightBody = this.$refs["rightTableBody"];
        let data = [];
        this.data.forEach((h, index) => {
          h._isChecked = val;
        });
        this.isCheckedAll = true;
        $body._updateCheckedState();
        if ($leftBody) {
          $leftBody._updateCheckedState();
        }
        if ($rightBody) {
          $rightBody._updateCheckedState();
        }
      });
    },
    //body选中函数
    _updateChecked(el) {
      this.$nextTick((e) => {
        let $body = this.$refs["tableBody"];
        let $leftBody = this.$refs["leftTableBody"];
        let $rightBody = this.$refs["rightTableBody"];
        this.isCheckedAll = $body._updateCheckedState();
        this._updateCheckedAll();
        if ($leftBody) $leftBody._updateCheckedState();
        if ($rightBody) $rightBody._updateCheckedState();
      });
    },
    // body 滚动事件
    _bodyScroll(left, top) {
      if (left !== false) this.scrollLeft = left;
      if (top !== false) this.scrollTop = top;
    },
    // body 鼠标经过行事件
    _hoverRow(hoverRowIndex) {
      if (this.highlightCurrentRow) {
        this.hoverRowIndex = Number(hoverRowIndex);
      }
    },
    // 编辑事件
    _editInput(el, field, value, oidValue, rowIndex) {
      this.$nextTick((e) => {
        this._updateCellValue(el, field, value, rowIndex);
        this._updateSummary(field, value, oidValue);
      });
      this.$parent.$emit("input", field, value, rowIndex, this.data[rowIndex]);
    },
    //更新汇总行
    _updateSummary(field, value, oidValue) {
      let summary = this.summary[field];
      if (field && oidValue != NaN && value != NaN) {
        this.summary[field] =
          Number(summary || 0) - Number(oidValue || 0) + Number(value || 0);
      }
    },
    //更新单元格value
    _updateCellValue(el, field, value, rowIndex, isGrid) {
      let col = {};
      this.expandCols.forEach((h) => {
        h.name == field ? (col = h) : "";
      });
      value =
        col.type == "number"
          ? Number(value).toFixed(col.acc || this.acc)
          : value;
      value =
        col.type == "datetime"
          ? dateFormat(col.format || "YYYY-MM-DD", value || "")
          : value;
      //更新数据源
      this.data[rowIndex][field] = value;
      this.$set(this.data, rowIndex, this.data[rowIndex]);
      //更新元素
      let $el = el.target || el;
      let $doms = [
        this.$refs["tableBody"],
        this.$refs["leftTableBody"],
        this.$refs["rightTableBody"],
      ];
      let className = $el ? String($el.className) : "";
      value =
        String(col.enabledPermil || this.enabledPermil) == "true"
          ? this.$dyMethods.commafy(value)
          : value;
      $doms.forEach(($body) => {
        if ($body) {
          let falg = false;
          let $row = $body.$el.querySelectorAll(".dy-table__row")[rowIndex];
          let $cell = $row.querySelectorAll(`.dy-edit[name='${field}']`)[0];
          if (
            $cell &&
            (isGrid ||
              $cell != $el ||
              className.indexOf("dy_table_datetime") != -1)
          ) {
            $cell.value = value;
            falg = true;
          }
          //自定义类型
          let $fnCell = $row.querySelectorAll(
            `.dy-edit-Fntype[name='${field}']`
          );
          if ($fnCell[0]) {
            let $parent = this.$parent.$parent;
            let typeFn = $fnCell[0].getAttribute("data-fun");
            let rowData = $body.data[rowIndex];
            let colData = $body.data[rowIndex][name];
            let colKey = $fnCell[0].getAttribute("data-colIndex");
            if (typeFn && $parent && $parent[typeFn]) {
              if (typeof $parent[typeFn] == "function") {
                for (let i = 0; i < $fnCell.length; i++) {
                  let myTemplate = Vue.extend({
                    template: $parent[typeFn](
                      rowData,
                      rowIndex,
                      colData,
                      colKey
                    ),
                    data() {
                      return { slApp: $parent };
                    },
                    methods: { ...$parent.$options.methods },
                  });
                  $fnCell[i].innerHTML = "";
                  $fnCell[i].appendChild(new myTemplate().$mount().$el);
                  $fnCell[i].classList.remove("dy-add-mount");
                }
              }
            }
            falg = true;
          }
          //按钮类型
          let $btnCell = $row.querySelectorAll(
            `.dy-edit-link[name='${field}']`
          );
          if ($btnCell[0]) {
            for (let i = 0; i < $btnCell.length; i++) {
              let click = $btnCell[i].getAttribute("click");
              if (click && String(click).indexOf("[") == -1) {
                $btnCell[i].text = value;
              }
            }
            falg = true;
          }
          if (!$cell && !falg) {
            $cell = $row.querySelectorAll(`td[data-field='${field}'] .cell`)[0];
            $cell ? ($cell.innerHTML = value) : "";
          }
        }
      });
    },
    // 监听大小变化
    _monitorResize() {
      this.$nextTick((e) => {
        let $body = this.$refs["tableBody"] && this.$refs["tableBody"].$el;
        let bodyWidth = $body.offsetWidth;
        let bodyheight = $body.offsetHeight;
        let resizeTimer = null;
        setInterval(() => {
          // 自适应表格大小
          let _bodyWidth = $body.offsetWidth;
          let _bodyheight = $body.offsetHeight;
          if (_bodyWidth != bodyWidth || _bodyheight != bodyheight) {
            if (_bodyWidth > 0) {
              bodyWidth = _bodyWidth;
              bodyheight = _bodyheight;
              if (resizeTimer) {
                clearTimeout(resizeTimer);
              }
              resizeTimer = setTimeout(() => {
                this.initlayout();
                bodyWidth = _bodyWidth;
                bodyheight = _bodyheight;
              }, 5);
            }
          }
          // 更新偏移度 - 用于右固定列的拖动功能
          let bodyRollingDistance = $body.scrollWidth - $body.clientWidth || 0;
          if (this.bodyRollingDistance != bodyRollingDistance) {
            this.bodyRollingDistance = bodyRollingDistance;
          }
        }, 10);
      });
    },
    //初始布局
    initlayout() {
      this.$nextTick((e) => {
        let $body = this.$refs["tableBody"].$el;

        // 是否显示竖向滚动条
        if ($body.scrollHeight > $body.clientHeight) {
          this.isShowRightScroll = true;
          this.bodyScrollWidth = $body.offsetWidth - $body.clientWidth || 0;
        } else {
          this.isShowRightScroll = false;
          this.bodyScrollWidth = 0;
        }

        // 初始表格宽度 及 是否显示底部滚动条
        if (this.colsTotalWidth > $body.offsetWidth) {
          this.tableWidth = this.colsTotalWidth + "px";
          this.isShowBottonScroll = true;
        } else {
          this.tableWidth = "100%";
          this.isShowBottonScroll = false;
        }

        // 调整固定表格的容器宽度
        this.initFixedTableWidth();
      });
    },
    // 调整固定表格的容器宽度
    initFixedTableWidth() {
      setTimeout(() => {
        let $head = this.$refs["tableHeader"] && this.$refs["tableHeader"].$el;
        let $headTr = $head
          .querySelector(".dy-grid__table")
          .querySelector("tr");
        let $headAllTh = $headTr.querySelectorAll("th");
        let lefteWidth = 0;
        let rightWidth = 0;
        for (var i = 0; i < $headAllTh.length; i++) {
          if ($headAllTh[i].getAttribute("data-fixed") == "left") {
            lefteWidth += $headAllTh[i].offsetWidth;
          }
          if ($headAllTh[i].getAttribute("data-fixed") == "right") {
            rightWidth += $headAllTh[i].offsetWidth;
          }
        }
        this.leftFixedTableWidth = lefteWidth;
        this.rightFixedTableWidth = rightWidth
          ? rightWidth + this.bodyScrollWidth
          : 0;
      }, 10);
    },
  },
};
</script>
