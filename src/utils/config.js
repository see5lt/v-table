// 全局配置

const config = {
	"v-button":{
		color:"#fff",					//字体颜色
		showIcon:true,					//是否显示图标
		bgColor:"#1E9FFF", 				//背景色
		hoverBgColor:"#0e8dea",			//鼠标经过时的背景色
		round:"3px",					//是否圆角
		class:""						//默认添加的class
	},
	
	"v-grid":{
		height:'100%',					//高度
		width:'100%',					//宽度
		url:'',  //表格接口
		params:{},  					//表格参数
		headers:{},  					//请求头部
		timeout:0,  					//请求超时时间
		parsData:{						//将返回的任意数据格式解析成 grid 组件规定的数据格式
			'code': 'Code',
			'msg': 'Message',
			'total': 'Data.total',
			'data': 'Data.data',
			'summary':'Data.summary'
		},
		showIndex:true,					//显示索引列
		showCheckbox:true,				//显示复选框
		showTitleRow:true,  			//显示标题行
		showFooter:true,				//显示底部html
		showRefreshBtn:true,  			//显示刷新按钮
		showPage:true,  				//显示分页
		pageSize:10,  					//每页显示的条数，必须在 page-list属性 中存在
		pageList:[10, 30, 50, 100],  	//分页的下拉选择框
		enableAllSort:true,  			//启用所有排序
		remoteSort:true,  				//是否远程排序-将会在请求添加参数
		fixedIndexColumn:true,  		//固定索引列和复选框列
		cellResize:true,  				//允许拖动行大小
		totalRowHeight:34,  			//汇总行高度
		totalRowTitle:"合计:",  		//汇总行标题
		remoteSummary:false,  			//是否远程汇总-将会根据接口返回的值进行汇总，格式 summary:{字段：100}
		emptyTips:"暂无数据",  			//无数据时的提示文本
		autoLoad:false,  				//是否表格准备好就请求数据
		stripe:true,					//是否为斑马纹 table
		border:false,					//是否带有纵向边框
		highlightCurrentRow:true,		//是否高亮当前行
		acc:2,							//小数位
		enabledPermil:true,				//number类型启用千分号
	}
};

export default config

