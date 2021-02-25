<template>
  <div class="v-form-box">
    <input
      :type="inputData.type"
      v-model="inputValue"
      :disabled="edit.isDisabled == false ? true : false"
      :value="inputData.type"
      :class="{
        'v-input-control': true,
        't-right': inputData.type == 'number' ? true : false,
      }"
    />
    <div v-if="inputData.req == 'true'" class="v-box-info">
      <p
        class="xxx"
        style="
          width: 20px;
          height: 20px;
          margin: 0;
          position: absolute;
          left: 5px;
        "
      ></p>
      <span class="suffix-text">请填写信息！</span>
      <span class="dec">
        <s class="dec1">◆</s>
        <s class="dec2">◆</s>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-input",
  data() {
    return {
      inputValue: this.value,
      edit: {
        isDisabled: JSON.parse(this.disabled ? this.disabled : true),
      },
    };
  },
  props: {
    value: {
      type: String,
    },
    inputData: {
      type: Object,
    },
    disabled: {
      type: String,
    },
  },
  watch: {
    inputValue(data) {
      this.$emit("update:value", this.inputValue);
    },
    disabled(data) {
      this.$emit("updata:disabled", data);
      this.$set(this.edit, "isDisabled", JSON.parse(data ? data : true));
    },
  },
  created() {
   // console.log(this.disabled);
  },
  mounted() {},
  methods: {
    setValue(value) {
      this.inputValue = value;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
