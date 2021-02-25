<template>
  <div class="v-form-box">
    <label
      class="checked v-checkbox"
      v-for="(item, index) in this.CheckData.opt"
      :key="index"
    >
      <input type="checkbox" v-model="checkboxValue" :value="item.value"   :disabled="edit.isDisabled == false ? true : false" />
      <span class="checkbox-text">{{ item.value }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "v-checkbox",
  data() {
    return {
      checkboxValue: this.value != "" ? this.value : [],
      edit:{
        isDisabled: JSON.parse(this.disabled ? this.disabled : true)
      }
      
    };
  },
  props: {
    CheckData: {
      type: Object,
    },
    value: {
      type: String,
    },
    disabled: {
      type: String,
    },
  },
  watch: {
    checkboxValue(data) {
      this.$emit("update:value", this.checkboxValue);
    },
    disabled(data) {
      this.$emit("updata:disabled",data);
      this.$set(this.edit,'isDisabled',JSON.parse(data ? data : true));
    }
  },
  created() {},
  mounted() {},
  methods: {
    setValue(val) {
      this.checkboxValue = val;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
.v-checkbox {
  height: 100%;
  margin-left: 5px;
  font-size: 14px;
  color: #555;
}
</style>