# component 文档

> 组件文件存放路径  [dist/component.min.js]

## 组件使用规范

* 组件必须放置容器以内，且指定 ` ref ` 属性名称 ;
* 组件属性 横线连接 如 ` showTtitleRow ` 应写成 ` show-titleRow ` ;
* 页面操作代码须在组件生命周期内部书写. 类似 `jq $(function(){  }) `替换为 ` mounted ` 生命周期中 ;
* 函数 方法等一切实例方法在` methods `内部书写 ;
* 变量 常量 在 ` data `内部声明 ;


## 基本使用( grid form ) 示例: 
```html 
  <body> 
     <div id="app" > 
        <!--  grid start -->
        <v-grid 
        title="grid标题" 
        ref="grid" 
        url="http://localhost:5003/api/Common/Grid/GetData" 
        :entity="'TmAdminUser'"
        @load-success="SuccessFn" 
        >

            <template slot="headHtml">
                 <!-- grid -> header 自定义区域 -->
                 <div> header </div>
            </template>

            <template slot="buttons">
                <!--  grid -> button 按钮区域 -->
                <v-button type="primary" text="primary"></v-button>
                <v-button type="default" text="default"></v-button>
                <v-button type="success" text="success"></v-button>
                <v-button type="info"    text="info"></v-button>
                <v-button type="warning" text="warning"></v-button>
                <v-button type="danger"  text="danger"></v-button>
            </template>

            <template slot="cells">
                 <!-- grid -> cell 内容区域  -->
                 <cell type="link"   title="link类型" field="link"   align="left"  width="150" sort="true"  req="false"> </cell>
                 <cell type="text"   title="文本类型" field="text"   align="left"   width="150" sort="true" req="false"> </cell>
                 <cell type="number" title="数字类型" field="number" align="left" width="150" sort="true"   req="false"> </cell>
                 <cell type="text"   title="二级表头" align="center" >
                    <cell type="text"   title="文本类型"   field="text"    align="left" width="100"  sort="true" ></cell>
                    <cell type="number" title="数字类型"   field="number"  align="right" width="100" sort="true" ></cell>
                </cell>
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
                 <!-- grid -> footer 自定义区域 -->
                 <div> footer </div>
            </template>

        </v-grid>
        <!-- grid  end -->
        <!-- form start -->
        <v-form ref="form" entity="TmAdminUser"  keys="user_id">

            <template slot="buttons">
              <!-- form -> button  按钮区域 -->
              <v-button type="primary" text="保存"  ></v-button>
              <v-button type="primary" text="保存&关闭" > </v-button>
           </template>

           <template slot="headHtml">
              <!-- form -> header 标题区域 -->
              <div style="height: 100%;overflow: hidden;">标题</div>
           </template>
           
           <template slot="cells">
                <!-- form -> tab  -->
                <tab title="基本信息"> 
                  <!-- form -> section -->
                    <section title="基础信息">  
                        <cells> 
                            <!-- form -> cell  -->
                            <cell type="text"     title="text类型"    field="user_id"     req="false" col="1"></cell>
                            <cell type="number"   title="number类型"  field="num1"        req="false" col="1">
                            <cell type="datetime" title="日期类型"    field="create_time" req="false" col="1"></cell>
                            <cell type="datetime" title="日期类型"    field="creator"     req="false" col="1"></cell>
                        </cells>
                    </section>
                     <section title="证载情况">
                        <cells>
                           <cell type="file" title="文件类型" showtype="1" business_guid="1111" business_type="拟更新范围图" field="" req="false" col="2"></cell>
                           <cell type="file" title="文件类型" showtype="1"  business_guid="2222" business_type="规划效果图" field="" req="false"  col="2"></cell>
                           <cell type="blank" title="占位类型" col="1"></cell>
                           <cell type="textarea" title="文本域类型" edit="true"  field="proj_sbzt_fr" req="false" col="2"></cell>
                        </cells>
                     </section>
                     <section title="测绘信息">
                         <cells> 
                             <cell type="radio" >
                                  <opt value="单选1"></opt>
                                  <opt value="单选2"></opt> 
                             </cell>
                             <cell type="checkbox" >
                                  <opt value="多选1"></opt>
                                  <opt value="多选2"></opt>
                             </cell>
                             <cell type="select" >
                                  <opt value="下拉1"></opt>
                                  <opt value="下拉2"></opt>
                             </cell>
                             <cell type="lookup" title="lookup类型"    click="lookup()"  field="lookup"  col="1"  needsave="false" ></cell>
                         </cells>
                     </section>
                      <section title="权利人" id="quanliren" >
                        <!-- form 内部使用grid;  -->

                      </section>
                </tab>
                <tab title="权利人">   </tab>
                <tab title="面积构成"> </tab>
           </template>

           <template slot="quanliren">
             <!-- form 内置grid  -->
                  <v-grid 
                  title="权利人"  
                  ref="formGrid"  
                  :entity="'TmAdminUser'" 
                  url="http://localhost:5003/api/Common/Grid/GetData" 
                  :show-titleRow="false" 
                  :show-footer="false"          
                  :show-index="false" 
                  :show-checkbox="false" 
                  :show-page="false">
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
  </body>
```
``` js
<script src="./js/vue.js"> </script>
<script src="./js/component.min.js"> </script>
 
 var page = new Vue({
    el: '#app',
    data: {
      //  变量常量声明
       a : 1
    },
    mounted() {
       // 生命周期  类似jq $(function(){ });
       this.$refs.grid.load();
       this,$refs.formGrid.load([{condition:'and',Field:{Name:'user_name',Opera:'like',Value:'1'}}])
    },
    methods: {
       // 函数 方法等一切实例方法
       SuccessFn() {
         console.log('Grid 加载完成')
      },
    }
 })

```

### 公共Api 

* ` 弹窗 Api`
 |方法 | 描述
 |:-|:-:
 |`$.openWin("url?"+encodeURI($.param(flter, true)), "新增", "600px", "250px");`   | 打开指定大小窗口
 |`$.openFullWin("url?"+encodeURI($.param(flter, true)), "新增");`                 | 打开全屏窗口
 |`$.openModalDialog(content, title, successFn, yesFn, {area:["900px","550px"]})`  | 打开模态窗口
 |`$.openIframe(encodeURI(_url),"新增",["450px","200px"],opt);`                    | iframe窗口
 |`$.confirm(3, "确定取消？", yesFn, {cancelFn:fn})`                                |  确认提示框
 |`$.alert(0, "确定取消？", null);`                                                 |  确认提示框,无取消按钮
 |`$.toast(1, "房屋删除成功");`                                                     |  确认提示框,无取消按钮
 |`window.close()`                                                                 |  关闭当前

* ` number 相关api`
 |方法 | 描述
 |:-|:-:
 |`utils.number.add( num1 , num2 , n )`           | num之间相加方法 , n => 保留n位小数
 |`utils.number.Sub( num1 , num2 , n )`           | num之间相减方法 , n => 保留n位小数
 |`utils.number.Mul( num1 , num2 , n )`           | num之间相乘方法,  n => 保留n位小数
 |`utils.number.Div( num1 , num2 , n )`           | num之间相除方法,  n => 保留n位小数
 |`utils.number.splitNum( num , percent )`        | num 百分比 拆分方法
 |`utils.number.commafy( num )`                   | 千分号
 |`utils.number.delcommafy( num )`                | 去除千分号
 |`utils.number.unique( arr )`                    | 数组去重方法
 |`utils.number.typeConversion( n )`              | 数字类型 123 转为 字符串 '一', '二', '三',
 |`utils.countDecimals ( num )`                   | 计算小数位的长度
 |`uitls.convertToInt( num )`                     | 小数转成整数
 |`utils.getCorrectResult( type, num1, num2, result, n )`| 确认计算结果无误
 |`utils.round( num, decimal )`                   | 四舍五入
 |`utils.getFloat( num, decimal )`                | 保留小数位

* ` ajax Api `
 |方法 | 描述
 |:-|:-:
 |`utils.ajax.get( url, params, successFn, opt )` | ajax get方法  同jq ajax
 |`utils.ajax.post( url, params, successFn, opt )`| ajax post方法 同jq ajax

* ` cookie Api `
 |方法 | 描述
 |:-|:-:
 |`utils.cookie.setCookie( cookieName, cookieValue, expire )` | 设置cookie    expire:有效天数 默认为永久 -1：关闭浏览器失效
 |`utils.cookie.getCookie( cookieName )`|  获取cookie

* ` MD5 Api `
 |方法 | 描述
 |:-|:-:
 |`utils.crypto.md5( string )`| MD5加密 

#### Grid组件Api

* `Grid 属性`
 |Grid 属性 | 默认值 | 类型 | 说明
 |:-|:-:|:-|:-:
 |`height`| 100%  | String |  Grid 默认高度
 |`width` | 100%  | String |  Grid 默认宽度
 |`title` | ''    | String |  Grid 标题
 |`show-index`    | true   | Boolean |  是否显示左侧索引列
 |`show-checkbox` | true   | Boolean |  是否显示左侧选择框
 |`show-title-row`| true   | Boolean |  是否显示头部标题行
 |`show-refresh-btn`| true | Boolean |  是否显示头部刷新按钮
 |`show-page`     | true   | Boolean |  是否显示分页
 |`page-size`     | 50     | Number  |  分页每页显示条数
 |`page-list`     | [10,30,50,100]   |  Array |  分页下拉选择条数
 |`cell-resize`   | true   | Boolean |  是否允许拖动行
 |`total-row-title`| 合计  | String  |   汇总行文字
 |`auto-load` | false | Boolean      |  是否grid自动请求数据(无需调用load()方法)

* `Grid cell属性`
 | cell 属性 | 默认值 | 类型 | 说明
 |:-|:-:|:-|:-:
 |`type`  | text | link/text/number/btn/datetime | 列的类型 如 type = "link"
 |`title` | ''   | String | 标题名称   如 title = "用户名"
 |`field` | ''   | String | 字段名称   如 field = "user_name"
 |`align` | left | left/center/right | 对齐方式 如 align = "center"
 |`width` | ''   | Number    | 宽度   如 width = "120"
 |`sort`  | false | Boolean   | 是否可排序 如 sort = "true"
 |`total` | ''   | [String]  | 合计行 如 total ="[money]"
 |`fixed` | ''   | String(left/right) | 固定列 
 |`name`  | ''   | String   |  type=btn时 定义操作行的按钮名称
 |`click` | ''   | function |  type=btn时,定义操作行的点击事件  如 click="editRow(index,row)"
 |`url `  | ''   | String   | 外部链接, 也可以如 /app/applist?user_id={user_id}&user_name={user_name} 携带参数

* `Grid event`
 | 方法名 | 参数 | 说明
 |:-|:-:|:-
 |`load-success`| data,sum     | 表格渲染完成事件 
 |`row-click`   | row,Rowindex | 行单机事件
 |`row-dblclick`| row,Rowindex | 行双击事件

* `Grid methods`
 | 方法名 |  说明
 |:-|:-:
 |`var vgrid = this.refs.grid `| 获取grid对象 
 |`vgrid.load()`    | 加载grid数据
 |`vgrid.getData()` | 获取grid所有数据
 |`vgrid .refresh`  | 刷新当前grid
 |`vgrid .deleteCell()` | 删除行数据 
 |`vgrid.getSelected()` | 获取当前选中行
 |`v.grid.getSelectAll()`| 获取所有选中行


#### Form组件 Api

* `Form 属性`
 |Form 属性 | 默认值 | 类型 | 说明
 |:-|:-:|:-|:-:
 |`height`| 100%  | String |  Form 默认高度
 |`width` | 100%  | String |  Form 默认宽度
 |`entity`| ''    | String |  实体名称
 |`keys`  | ''    | Boolean |  键
 
* `Form tab 属性`
 |Form tab 属性 | 默认值 | 类型 | 说明
 |:-|:-:|:-|:-:
 |`title` | ""    | String | tab 名称

* `Form section 属性`
 |Form section 属性| 默认值 | 类型 | 说明
 |:-|:-:|:-|:-:
 |`title` | ""    | String | section 名称
 |`id`    | ""    | String | 指定放置grid的模板slot

* `Form cells 属性`
 |Form cells 属性| 默认值   | 类型 | 说明
 |:-|:-:|:-|:-:
 |`cols`  | 1     | Number |  布局总栅格

* `Form cell 属性`
 |Form cell 属性| 默认值    | 类型 | 说明
 |:-|:-:|:-|:-:
 |`type`  | text  | String | form元素 类型可选(text/number/datetime/file/blank/textarea/radio/checkbox/select/lookup)
 |`title` | ""    | String | 标题名称
 |`field` | ""    | String | 字段名称
 |`col`   | ""    | Number | 栅格
 |`edit`  | true  | Boolean| 是否可编辑
 |`needsave`| true |Boolean| 字段是否上传
 |`req`   | true  |Boolean | 是否必填
 |`click` | ""  | Function | type = lookup时,定义的点击事件
 |`showtype`| 1 | Number   | type = file时,定义的上传风格
 |`business_guid`| "" | String | type = file时,定义的id
 |`business_type`|""  | String | type = file时,定义的type
 
* `Form methods`
 | 方法名 | 参数 | 说明
 |:-|:-:|:-
 |`var vform = this.refs.form `| 获取form对象 
 |`vform.getValue` |      key  | 获取单个字段值
 |`vform.getData`  |           | 获取所有字段值
 |`vform.setValue` | key,value | 设置单个字段值
 |`vform.clearData` |          | 清空所有数据
 |`vform.setDisabled` | key,Boolean | 设置单个字段编辑/禁用
 |`vform.save`      |        |  保存方法




