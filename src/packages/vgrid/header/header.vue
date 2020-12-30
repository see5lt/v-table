<template>
  <div>
    <div class="dy-grid-title__left">
      <span class="title" v-html="title"></span>
      <svg class="icon dy-grid-refresh__btn" @click="headHandler('refresh')" v-if="showRefresh">
        <use xlink:href="#iconshuaxin"></use>
      </svg>
    </div>
    <div class="dy-grid-title__center">
      <slot name="headHtml"></slot>
    </div>
    <div class="dy-grid-title__right">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'table-header-title',
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
<style scope>
  .title {
    /* margin-right: 10px; */
    /* display: inline-block; */
    /* height: 20px; */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
