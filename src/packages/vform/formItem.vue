<template>
    <div class="v-form-content">
         <div class="v-form-nav">
             <ul>
                <li v-for="(item,index) in this.cols" :key="index" :class="{active:index == current}" @click="toggle(index,item)">
                    <a href="javascript:void(0);">{{item.title}}</a>
                </li>
             </ul>
         </div>
         <div class="v-form-wrap">
          <div class="v-form-wrap-title">{{warpTitle}}</div>
           <div class="v-form-wrapContent">
               <form autocomplete="off" @keydown="keyDown" @submit="onSubmit">
                   <div class="v-form-item" v-for="(item,index) in this.itemArray" :key="index" :style="{width:(item.col == 1 ? '100%' : '50%')}">
                      <label :class="{ 'orage':item.req == 'true' ? true : false ,'v-form-label':true}" :style="{lineHeight:(item.title.length > 7 ? '16px' : '34px')}">
                        <span v-if="item.req == 'true'">*</span><span>{{item.title}}</span>
                      </label>
                      <div class="v-form-box">
                         <input :type="item.type" :placeholder="item.title" v-bind="item.field" class="v-input-control">
                         <div v-if="item.req == 'true'" class="v-box-info">
                           <p class="xxx" style="width:20px;height:20px;margin:0;position:absolute;left:5px"></p>
                           <span  class="suffix-text"></span>
                         </div>
                      </div>
                   </div>
               </form>
           </div> 
         </div>
    </div>  
</template>

<script>
export default {
    data() {
        return {
          current:0,
          warpTitle:this.cols[0].title,
          itemArray:this.cols[0].cell
        };
    },
    props:{
      cols:{
        type: Array
      }
    },
    created() {
       console.log(this.cols);
    },
    mounted() {

    },
    methods: {
       toggle(index,item) {
          this.current=index;
          this.warpTitle = item.title;
          this.itemArray = item.cell;
         
       },
       keyDown() {
         if(event.keyCode==13)return false;
       },
       onSubmit() {
         return false;
       }
    }
};
</script>

<style scoped lang="scss">

</style>
