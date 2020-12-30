<template>
  <div>
    <div class="dy-grid-title__center">
       <slot name="foothtml"></slot>
    </div>   
  </div>
</template>

<script>
  export default {
    name: 'table-footer',
    props: {
      // 刷新按钮
      showRefresh: {
        type: Boolean,
        default: true
      },
      title: [String]
    },
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {
      headHandler(val) {
        this.$emit('headHandler', val);
      }
    }
  }
</script>
