<template>
  <div class="v-form-box">
    <input
      type="text"
      :id="dateId"
      class="laydate-icon date-time"
      v-model="dateValue"
      :disabled="edit.isDisabled == false ? true : false"
      @click="createTime"
    />
  </div>
</template>

<script>
import laydate from "@/utils/laydate";
export default {
  data() {
    return {
      min: "1900-01-01 00:00:00",
      max: "2099-12-31 23:59:59",
      dateValue: this.value,
      edit:{
        isDisabled: JSON.parse(this.disabled ? this.disabled : true)
      },
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
  },
  watch: {
    dateValue(data) {
      this.$emit("update:value", this.dateValue);
    },
    disabled(data) {
      this.$emit("updata:disabled",data);
      this.$set(this.edit,'isDisabled',JSON.parse(data ? data : true));
    }
  },
  created() {},
  mounted() {},
  methods: {
    createTime() {
      let that = this;
      window.laydate({
        elem: `#${this.dateId}`, //目标元素。
        format: "YYYY-MM-DD", //时间格式
        festival: false, //显示节日
        istime: false, //显示时间选项
        choose: function (data) {
          that.$emit("update:value", data);
        },
      });
    },
    setValue(val) {
      this.dateValue = val;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
.date-time {
  width: 100%;
  height: 28px;
  padding-left: 10px;
  color: #555;
}
</style>
