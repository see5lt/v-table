<template>
  <div class="v-form-box">
    <label
      class="checked v-radio"
      v-for="(item, index) in this.RadioData.opt"
      :key="index"
    >
      <input
        type="radio"
        :name="'radio'"
        v-model="radioValue"
        :disabled="edit.isDisabled == false ? true : false"
        :value="item.value"
      />
      <span class="radio-text">{{ item.value }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "v-radio",
  data() {
    return {
      radioValue: this.value,
      edit:{
        isDisabled: JSON.parse(this.disabled ? this.disabled : true)
      }
    };
  },
  props: {
    RadioData: {
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
    value(data) {},
    disabled(data) {
      this.$emit("updata:disabled",data);
      this.$set(this.edit,'isDisabled',JSON.parse(data ? data : true));
    },
    radioValue(data) {
      this.$emit("update:value", this.radioValue);
    },
  },
  created() {},
  mounted() {},
  methods: {
    setValue(value) {
      this.radioValue = value;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
.v-radio {
  height: 100%;
  margin-left: 5px;
  font-size: 14px;
  color: #555;
}
</style>
