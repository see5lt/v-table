
<template>
  <div class="v-form-box textarea-box">
    <textarea v-model="textValue" class="v-textarea" maxlength="500" :disabled="edit.isDisabled == false ? true : false" ></textarea>
  </div>
</template>

<script>
export default {
  name: "v-textarea",
  data() {
    return {
      textValue: this.value,
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
    }
  },
  watch: {
    textValue(data) {
      this.$emit("update:value", this.textValue);
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
      this.textValue = val;
    },
    setDisabled(value) {
      this.edit.isDisabled = value;
    },
  },
};
</script>

<style scoped lang="scss">
.textarea-box {
  height: 50px;
}
.v-textarea {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border-color: #ddd;
  font-size: 14px;
  padding-top: 3px;
  color: #555;
}
.v-textarea:focus {
  border-color:#1E9FFF;
}
</style>
