<template>
  <div id="app">
    <div style="height:auto;width: 1000px;position: absolute;left: 30px;top: 20px;">
      <v-form
        ref="form"
        entity="TmAdminUser"
        style="height: 800px"
        keys="user_id"
      >
        <template slot="buttons">
            <v-button type="primary" text="保存"  @click="save"></v-button>
            <v-button type="primary" text="保存&关闭" > </v-button>
        </template>
        <template slot="headHtml">
           <div style="height: 100%;overflow: hidden;">标题标题标题</div>
        </template>
        <template slot="cells"> 
             <tab title="基本信息">
                 <section title="基础信息">
                     <cells  cols="2">
                         <cell type="text"   title="用户id"   field="user_id"   req="false"  col="1"></cell>
                         <cell type="text"   title="用户名"    field="user_name" edit="false"  req="false"  col="1"></cell>
                         <cell type="lookup" title="lookup"    click="lookup()"   edit="false" field="asd" col="1"   needsave="false" ></cell>
                         <cell type="text"   title="用户代码"   field="user_code" req="false" col="2"></cell>
                         <cell type="file"   title="用户代码"   showtype="1"  business_guid="1111" business_type="拟更新范围图"   field="" req="false" col="2"></cell>
                         <cell type="file"   title="用户代码11" showtype="1"  business_guid="2222" business_type="规划效果图"   field="" req="false" col="2"></cell>
                         <cell type="text"   title="密码"   field="user_pwd" req="false"  col="1">
                             <!-- <opt value="所属网格1"></opt>
                             <opt value="所属网格2"></opt> -->
                         </cell>
                         <cell type="select" title="status"  field="status" req="false"  col="1">
                             <opt value="正常"></opt>
                             <opt value="禁用"></opt>
                         </cell>
                        
                         <cell type="number" title="num1"   field="num1" req="false"   col="1">
                           
                         </cell>
                         <cell type="datetime" title="启动日期"  field="creator" req="false" col="1"></cell>
                         <cell type="datetime" title="创建日期"  field="create_time" req="false" col="1"></cell>
                         <cell type="number" title="num2"     field="num2" req="false"  col="1">
                            
                         </cell>
                         <cell type="blank" title="占位" col="1"></cell>
                         <!-- <cell type="textarea" title="备注" edit="true"  field="proj_sbzt_fr" req="false" col="2"></cell> -->
                     </cells>
                 </section>
                 <section title="证载情况" id="zhengzai">
                      
                 </section>
                 <section title="测绘信息" id="cehui">
                      <cells titlewidth="100" cols="4">
                         <cell type="text" field="aa" title="实测建基面积" needsave="false"  col="2"></cell>
                         <cell type="text" field="bb" title="实测建筑面积" needsave="false"    col="2"></cell>
                         <cell type="text" field="cc" title="实际结构"     needsave="false"  col="2"></cell>
                         <cell type="text" field="dd" title="实际层数"     needsave="false"  col="2"></cell>
                         <cell type="text" field="ee" title="2009年12月31日前现状不超3.5层建筑面积" needsave="false"  col="2"></cell>
                         <cell type="text" field="ff" title="2009年12月31日前现状超3.5层部分建筑面积" needsave="false"    col="2"></cell>
                         <cell type="text" field="gg" title="住改商面积" needsave="false"  col="2"></cell>
                         <cell type="text" field="hh" title="住改商类型" needsave="false"    col="2"></cell>
                     </cells>
                 </section>
                 <section title="可计面积">
                    <cells titlewidth="100" cols="4">
                         <cell type="text"   title="主数据项目编码" needsave="false"  field="qq" col="2"></cell>
                         <cell type="number" title="主数据项目名称" needsave="false"  field="ww" col="2"></cell>
                         <cell type="number" title="按证载"        needsave="false"    field="rr" col="2"></cell>
                         <cell type="number" title="按实测"        needsave="false"    field="tt" col="2"></cell>
                         <cell type="number" title="可计层数"      needsave="false"    field="yy" col="2"></cell>
                         <cell type="number" title="融资房总量"    needsave="false"  field="uu" col="2"></cell>
                     </cells>  
                 </section>
            </tab>
            <tab title="权利人">
                 <section title="权利人1">
                     <cells titlewidth="100" cols="4"> 
                        <cell type="text" title="权利人数" field="qlr" col="2"></cell>
                        <cell type="text" title="权利人数" edit="true" field="qlr1" col="2"></cell>
                     </cells>
                 </section>
                 <section title="权利人2">
                     <cells titlewidth="100" cols="2">
                         <cell type="text" title="权利人数" field="ql" col="1"></cell>
                         <cell type="text" title="权利人数" field="ql2" col="1"></cell>
                     </cells>
                 </section>
            </tab>
            <tab title="面积构成">
                <section title="面积构成1"> 
                    <cells titlewidth="100" cols="2">
                         <cell type="text" title="面积构成" field="mj" col="1"></cell>
                         <cell type="text" title="面积构成" field="mj1" col="1"></cell>
                     </cells>
                </section>
                 <section title="面积构成2"> 
                    <cells titlewidth="100" cols="2">
                         <cell type="text" title="面积构成" field="mj2" col="1"></cell>
                         <cell type="text" title="面积构成" field="m2" col="1"></cell>
                     </cells>
                </section>
            </tab>
        </template>
         <template slot="zhengzai">
             <v-grid title="证载情况列表"  ref="grid1"  :entity="'TmAdminUser'" url="http://localhost:5003/api/Common/Grid/GetData" :show-titleRow="false" :show-footer="false" :show-index="false" :show-checkbox="false" :show-page="false">
                  <template slot="cells">
                       <cell type="text" title="证件类型"     field="user_name" align="left" width="100"  req="false" edit="false" merge="false"></cell>
                       <cell type="text" title="证件号码"     field="user_code" align="left" width="100"  req="false" edit="false" merge="false"></cell>
                       <cell type="text" title="证载用地面积" field="status" align="left" width="150"  req="false" edit="false" merge="false"></cell>
                       <cell type="text" title="证载建基面积" field="create_time" align="left" width="150"  req="false" edit="false" merge="false"></cell>
                       <cell type="text" title="证载建筑面积" field="user_id" align="left" width="100"  req="false" edit="false" merge="false"></cell>
                  </template>
             </v-grid>
         </template>
    </v-form>
 </div>
 <div style="height: 500px;width: 800px;position: absolute;right: 30px;top: 20px;">
     <v-grid 
        title="标题"
        ref="grid"
        id="grid"
        url="http://localhost:5003/api/Common/Grid/GetData"
        :entity="'TmAdminUser'"
        @row-dblClick="rowDblClick"
        asp-funccode="100102"
        >
        <template slot="headHtml">
            头部html
        </template>

        <template slot="buttons">
            <v-button type="text" text="添加" ></v-button>
            <v-button type="text" text="获取选中行数据"></v-button>
            <v-button type="warn" text="更多">
                <li >更新行数据</li>
                <li >选中行</li>
                <li >取消选中</li>
            </v-button>
        </template>

        <template slot="cells">
            <cell type="link" title="用户代码" url="/app/applist?user_id={user_id}&user_name={user_name}" field="user_code" align="left" width="100" sort="true" req="false" edit="false" merge="false">
            </cell>
            <cell type="text" title="账号状态" field="status" align="left" width="100"  req="false"
            edit="false" merge="false"></cell>
            <cell type="text" title="账号状态" field="status" align="left" width="100"  req="false"
                edit="false" merge="false"></cell>
            <cell type="text" title="创建时间" total="[create_time]" field="create_time" align="left" width="100" sort="true" req="false"
                edit="false" merge="false" acc="2"></cell>
            <cell type="text" title="用户id" field="user_id" align="left" width="200" sort="true" req="false" edit="false" merge="false"></cell>
            <cell type="btn" title="操作" align="center" width="100">
                    <btn name="查看" click="lookRow(index,row)"> </btn>
                    <btn name="修改" click="editRow(index,row)"> </btn>
                    <btn name="更多" >
                    <btn name="添加"></btn>
                    <btn name="删除"></btn>
                    <btn name="修改"></btn>
                </btn>
            </cell>
        </template>

        <template slot="foothtml">
            <div style="height: 100%;overflow: hidden;">尾部html</div>
        </template>
    </v-grid>
</div>
</div>
</template>

<script>
import $ from "jquery";
export default {
  name: "app",
  data() {
    return {
      tableData: [],
      data: [],
      data2: [],
    };
  },
  mounted() {
    this.$refs["form"].loadData();
    this.$refs["grid"].load();
    // this.$refs["form"].setValue("user_id","2010-01-01");
    //  this.$refs["form"].setValue("codesss",'1008');
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
    getData() {
      console.log(this.$refs["grid"].getData());
    },
    add() {
      console.log("add");
    },
    lookup() {
      console.log('lookup');
    },
    save() {
      let form = this.$refs["form"];
      //  let data = form.getData();

      //  console.log(data)
      //  let projCode = form.getValue('proj_code');
      //   console.log(form);
      //   form.setValue('proj_code','ceshi');
      //  form.setValue('proj_type',['多选1','多选2']);
      // form.get(uid)

      //   let data = {
      //       url:'http://localhost:5003/api/Common/Form/Save',
      //       data: form.getData()
      //   }
      form.setAllDisabled();
      console.log(this.$refs["form"].getData());
      //  let form = this.$refs["form"];
      //  form.save();

      //  form.setDisabled('user_id',true);

      // form.setDisplay('proj_code',true);
      // form.setAllDisabled('proj_code',true);
      // form.save();
      // form.beforeSave(function(data){
      //     console.log(data)
      // })
      // form.afterSave(function(data){
      //     console.log(data)
      // })
    },
    lookRow(i, row) {
      console.log(i, row);
    },
    editRow(index, row) {
      console.log(index, row);
    },
    openUrl() {},
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
      console.log("单击");
    },
    rowDblClick() {
      console.log("双击");
    }
  },
};
</script>

<style lang="scss">
</style>
