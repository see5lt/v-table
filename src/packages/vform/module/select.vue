
<template>
  <div class="v-form-box">
    <select
      class="v-select"
      v-model="selectValue"
      :disabled="edit.isDisabled == false ? true : false"
    >
      <option value=""></option>
      <option
        v-for="(item, index) in this.SelectData.opt"
        :key="index"
        :value="item.value"
      >
        {{ item.value }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "v-select",
  data() {
    return {
      selectValue: this.value,
      edit:{
        isDisabled: JSON.parse(this.disabled ? this.disabled : true)
      }
    };
  },
  props: {
    SelectData: {
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
    selectValue(data) {
      this.$emit("update:value", this.selectValue);
    },
    disabled(data) {
      this.$emit("updata:disabled",data);
      this.$set(this.edit,'isDisabled',JSON.parse(data ? data : true));
    },
  },
  created() {
    
  },
  mounted() {},
  methods: {
    setValue(val) {
      this.selectValue = val;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
.v-select {
  width: 100%;
  height: 28px;
  border-color: #ddd;
  font-size: 14px;
  padding-left:10px;
  color: #555;
}
.v-select:focus {
    border-color:#1E9FFF;
}
</style>
