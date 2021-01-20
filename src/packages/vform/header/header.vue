<template>
  <div>
    <div class="v-form-title__left">
       <slot name="button"></slot>
    </div>
    <div class="v-form-title__center">
      <slot name="headHtml"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'form-header',
    props: {
    
    },
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {
      
    }
  }
</script>
<style scope>
  
</style>
