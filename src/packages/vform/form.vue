<template>
  <div class="v-form"
  :style="{ height: warpHeight, width: warpWidth }"
  :id="id"
  :entity="entity"
  >
<!-- 头部区域 -->
    <form-header
      class="v-form-header"
      ref="v-form-header"
    >
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
     <form-item :cols="cols"></form-item>


  </div>
</template>

<script>
import formHeader from "@/packages/vform/header/header.vue";
import formItem   from "@/packages/vform/formItem.vue";
export default {
  name: 'v-form',
  components: {
    formHeader,
    formItem
  },
  data() {
    return {
      fields: [], // 需要验证的字段
      defaultModel: {}, // 用于保存所有表单元素初始值
      warpHeight: "100%", //总体高度
      warpWidth: "100%", //总体宽度

    }
  },
  props: {
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    id: [String],
    entity: [String],
    showMessage: {
      type: Boolean,
      default: true
    },
    cols:{
      type: Array,
      default(){
         function getFormItem(slots){ 
            if(slots) {
              let cols = [];
              slots.forEach((col,index) => {  
                  if((col && col.tag == "section") || col.tag == "cells" || col.tag == "cell" ) {
                      if((col.children && col.children[0].tag == "section")) {
                          col.data.attrs["ul"] = getFormItem(col.children);
                      } else if(col.children && col.children[0].tag == "cells") {
                         col.data.attrs["cells"] = getFormItem(col.children);
                         if(col.children && col.children[0].children) {
                            col.data.attrs["cell"] = getFormItem(col.children[0].children);
                         }  
                      } 
                      cols.push(col.data.attrs);
                  }
              })
              return cols;
            }else {
              return [{sort:false,width:""}];
            }
         }
         return getFormItem(this.$slots.cells[0].children);
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    trigger: {
      // 触发验证类型，change和blur两种，仅对input
      default: 'change',
      validator: function (value) {
        return ['change', 'blur'].indexOf(value) !== -1
      }
    },
    labelWidth: String
  },
  methods: {
    validate(props) {
      let fields = this.fields;
      if (props && props.length > 0) {
        fields = this.fields.filter((field) => {
          return props.indexOf(field.prop) !== -1
        })
      }
      return new Promise((resolve, reject) => {
        this._validateComm(fields)
          .then(res => {
            resolve(res) // 验证通过
          })
          .catch(res => {
            reject(res)
          })
      })
    },
    _validateComm(fields) {
      let valid = true
      let count = 0
      let errorTips = []
      console.log('validate fields')
      console.log(fields)
      if (fields.length > 0) {
        return new Promise((resolve, reject) => {
          fields.forEach(field => {
            // 引用formItem的validate验证方法
            // console.log(field)
            field.validate((result, field) => {
              if (result !== true) {
                // 错误结果
                valid = false
                errorTips.push(result)
              }
              if (++count === fields.length) {
                if (valid) {
                  errorTips = this.value
                } // 验证通过时返回当前表单值，相当于value
                if (valid) {
                  // 通过验证
                  resolve(errorTips)
                } else {
                  reject(errorTips)
                }
              }
            })
          })
        })
      }
    },
    resetFields() {
      // 重置表单元素值
      this.$emit('input', Object.assign({}, this.defaultModel))
      // 清空错误提示
      this.fields.forEach(field => {
        field.resetField()
      })
    }
  },
  computed: {
    cls() {
      return `v-form`
    }
  },
  mounted() {
    // 保存表单所有元素初始值，用于重置表单
    this.defaultModel = Object.assign({}, this.value)
  }
}
</script>
<style lang="scss">
@import "./form.scss";
</style>