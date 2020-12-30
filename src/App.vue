<template>
	<div id="app" >
      
    <div style="height:600px;width:1000px;margin:20px auto">
      <v-grid ref="grid"
        id="gridDemo"
        :key-name = "'id'"
        :height="'100%'"
        url="http://localhost:5003/api/Common/Grid/GetData"
        :parse-data="{'code':'Code', 'msg':'Message', 'total':'Data.dataCount', 'data':'Data.data', 'summary':'Data.summaryData'}"
        title="表格1"
        @loadSuccess="successFn"
      
        @rowDblClick="rowDblClick"
        :show-refresh-btn="true"
        :entity="'TmAdminUser'"
    
      >
        <template slot="headHtml">
          <div style="height: 100%;overflow: hidden;">头部html</div>
        </template>

        <template slot="buttons">
          <!-- 按钮区 -->
          <v-button type="primary" text="获取数据" @click="getData" class=""/>
          <v-button type="primary" text="获取选中"  />
          <v-button type="primary" text="刷新grid" @click="refresh" />
          <v-button type="warn" text="更多">
                <li >更新行数据</li>
                <li >选中行</li>
                <li >取消选中</li>
          </v-button>

        </template>
        <template slot="cells">
                <cell type="text" title="用户名称"  field ="user_name" align="center" width="100" sort="true"  vtype="*" merge="false" data="[{text:'男',value:'男'},{text:'女',value:'女'}]"></cell>
                <cell type="link" title="用户代码" field="user_code" url="/user/userdetails?user_id={user_id}&user_name={user_name}"  align="left" width="100" > </cell>
                <cell type="link" title="账号状态" field="status" click="openUrl()" align="left" width="100" sort="true" req="false" edit="false" merge="false"></cell>
                <cell type="datetime" title="创建时间"  field="create_time" total="[create_time]" align="left" width="100" sort="true" req="false" edit="false" merge="false" acc="2"></cell>
                <cell type="text" title="用户id" field="user_id" align="left" width="200" sort="true" req="false" edit="false" merge="false"></cell>
                <cell type="btn" title="操作" align="center" width="100">
                    <btn  name="查看" click="editRow(index,row)"></btn>
                    <btn  name="修改" click="editRow(index,row)"></btn>
                    <btn  name="更多" >
                        <btn name="添加"></btn>
                        <btn name="删除"></btn>
                        <btn name="修改"></btn>
                    </btn>
                </cell>
        </template>

        <template slot="foothtml">
            <div style="height: 100%;overflow: hidden;" ></div>
        </template>
      </v-grid>

    </div>
	</div>
</template>

<script>

import $ from 'jquery'
export default {
	name: 'app',
	data () {
		return {
      tableData:[],
      data:[],
      data2:[]
		}
	},
	mounted() {

     this.$refs["grid"].load();

      //  this.data = [{}];
     //   gridDemo.load();
    //    gridDemo1.load();
      //  this.data2  = [{},{}]
     //  grid.addFilter("xxx",">=","xxx");
      // var filter1 = gridDemo.addFilter('user_id','>=','1');
      // var filter2 = gridDemo.addFilter('user_name','like','1');
      // var filter3children = gridDemo.addFilter('user_id','>=','1','or')
      // var filter3 = gridDemo.addFilter('user_id','>=','1','and', filter3children);
    
    // gridDemo.load([{condition:'and',Field:{Name:'user_name',Opera:'like',Value:'1'}}]);
   //  gridDemo.load();
    // gridDemo1.load();
      
	},
	methods: { 

      getData(){	
        console.log(gridDemo.getData()); 
      }, 
      editRow(i,row){
        console.log(i,row)
      },
      openUrl() {
        console.log('open')
      },
      deleteData() {
        var data = gridDemo.getSelectedRows();
        console.log(data);
      },
      refresh() {
        gridDemo.refresh();
       
      },
      successFn() {
      //  console.log('加载完成')
      },
      rowClick() {
        console.log('单击')
      },
      rowDblClick() {
        console.log('双击')
      }
     
  }
}

</script>

<style lang="scss">

</style>
