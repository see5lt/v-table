<template>
  <div class="v-form-box" :id="dateId" >
    <input
      type="text"
      class="v-lookup v-input-control"
      v-model="lookValue"
      :disabled="edit.isDisabled == false ? true : false" 
    />
    
  </div>
</template>

<script>
import laydate from "@/utils/laydate";
import $ from 'jquery';
import { eventDelegation } from "@/utils/index.js";
export default {
  data() {
    return {
      lookValue: this.value,
      edit:{
        isDisabled: JSON.parse(this.disabled ? this.disabled : true)
      },
      html:null,
      dateId: "v-" + this.id,
    };
  },
  props: {
    value: {
      type: String,
    },
    disabled: {
      type: String,
    },
    id: {
      type: String,
    },
    click: {
      type: String
    },
    body:{
      
    }
  },
  watch: {
    dateValue(data) {
      this.$emit("update:value", this.dateValue);
    },
    html(data) {
      
    },
    disabled(data) {
      this.$emit("updata:disabled",data);
      this.$set(this.edit,'isDisabled',JSON.parse(data ? data : true));
    }
  },
  created() {},
  mounted() {
     
     this.html = `<span class="suffix-icon" >
        <i class="iconfont icon-search icon-click" click="${this.click}"></i>
    </span>`
    this.setHtml();
    this._initEvent();
  },
  methods: {
    setValue(val) {
      this.lookValue = val;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
    setHtml() {
       let dom = document.getElementById(this.dateId);
       $('#'+this.dateId).append(this.html)
    },
    _initEvent() {
      let that = this;
      this.$nextTick(() =>{
         let $body = this.body;
         eventDelegation($body,"click",".icon-click",function(e,el){
            if (el.getAttribute("click")) {
                let obj = that._getEvent(el.getAttribute("click"));
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
         })
      })
    },
    //获取事件
    _getEvent(eve) {
      let edittype = String(eve);
      let eventName = "";
      let param = "";
      let $event = "";
      let leftIndex = edittype.indexOf("(");
      let rightIndex = edittype.indexOf(")");
      if (leftIndex != -1) {
        eventName = edittype.substring(edittype.indexOf("=") + 1, leftIndex);
        $event = eventName + "(" + param + ")";
      }
      return {
        event: $event,
        eventName: eventName,
        param:param
      };
    },

  }
};
</script>
<style scoped lang="scss">
  @import "../icon.css";
 
</style>
