<template>
  <div
    class="v-form"
    :style="{ height: warpHeight, width: warpWidth }"
    :id="id"
    :entity="entity"
    :keys="keys"
  >
    <!-- 头部区域 -->
    <form-header class="v-form-header" ref="v-form-header">
      <!-- 按钮区域 -->
      <template slot="button">
        <slot name="buttons"></slot>
      </template>
      <!-- 标题 -->
      <template slot="headHtml">
        <slot name="headHtml"></slot>
      </template>
    </form-header>
    <!-- 内容区域 -->

    <form-item
      :cols="cols"
      ref="form-item"
      @slotValue="getChildSlot"
      :showTabs="showTabs"
      :tabType="tabType"
    >
      <template v-for="item in this.slotArray" :slot="item.id">
        <slot :name="item.id"></slot>
      </template>
    </form-item>
  </div>
</template>

<script>
import formHeader from "@/packages/vform/header/header.vue";
import formItem from "@/packages/vform/formItem.vue";
export default {
  name: "v-form",
  components: {
    formHeader,
    formItem,
  },
  data() {
    return {
      fields: [], // 需要验证的字段
      defaultModel: {}, // 用于保存所有表单元素初始值
      warpHeight: "100%", //总体高度
      warpWidth: "100%", //总体宽度
      slotArray: [],
    };
  },
  props: {
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    id: [String],
    entity: [String],
    url: [String],
    keys: [String],
    showTabs: {
      type: Boolean,
      default: true,
    },
    tabType: {
      type:Number,
      default: 1 
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    cols: {
      type: Array,
      default() {
        function getFormItem(slots) {
          if (slots) {
            let cols = [];
            let mul = 1;
            slots.forEach((col, index) => {
              if (
                col.tag == "tab" ||
                col.tag == "section" ||
                col.tag == "cells" ||
                col.tag == "cell" ||
                col.tag == "opt"
              ) {
                if (col.children && col.children[0].tag == "section") {
                  col.data.attrs["section"] = getFormItem(col.children);
                } else if (col.children && col.children[0].tag == "cells") {
                  col.data.attrs["cells"] = getFormItem(col.children);
                  if (col.children && col.children[0].children) {
                    let child = col.children[0].children;
                    mul = 100 / col.children[0].data.attrs.cols;
                    for (let i = 0; i < child.length; i++) {
                      if (child[i].data) {
                        child[i].data.attrs.width =
                          mul * child[i].data.attrs.col + "%";
                      }
                    }
                    col.data.attrs["cell"] = getFormItem(child);
                  }
                } else if (col.children && col.children[0].tag == "opt") {
                  col.data.attrs["opt"] = getFormItem(col.children);
                }
                cols.push(col.data.attrs);
              }
            });

            return cols;
          } else {
            return [{ sort: false, width: "" }];
          }
        }
        return getFormItem(this.$slots.cells);
      },
    },
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    trigger: {
      // 触发验证类型，change和blur两种，仅对input
      default: "change",
      validator: function (value) {
        return ["change", "blur"].indexOf(value) !== -1;
      },
    },
    labelWidth: String,
  },
  created() {console.log(this.tabType)},
  methods: {
    validate(props) {
      let fields = this.fields;
      if (props && props.length > 0) {
        fields = this.fields.filter((field) => {
          return props.indexOf(field.prop) !== -1;
        });
      }
      return new Promise((resolve, reject) => {
        this._validateComm(fields)
          .then((res) => {
            resolve(res); // 验证通过
          })
          .catch((res) => {
            reject(res);
          });
      });
    },
    getChildSlot(data) {
      if (data) {
        this.slotArray = [];
        data.forEach((e) => {
          if (e.id) {
            this.slotArray.push(e);
          }
        });
      }
    },
    _validateComm(fields) {
      let valid = true;
      let count = 0;
      let errorTips = [];
      if (fields.length > 0) {
        return new Promise((resolve, reject) => {
          fields.forEach((field) => {
            // 引用formItem的validate验证方法
            // console.log(field)
            field.validate((result, field) => {
              if (result !== true) {
                // 错误结果
                valid = false;
                errorTips.push(result);
              }
              if (++count === fields.length) {
                if (valid) {
                  errorTips = this.value;
                } // 验证通过时返回当前表单值，相当于value
                if (valid) {
                  // 通过验证
                  resolve(errorTips);
                } else {
                  reject(errorTips);
                }
              }
            });
          });
        });
      }
    },
    resetFields() {
      // 重置表单元素值
      this.$emit("input", Object.assign({}, this.defaultModel));
      // 清空错误提示
      this.fields.forEach((field) => {
        field.resetField();
      });
    },
    getData() {
      let form = this.$refs["form-item"];
      return form.formData;
    },
    getValue(key) {
      let form = this.$refs["form-item"];
      return form.formData[key];
    },
    setValue(key, val) {
      let form = this.$refs["form-item"];
      form.setValue(key, val);
    },
    setDisabled(key, bool) {
      let form = this.$refs["form-item"];
      let flag;
      bool ? (flag = bool) : (flag = false);
      form.setDisabled(key, flag);
    },
    setAllDisabled() {
      let form = this.$refs["form-item"];
      form.setAllDisabled(false);
    },
    beforeSave() {},
    save(data) {
      let param = {
        url: "/api/Common/Form/Save",
        entity: this.entity,
        key: this.keys,
      };
      this.$refs["form-item"].save(param, data);
    },
    loadData(data) {
      let param = {
        url: "/api/Common/Form/Get",
        entity: this.entity,
        key: this.keys,
      };
      this.$refs["form-item"].loadData(param, data);
    },
    afterSave() {},

    crearData() {},
  },
  computed: {
    cls() {
      return `v-form`;
    },
  },
  mounted() {
    // 保存表单所有元素初始值，用于重置表单
    this.defaultModel = Object.assign({}, this.value);
  },
};
</script>
<style lang="scss">
@import "./form.scss";
</style>