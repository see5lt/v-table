<template>
      <div class="v-tabs">
        <div class="tabs-bar">
        <div class="tabs-bar-nav">
            <div class="tabs-tab" v-for="(tab,index) in tabList"
            :class="[tabIndex == tab.index ? 'tabs-active' : '']"
            @click="changeTab(tab)"
            :key="index"
            >
            {{tab.name}}
            </div>
        </div>
        </div>
        <div class="tabs-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
  name: 'tab',
  props:
  {
    tabList: Array,
    tabIndex: Number
  },
  data () {
    return {
    }
  },
  methods: {
    changeTab: function (tab) {
      this.$emit('changeTab', tab)
    }
  }
}
</script>

  <style scoped lang="scss">
.v-tabs {
  font-size: 14px;
  color: #444;
}
 .tabs-bar {
   border-bottom: 1px solid #eee;
   position: relative;
   padding: 5px 0;
 }
 .tabs-bar-nav {
   display: table;
   margin-left: 35px;
   position: absolute;
   bottom: -1px;
 }
 .tabs-tab {
   min-width: 110px;
   padding: 5px 0;
   position: relative;
   display: inline-block;
   text-align: center;
   cursor: pointer;
 }
 .tabs-active {
   border-top: 1px solid pink;
   border-left: 1px solid pink;
   border-right: 1px solid pink;
   border-bottom: 1px solid #fff;
 }
 .tabs-content {
   padding-left: 20px;
   padding-right: 20px;
   padding-bottom: 30px;
 }
</style>
 
