<!-- 表脚 -->
<template>
  <div
    class="dy-grid__footer"
    ref="dy-grid__footer"
    :style="{ height: totalRowHeight + 'px' }"
  >
    <table class="dy-grid__table" :style="_getTableStyle()">
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
        <tr>
          <template v-for="(col, key) in expandCols">
            <th
              :key="key"
              v-if="isShowTotalTh(col, key)"
              :style="{
                height: totalRowHeight + 'px',
                'text-align': col.align || 'left',
              }"
              :colspan="_totalRowColspan(col, key)"
              :data-field="col.name || col.field"
              :hide="col.hide"
            >
              <div class="cell" v-html="_getTotalData(col, key)"></div>
            </th>
          </template>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
import { eventDelegation, getTotal } from "@/utils/index.js";
import method from "./method.js";

export default {
  name: "table-footer",
  data() {
    return {};
  },
  mixins: [method],
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    summary: {
      type: Object,
      default: function () {
        return {};
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
    // 是否显示复选框
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    // 是否显示索引
    showIndex: {
      type: Boolean,
      default: false,
    },
    // 行高度
    totalRowHeight: {
      type: Number,
      default: 0,
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
    //汇总行名称
    totalRowTitle: {
      type: String,
      default: "合计:",
    },
  },
  watch: {
    scrollLeft(newVal, oidVal) {
      this._updateScrollLeft();
    },
  },
  mounted() {
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
    //获取汇总数据
    _getTotalData(col, key) {
      let acc = col.acc || this.$parent.acc;
      let permil = col.enabledPermil || this.$parent.enabledPermil || false;
      let total = String(col.total);
      let value = "";
      if (key == 0) {
        value = this.totalRowTitle || 0;
      } else if (total == "true") {
        value = Number(this.summary[col.name] || 0).toFixed(acc);
        value = permil ? this.$dyMethods.commafy(value) : value;
      } else if (total.indexOf("[") != -1) {
        let name = total.substring(total.indexOf("[") + 1, total.indexOf("]"));
        let text1 = total.substring(0, total.indexOf("["));
        let text2 = total.substring(total.indexOf("]") + 1);
        value = Number(this.summary[name] || 0).toFixed(acc);
        value = permil ? this.$dyMethods.commafy(value) : value;
        value = text1 + value + text2;
      }
      return value == "NaN" ? "" : value;
    },
    // 合计行Colspan
    _totalRowColspan(col, key) {
      let colspan = 0;
      if (this.showCheckbox) {
        colspan++;
      }
      if (this.showIndex) {
        colspan++;
      }
      return key == 0 ? colspan : 1;
    },
    //是否显示合计行th
    isShowTotalTh(col, key) {
      let isShow = true;
      if (!this._isShowCell(col)) {
        isShow = false;
      }
      if (this._totalRowColspan(col, key - 1) == 2) {
        isShow = false;
      }
      return isShow;
    },
    // 更新横向滚动位置
    _updateScrollLeft() {
      this.$nextTick(() => {
        let $footer = this.$refs["dy-grid__footer"];
        if ($footer) {
          $footer.scrollLeft = this.scrollLeft;
        }
      });
    },
    _initEvent() {
      var that = this;
      this.$nextTick(function () {
        let $footer = this.$refs["dy-grid__footer"];

        // 添加标题
        eventDelegation($footer, "mouseover", "div.cell", function (e, el) {
          let isOverflow = el.scrollWidth > el.parentNode.scrollWidth;
          if (isOverflow && !el.getAttribute("title")) {
            el.setAttribute("title", el.innerText);
          } else if (!isOverflow && el.getAttribute("title")) {
            el.removeAttribute("title");
          }
        });
      });
    },
  },
};
</script>
