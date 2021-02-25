<template>
  <div
    class="dy-grid"
    :style="{ height: warpHeight, width: warpWidth }"
    :id="id"
    :entity="entity"
  >
    <!-- 自定义头部 -->
    <v-header
      class="dy-grid-title"
      ref="dy-grid-header"
      v-if="showTitleRow"
      :title="title"
      :show-refresh="showRefreshBtn"
      @headHandler="_headHandler"
    >
      <!-- 按钮区域 -->
      <template slot="button">
        <slot name="buttons"></slot>
      </template>
      <!-- 自定义头部 -->
      <template slot="headHtml">
        <slot name="headHtml"></slot>
      </template>
    </v-header>

    <!-- 内容表格 -->
    <v-table
      class="dy-grid-content"
      ref="dy-grid-table"
      @rowSelected="rowSelected"
      :style="tableHeight"
      :cols="cols"
      :summary="summary"
      :show-index="showIndex"
      :show-checkbox="showCheckbox"
      :cell-resize="cellResize"
      :fixed-index-column="fixedIndexColumn"
      :total-row-height="totalRowHeight"
      :total-row-title="totalRowTitle"
      :errorTips="errorTips"
      :showLoading="showLoading"
      :page="page"
      :page-size="size"
      :enable-all-sort="enableAllSort"
      :sort="sort"
      :remote-sort="remoteSort"
      :mergeCheck="mergeCheck"
      :mergeIndex="mergeIndex"
      :highlightCurrentRow="highlightCurrentRow"
      :rowClassName="rowClassName"
      :cellClassName="cellClassName"
      :acc="acc"
      :enabledPermil="enabledPermil"
      :stripe="stripe"
      :border="border"
      @sort="_sort"
    ></v-table>
    <!-- 分页  -->
    <v-paging
      class="dy-grid-paging"
      ref="dy-grid-paging"
      v-if="showPage"
      :page="page"
      :page-size="size"
      :page-list="pageList"
      :total="total"
      @pagehandler="_pageHandler"
    ></v-paging>

    <!-- 自定义底部 -->
    <v-footer class="dy-grid-title" ref="dy-grid-footer" v-if="showFooter">
      <template slot="foothtml">
        <slot name="foothtml"></slot>
      </template>
    </v-footer>
  </div>
</template>

<script>
import vHeader from "@/packages/vgrid/header/header.vue";
import vTable from "@/packages/vgrid/table/table.vue";
import vFooter from "@/packages/vgrid/footer/footer.vue";
import vPaging from "@/packages/vgrid/paging/paging.vue";
import methods from "@/utils/methods.js";
import config from "@/utils/config.js";
import { getTotal,ajax } from "@/utils/index.js";
import $ from "jquery";

if (window.Vue) {
  Vue.prototype.$dyMethods = methods;
  Vue.prototype.$dyConfig = config;
}

export default {
  name: "v-grid",
  components: {
    vHeader,
    vTable,
    vFooter,
    vPaging,
  },
  data() {
    return {
      data: [],
      summary: {},
      showLoading: false,
      dataParams: this.params || {},
      errorTips: this.emptyTips || "暂无数据",
      warpHeight: "100%", //总体高度
      warpWidth: "100%", //总体宽度
      page: 1, //当前页
      size: 50, //页面大小
      total: 0, //总数
      sort: "",
      enabledEditData: [],
      updatePreData: [],
      dyConfig: {},
    };
  },
  props: {
    //标题
    title: [String],
    id: [String],
    entity: [String],
    //主键
    keyName: [String],
    //配置 - 有cols则取cols 不然就取插槽里面的值
    cols: {
      type: Array,
      default() {
        function _getFormatSlotCols(slotsCols) {
          if (slotsCols) {
            let cols = [];
            slotsCols.forEach((col, index) => {
              if ((col && col.tag == "cell") || col.tag == "btn") {
                if (col.children && col.children[0].tag == "cell") { 
                  col.data.attrs["cols"] = _getFormatSlotCols(col.children);    
                } else if (col.children && col.children[0].tag == "btn") {
                  col.data.attrs["btn"] = _getFormatSlotCols(col.children);
                }
                cols.push(col.data.attrs);
              }
            });
            return cols;
          } else {
            return [{ sort: false, width: "" }];
          }
        }
        return _getFormatSlotCols(this.$slots.cells);
      },
    },
    //自动选中
    autoSelected: {
      type: Boolean,
      default() {
        return this.dyConfig.showTitleRow === false ? false : true;
      },
    },
    //静态表格数据
    url: {
      type: [Array, String],
      default() {
        return this.dyConfig.url || [];
      },
    },
    params: {
      type: [Object],
      default() {
        return this.dyConfig.params || {};
      },
    },
    //显示标题行
    showTitleRow: {
      type: Boolean,
      default() {
        return this.dyConfig.showTitleRow === false ? false : true;
      },
    },
    //显示底部
    showFooter: {
      type: Boolean,
      default() {
        return this.dyConfig.showFooter === false ? false : true;
      },
    },
    // 显示刷新按钮
    showRefreshBtn: {
      type: Boolean,
      default() {
        return this.dyConfig.showRefreshBtn === false ? false : true;
      },
    },
    //显示索引行
    showIndex: {
      type: Boolean,
      default() {
        return this.dyConfig.showIndex === false ? false : true;
      },
    },
    //显示复选框
    showCheckbox: {
      type: Boolean,
      default() {
        return this.dyConfig.showCheckbox === false ? false : true;
      },
    },
    //允许拖动行大小
    cellResize: {
      type: Boolean,
      default() {
        return this.dyConfig.cellResize === false ? false : true;
      },
    },
    //国定索引列
    fixedIndexColumn: {
      type: Boolean,
      default() {
        return this.dyConfig.fixedIndexColumn === false ? false : true;
      },
    },
    //汇总行高度
    totalRowHeight: {
      type: Number,
      default() {
        return this.dyConfig.totalRowHeight || 34;
      },
    },
    //汇总行标题
    totalRowTitle: {
      type: String,
      default() {
        return this.dyConfig.totalRowTitle || "合计：";
      },
    },
    //显示分页
    showPage: {
      type: Boolean,
      default() {
        return this.dyConfig.showPage === false ? false : true;
      },
    },
    // 页面大小
    pageSize: {
      type: [Number],
      default() {
        return this.dyConfig.pageSize || 50;
      },
    },
    //分页列表
    pageList: {
      type: Array,
      default() {
        return this.dyConfig.pageList || [10, 30, 50, 100];
      },
    },
    // 高度 100% ， 100px , -100px
    height: {
      type: [Number, String],
      default() {
        return this.dyConfig.height || "100%";
      },
    },
    // 宽度
    width: {
      type: [Number, String],
      default() {
        return this.dyConfig.width || "100%";
      },
    },
    //启用所有排序
    enableAllSort: {
      type: [Boolean],
      default() {
        return this.dyConfig.enableAllSort === false ? false : true;
      },
    },
    //启用远程排序
    remoteSort: {
      type: [Boolean],
      default() {
        return this.dyConfig.remoteSort === true ? true : false;
      },
    },
    //启用远程合计
    remoteSummary: {
      type: [Boolean],
      default() {
        return this.dyConfig.remoteSummary === true ? true : false;
      },
    },
    //无数据的提示文本
    emptyTips: {
      type: [String],
      default() {
        return this.dyConfig.emptyTips || "";
      },
    },
    //表格准备好就自动加载数据
    autoLoad: {
      type: [Boolean],
      default() {
        return this.dyConfig.autoLoad === true ? true : false;
      },
    },
    //用于将返回的任意数据格式解析成 table 组件规定的数据格式
    parseData: {
      type: [Object],
      default() {
        return (
          this.dyConfig.parseData || {
            code: "Code",
            msg: "Message",
            total: "Data.dataCount",
            data: "Data.data",
            summary: "Data.summaryData",
          }
        );
      },
    },
    // 接口的请求头
    headers: {
      type: [Object],
      default() {
        return this.dyConfig.headers || {};
      },
    },
    //请求的延时时间
    timeout: {
      type: [Number],
      default() {
        return this.dyConfig.timeout === 0 ? 0 : config.timeout;
      },
    },
    // 合并复选框列
    mergeCheck: [String, Boolean],
    mergeIndex: [String, Boolean],
    //是否为斑马纹 table
    stripe: {
      type: [Boolean],
      default() {
        return this.dyConfig.stripe === true ? true : false;
      },
    },
    //是否是否带有纵向边框
    border: {
      type: [Boolean],
      default() {
        return this.dyConfig.border === true ? true : false;
      },
    },
    //高亮当前行
    highlightCurrentRow: {
      type: [Boolean],
      default() {
        return this.dyConfig.highlightCurrentRow === false ? false : true;
      },
    },
    //行的 className 的回调方法
    rowClassName: [Function, String],
    //单元格的 className 的回调方法
    cellClassName: [Function, String],
    //小数位
    acc: {
      type: Number,
      default() {
        return this.dyConfig.acc || 2;
      },
    },
    // 启用千分号
    enabledPermil: {
      type: [Boolean],
      default() {
        return this.dyConfig.enabledPermil === true ? true : false;
      },
    },
    // 是否换行
    nowrap: {
      type: [Boolean],
      default() {
        return this.dyConfig.nowrap === true ? true : false;
      },
    },
    // 刷新重置分页
    refreshResetPage: {
      type: [Boolean],
      default: false,
    },
  },
  computed: {
    tableHeight() {
      let height = 0;
      if (this.showTitleRow) {
        height += 36;
      }
      if (this.showPage) {
        height += 36;
      }
      if (this.showFooter) {
        height += 36;
      }

      return `height: calc(100% - ${height}px);`;
    },
  },
  watch: {
    // 加载
    url(data) {
      if (this.autoLoad || data[0] || typeof data == "object") {
        this.load();
      }
    },
    // 获取数据
    getData() {
      return this.$refs["dy-grid-table"].data;
    },
  },
  //在实例初始化之后
  beforeCreate() {
    this.dyConfig = (this.$dyConfig && this.$dyConfig["v-grid"]) || {};
  },

  //实例已经创建完成之后被调用，$el 属性目前不可见
  created() {
    this.size = this.pageSize;
    // 设置整体宽高
    this._setWarpWidthHeight();
    window.addEventListener(
      "resize",
      (e) => {
        this._setWarpWidthHeight();
      },
      true
    );

    // 是否自动加载
    if (this.autoLoad) {
      this.load();
    }
  },
  mounted() {
    // console.log(this.id);
    //  var id = this.id;
    // window[id] =  this.$options.methods;
  },
  methods: {
    //加载数据
    load(params) {
      let data = this.url;
      //如果是url，加载ajax数据
      if (typeof data == "string" && data.indexOf("/") != -1) {
        //    that.dataParams = params || that.dataParams;
        //  this.showLoading = true;
        this._loadAjax(params);
      } else if (data && typeof data == "object") {
        this.showLoading = true;
        setTimeout((h) => {
          this._updateData(data, data.length);
        }, 10);
        setTimeout((h) => {
          this.showLoading = false;
        }, 50);
      }
    },
    //刷新
    refresh(params) {
      this.$nextTick((e) => {
        let $body = this.$refs["dy-grid-table"];
        if ($body) {
          $body.$children[0].$el.sort = "";
          if (this.refreshResetPage) {
            this.page = 1;
            this.size = this.pageSize;
          }
          this.sort = "";
          this.load(params);
        }
      });
    },
    // 勾选数据行事件
    rowSelected() {},
    // 获取数据
    getData() {
      let $body = this.$refs["dy-grid-table"];

      return $body.data;
    },
    //启用编辑
    enabledEdit(rowIndex, cellIndex) {
      try {
        this._enabledAndDisabledEdit(true, rowIndex, cellIndex);
      } catch (e) {
        console.error(e);
      }
    },
    //返回id
    getGridID() {
      return this.id;
    },
    // 禁用编辑
    disabledEdit(rowIndex, cellIndex) {
      try {
        this._enabledAndDisabledEdit(false, rowIndex, cellIndex);
      } catch (e) {
        console.error(e);
      }
    },
    //获取选中行索引
    getSelectedIndexs() {
      return this.getSelectedRows()
        .map((h) => {
          return h._rowIndex;
        })
        .join(",");
    },
    //获取选中行
    getSelectedRows() {
      let $body = this.$refs["dy-grid-table"];
      let data = [];
      $body.data.forEach(function (h, rowIndex) {
        if (h._isChecked) {
          h._rowIndex = rowIndex;
          data.push(h);
        }
      });
      return data;
    },
    // 选中行
    select(indexs, isTriggerClick, isChecked) {
      if (!indexs && indexs !== 0) {
        console.error("参数indexs必填！");
        return;
      }
      try {
        this.$nextTick((e) => {
          let $body = this.$refs["dy-grid-table"];
          let rowIndex = null;
          if (typeof indexs != "object" && indexs != "all") {
            indexs = String(indexs).split(",");
            indexs.forEach((index) => {
              $body.data[index]._isChecked = isChecked == false ? false : true;
            });
            rowIndex = indexs[0];
          } else if (indexs == "all") {
            $body.data.forEach((row, index) => {
              if (rowIndex == null) {
                rowIndex = index;
              }
              $body.data[index]._isChecked = isChecked == false ? false : true;
            });
          } else {
            $body.data.forEach((row, index) => {
              indexs.forEach((h) => {
                if (String(row[h.name]) == String(h.value)) {
                  if (rowIndex == null) {
                    rowIndex = index;
                  }
                  $body.data[index]._isChecked =
                    isChecked == false ? false : true;
                }
              });
            });
          }
          $body._updateChecked();
          if (isTriggerClick && rowIndex != null) {
            this.$emit("row-click", $body.data[rowIndex], rowIndex, null);
            this.$emit("rowClick", $body.data[rowIndex], rowIndex, null);
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    // 取消选中
    deselect(indexs) {
      this.select(indexs, false, false);
    },
    //更新指定行数据
    updateRow(field, values, data) {
      if (!field || !values || !data) {
        console.error("参数field,values,data必填！");
        return;
      }
      try {
        this.$nextTick((e) => {
          let $body = this.$refs["dy-grid-table"];
          $body.data.forEach((row, rowIndex) => {
            String(values)
              .split(",")
              .forEach((val) => {
                if (val == String(row[field])) {
                  for (let name in data) {
                    let $row = $body.$el.querySelectorAll(".dy-table__row")[
                      rowIndex
                    ];
                    let $cell = $row.querySelectorAll(
                      `
                          .dy-edit[name='${name}'],
                          .dy-edit-Fntype[name='${name}'],
                          .dy-edit-link[name='${name}']
                        `
                    )[0];
                    $cell =
                      $cell ||
                      $row.querySelectorAll(
                        `td[data-field='${name}'] .cell`
                      )[0];
                    if ($cell) {
                      let oidValue = $body.data[rowIndex][name];
                      $body._updateCellValue(
                        $cell,
                        name,
                        data[name],
                        rowIndex,
                        true
                      );
                      $body._updateSummary(name, data[name], oidValue);
                      this.$emit(
                        "input",
                        name,
                        data[name],
                        rowIndex,
                        $body.data[rowIndex]
                      );
                    }
                  }
                }
              });
          });
        });
      } catch (e) {
        console.error(e);
      }
    },
    //删除数据行
    deleteRow(indexs) {
      if (!indexs) {
        console.error("参数必填！");
        return;
      }
      this.$nextTick((e) => {
        let $body = this.$refs["dy-grid-table"];
        let summary = $body.summary;
        let data = [];
        let deleteRows = [];
        if (indexs && indexs != "all") {
          $body.data.forEach((row, rowIndex) => {
            row._rowIndex = rowIndex;
            if (typeof indexs != "object") {
              if (String(indexs).split(",").indexOf(String(rowIndex)) == -1) {
                data.push(row);
              } else {
                deleteRows.push(row);
              }
            } else {
              for (let i in indexs) {
                if (
                  String(indexs[i]).split(",").indexOf(String(row[i])) != -1 &&
                  row[i]
                ) {
                  deleteRows.push(row);
                } else {
                  data.push(row);
                }
              }
            }
          });
        }
        if (data.length > $body.data.length) {
          console.error("deleteRow方法传值错误！");
          return false;
        }
        //调整可编辑列顺序
        this.enabledEditData.forEach((row) => {
          let count = 0;
          deleteRows.map((h) => {
            if (row.rowIndex && row.rowIndex > h._rowIndex) {
              count++;
            }
            if (row.rowIndex && row.rowIndex == h._rowIndex) {
              row.rowIndex = -1;
              row.isEnabled = false;
            }
          });
          if (row.rowIndex) {
            row.rowIndex = String(row.rowIndex - count);
          }
        });
        $body.data = JSON.parse(JSON.stringify(data));
        // 更新汇总数据和是否可编辑行
        if (!data[0]) {
          this.enabledEditData = [];
          if ($body.isShowTotal) {
            for (let i in summary) {
              $body.summary[i] = 0;
            }
          }
        } else if ($body.isShowTotal) {
          deleteRows.forEach((row) => {
            for (let i in row) {
              if (summary[i] != NaN) {
                $body.summary[i] =
                  Number(summary[i] || 0) - Number(row[i] || 0);
              }
            }
          });
        }
      });
    },
    // 清空数据
    emptyData() {
      this.deleteRow("all");
    },
    //添加行
    addRow(datas, index) {
      if (!datas || typeof datas != "object") {
        console.error("参数错误！");
        return;
      }
      this.$nextTick((e) => {
        let $body = this.$refs["dy-grid-table"];
        let summary = $body.summary;
        // 合计
        if ($body.isShowTotal) {
          datas.forEach((row) => {
            for (let i in row) {
              if (summary[i] != NaN) {
                $body.summary[i] =
                  Number(summary[i] || 0) + Number(row[i] || 0);
              }
            }
          });
        }
        //添加
        if (typeof index == "number") {
          let data = [];
          let length = $body.data.length;
          index = index >= length ? length - 1 : index;
          $body.data.forEach((row, rowIndex) => {
            if (rowIndex == index) {
              datas.forEach((val) => {
                data.push(val);
              });
            }
            data.push(row);
            if (index === -1 && rowIndex + 1 == length) {
              datas.forEach((val) => {
                data.push(val);
              });
            }
          });
          if (length < 1) {
            datas.forEach((val) => {
              data.push(val);
            });
          }
          $body.data = JSON.parse(JSON.stringify(data));
        } else {
          $body.data.forEach((row, rowIndex) => {
            datas.push(row);
          });
          $body.data = JSON.parse(JSON.stringify(datas));
        }
        // // 排序
        if (typeof index == "boolean" && index == true) {
          $body._sort(this.sort);
        } else {
          $body._sort("");
        }
      });
    },
    // 获取查询参数
    getLoadParams() {
      return this.LoadParams || {};
    },
    //启用编辑
    _enabledAndDisabledEdit(is, rowIndex, cellIndex, isUpdate) {
      if (!rowIndex && !isUpdate) {
        this.enabledEditData = [];
      }
      if (!isUpdate) {
        this.enabledEditData.push({
          isEnabled: is,
          rowIndex: rowIndex,
          cellIndex: cellIndex,
        });
      }
      this.$nextTick((e) => {
        let $body = this.$refs["dy-grid-table"].$el;
        let $rows = $body
          .querySelector(".dy-grid__body")
          .querySelectorAll(".dy-table__row");
        let $leftRows = $body.querySelectorAll(
          ".dy-grid__fixed.left .dy-table__row"
        );
        let $rightRows = $body.querySelectorAll(
          ".dy-grid__fixed.right .dy-table__row"
        );
        if (rowIndex && $rows[rowIndex]) {
          let $edits = $rows[rowIndex].querySelectorAll("td[rowspan]");
          if (cellIndex && $edits[cellIndex]) {
            if ($edits[cellIndex].querySelector(".dy-edit")) {
              if (is) {
                $edits[cellIndex]
                  .querySelector(".dy-edit")
                  .removeAttribute("disabled");
              } else {
                $edits[cellIndex]
                  .querySelector(".dy-edit")
                  .setAttribute("disabled", "disabled");
              }
            }
            if ($rightRows && $rightRows[rowIndex]) {
              let $row = $rightRows[rowIndex];
              let colspan = $rightRows[rowIndex]
                .querySelectorAll("td[colspan]")[0]
                .getAttribute("colspan");
              let colIndex = cellIndex - colspan;
              let $td = $rightRows[rowIndex].querySelectorAll("td[rowspan]");
              if (
                cellIndex >= colspan &&
                $td[colIndex].querySelector(".dy-edit")
              ) {
                if (is) {
                  $td[colIndex]
                    .querySelector(".dy-edit")
                    .removeAttribute("disabled");
                } else {
                  $td[colIndex]
                    .querySelector(".dy-edit")
                    .setAttribute("disabled", "disabled");
                }
              }
            }
            if ($leftRows && $leftRows[rowIndex]) {
              let $td = $leftRows[rowIndex].querySelectorAll("td[rowspan]");
              if (
                cellIndex <= $td.length &&
                $td[cellIndex].querySelector(".dy-edit")
              ) {
                if (is) {
                  $td[cellIndex]
                    .querySelector(".dy-edit")
                    .removeAttribute("disabled");
                } else {
                  $td[cellIndex]
                    .querySelector(".dy-edit")
                    .setAttribute("disabled", "disabled");
                }
              }
            }
          } else if (!cellIndex) {
            _edits($edits);
            if ($rightRows && $rightRows[rowIndex]) {
              let $edits = $rightRows[rowIndex].querySelectorAll("td[rowspan]");
              _edits($edits);
            }
            if ($leftRows && $leftRows[rowIndex]) {
              let $edits = $leftRows[rowIndex].querySelectorAll("td[rowspan]");
              _edits($edits);
            }
          }
        } else if (!rowIndex) {
          let $edits = $body.querySelectorAll(".dy-edit");
          for (let i = 0; i < $edits.length; i++) {
            if (is) {
              $edits[i].removeAttribute("disabled");
            } else {
              $edits[i].setAttribute("disabled", "disabled");
            }
          }
        }
      });

      function _edits($edits) {
        for (var i = 0; i < $edits.length; i++) {
          if ($edits[i] && $edits[i].querySelector(".dy-edit")) {
            if (is) {
              $edits[i].querySelector(".dy-edit").removeAttribute("disabled");
            } else {
              $edits[i]
                .querySelector(".dy-edit")
                .setAttribute("disabled", "disabled");
            }
          }
        }
      }
    },
    // 视图变更 - 如排序，显示隐藏固定列等
    _viewChange() {
      let d = this.enabledEditData;
      if (d[0]) {
        d.forEach((h) => {
          this._enabledAndDisabledEdit(
            h.isEnabled,
            h.rowIndex,
            h.cellIndex,
            true
          );
        });
      }
    },
    // 更新数据
    _updateData(data, total, summary) {
      this.total = total === 0 ? 0 : total || this.total;
      this.$nextTick((e) => {
        let $body = this.$refs["dy-grid-table"];
        if ($body) {
          this.updatePreData = $body.data;
          $body.data = JSON.parse(JSON.stringify(data));
        }
        if (this.remoteSummary && summary) {
          this.summary = summary || {};
        } else if (!this.remoteSummary && data[0]) {
          let obj = {};
          for (let key in data[0]) {
            obj[key] = getTotal(data, key);
          }
          this.summary = obj;
        }
        this._summary = summary;
        this._loadSuccess(data, summary);
      });
    },
    //加载成功
    _loadSuccess(data, summary) {
      this._selected(data);
      this.$emit("loadsuccess", { data: data, summary: summary });
      this.$emit("loadSuccess", { data: data, summary: summary });
      this.$emit("load-success", { data: data, summary: summary });
    },

    //选中
    _selected(data) {
      let that = this;
      let is = true;
      let keyName = this.keyName;
      if (
        keyName &&
        this.updatePreData[0] &&
        this.updatePreData &&
        data &&
        data[0] &&
        this.autoSelected
      ) {
        this.updatePreData.forEach(function (h) {
          if (h._isChecked && h[keyName]) {
            data.forEach(function (k, index) {
              if (h[keyName] == k[keyName]) {
                that.select(index);
                if (is) {
                  is = false;
                  let $body =
                    that.$refs["dy-grid-table"].$refs["tableBody"].$refs[
                      "dy-grid__body"
                    ];
                  let $bodyRow = $body.querySelectorAll(".dy-table__row");
                  $bodyRow[index].setAttribute("tabindex", 999999);
                  $bodyRow[index].focus();
                }
              }
            });
          }
        });
      }
    },
    // filter 参数
    addFilter(filed, opera, val, condition, children) {
      var filter = new Object();
      if (condition) filter.condition = condition;
      else filter.condition = "and";
      filter.Fiele = {
        Name: filed,
        Opera: opera,
        Value: val,
      };
      if (children) filter.children = children;
      else filter.children = [];

      return filter;
    },
    // 加载ajax
    _loadAjax(filter) {
      let that = this;
      let parseData = this.parseData;
      let params = {
        pageIndex: this.page,
        pageSize: this.showPage ? this.size : 100000,
        OrderBy: this.sort,
        Filters: filter || [],
        Model: this.entity,
      };
      ajax.post(that.url,params,function(res){
          that.showLoading = false;
          let data = res.Data || [];
          if (res[parseData.code] == 0) {
            let data = [],
              total = [],
              summary = [];
            if (parseData.data) {
              data = res;
              parseData.data.split(".").forEach((h) => {
                data = data[h];
              });
            }
            if (parseData.total) {
              total = res;
              parseData.total.split(".").forEach((h) => {
                total = total[h];
              });
            }
            if (parseData.summary) {
              summary = res;
              parseData.summary.split(".").forEach((h) => {
                summary = summary[h];
              });
            }
            if (!Array.isArray(data) || total == undefined) {
              that._updateData([], 0);
              that.errorTips = "格式不匹配";
            } else {
              that._updateData(data, total, summary);
            }
          } else {
            that._updateData([], 0);
            that.errorTips = res[parseData.msg] || "系统错误";
          }
      })
      // this.ajaxIndex = $.ajax({
      //   url: that.url,
      //   type: "post",
      //   data: params,
      //   headers: that.headers,
      //   timeout: that.timeout,
      //   beforeSend: function (xhr) {
      //     that.showLoading = true;
      //   },
      //   success: function (res) {
      //     that.showLoading = false;
      //     let data = res.Data || [];
      //     if (res[parseData.code] == 0) {
      //       let data = [],
      //         total = [],
      //         summary = [];
      //       if (parseData.data) {
      //         data = res;
      //         parseData.data.split(".").forEach((h) => {
      //           data = data[h];
      //         });
      //       }
      //       if (parseData.total) {
      //         total = res;
      //         parseData.total.split(".").forEach((h) => {
      //           total = total[h];
      //         });
      //       }
      //       if (parseData.summary) {
      //         summary = res;
      //         parseData.summary.split(".").forEach((h) => {
      //           summary = summary[h];
      //         });
      //       }
      //       if (!Array.isArray(data) || total == undefined) {
      //         that._updateData([], 0);
      //         that.errorTips = "格式不匹配";
      //       } else {
      //         that._updateData(data, total, summary);
      //       }
      //     } else {
      //       that._updateData([], 0);
      //       that.errorTips = res[parseData.msg] || "系统错误";
      //     }
      //   },
      //   error: function (err, xhr) {
      //     if (!that.ajaxIndex || !that.ajaxIndex.isAborted) {
      //       let responseText = xhr.responseText || "";
      //       let titleIndex1 = responseText.indexOf("<title>", 0) + 7;
      //       let titleIndex2 = responseText.indexOf("</title>", 0);
      //       let errText =
      //         responseText.substring(titleIndex1, titleIndex2) ||
      //         xhr.statusText;
      //       that.errorTips =
      //         "报错信息： " + errText + "，状态码是：" + xhr.status;
      //       that.showLoading = false;
      //     }
      //   },
      // });
    },
    // 头部
    _headHandler(val) {
      if (val == "refresh") {
        this.refresh();
      }
    },
    // 分页
    _pageHandler(page, size) {
      this.page = page;
      this.size = size;
      this.load();
    },
    // 设置高度
    _setWarpWidthHeight() {
      let height = this.height;
      let width = this.width;
      if (height.indexOf("px") != -1) {
        if (parseInt(height) < 0) {
          height =
            document.documentElement.clientHeight + parseInt(height) + "px";
        }
      } else if (height.indexOf("%") == -1) {
        height = "100%";
      }
      if (width.indexOf("px") != -1) {
        if (parseInt(width) < 0) {
          width = document.documentElement.clientWidth + parseInt(width) + "px";
        }
      } else if (width.indexOf("%") == -1) {
        width = "100%";
      }
      this.warpHeight = height;
      this.warpWidth = width;
    },
    //排序
    _sort(val) {
      this.sort = val;
      if (this.remoteSort) {
        this.load();
      } else {
        let $body = this.$refs["dy-grid-table"];
        this._loadSuccess($body.data, this.summary);
      }
    },
  },
};
</script>

<style lang="scss">
@import "./grid.scss";
</style>
