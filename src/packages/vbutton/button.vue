<template>
	<button class="dy-button"
		:type="type"
		:class="config['class']"
		:style="{backgroundColor:bgColor,color: color ,borderRadius:round}"
		@mouseenter="_mouseover($event)"
		@mouseleave="_mouseout($event)"
		@click="handleClick"
		v-bind:disabled="disabled"
	>
		
		<span>{{text}}</span>
		<svg class="icon" v-if="$slots.default && $slots.default[0]['tag']=='li'">
			<use xlink:href="#iconxia"></use>
		</svg>
		
		<ul v-if="$slots.default && $slots.default[0]['tag']=='li'">
			<slot></slot>
		</ul>
	</button>
</template>

<script>

export default {
	name: 'v-button',
	props: {
		//按钮类型
		type:{
			type: String,
			default: "primary"
		},
		// 显示图标
		showIcon:{
			type: Boolean,
			default: function(){
				let config = this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
				return config.showIcon === false ? false : true;
			}
		},
		//禁用按钮
		disabled:{
			type: Boolean,
			default: false
		},
		//圆角
		round:{
			type: String,
			default: function(){
				let config = this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
				return config['round'] || "0px";
			}
		},
		// 背景色
		bgColor: {
			type: String,
			default: function(){
				let config = this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
				return config['bgColor'] || "";
			}
		},
		// 鼠标经过时的背景色
		hoverBgColor: {
			type: String,
			default: function(){
				let config = this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
				return config['hoverBgColor'] || "";
			}
		},
		// 字体颜色
		color: {
			type: String,
			default: function(){
				let config = this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
				return config['color'] || "";
			}
		},
		icon: String,
		text: String
	},
	computed:{
		config(){
			return this.$dyConfig && this.$dyConfig['dy-buttom'] || {};
		},
		iconClass(){
			return (this.icon).indexOf("&#") == -1 ? this.icon : "";
		},
		iconHtml(){
			return (this.icon).indexOf("&#") != -1 ? this.icon : "";
		}
	},
	mounted() {
	
	},
	methods: {
		handleClick(evt) {
			if(!this.disabled){
				this.$emit('click', evt);
				
			}
		},
    _mouseover(e){
      if(e.target && e.target.className == 'dy-button' && this.hoverBgColor || this.config['hoverBgColor']){
        e.target.style.backgroundColor = this.hoverBgColor || this.config['hoverBgColor'];
      }
    },
    _mouseout(e){
      if(e.target && e.target.className == 'dy-button' && this.bgColor || this.config['bgColor']){
        e.target.style.backgroundColor = this.bgColor || this.config['bgColor'];
      }
    }
	}
}
</script>

<style lang="scss" scoped>
	/* 图标 */
	.iconfont{
		font-size: 15px;
		line-height: 1;
	}
	.icon {
		width: 1em; height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
		font-size:15px;
	}
	.dy-button {
		font-family: '微软雅黑';
		outline: 0;
		box-sizing: border-box;
		display: inline-block;
		color: #fff;
		white-space: nowrap;
		text-align: center;
		border: none;
		border-radius: 2px;
		cursor: pointer;
		background-color: #1E9FFF;
		height: 30px;
		line-height: 30px;
		padding: 0 15px;
		font-size: 14px;
		margin-left:3px;
		position: relative;
		&[disabled]{
			cursor: no-drop;
			opacity: .6;
		}
		&[type='default']{
			background: #FFFFFF !important;
			box-shadow:0 0 2px 0 #ccc;
			color: #606266 !important;
			&:hover{
				background: #ECF5FF !important;
				box-shadow:0 0 2px 0 #409EFF;
				color: #409EFF !important;
			}
		}
		&[type='success']{
			background: #67C23A !important;
			&:hover{
				background: #58b928 !important;
			}
		}
		&[type='info']{
			background: #909399 !important;
			&:hover{
				background: #7f8084 !important;
			}
		}
		&[type='warning']{
			background: #EAB15B !important;
			&:hover{
				background: #cd8f30 !important;
			}
		}
		&[type='danger']{
			background: #f74e4e !important;
			&:hover{
				background: #ec4545 !important;
			}
		}
		ul{
			display: none;
			position: absolute;
			line-height: 36px;
			padding: 5px 0;
			box-shadow: 0 2px 4px rgba(0,0,0,.12);
			border: 1px solid #d2d2d2;
			background-color: #fff;
			z-index: 100;
			border-radius: 2px;
			white-space: nowrap;
			width: 100%;
			min-width: 120%;
			top: 30px;
			opacity: 1 !important;
			right: 0;
			color: #666666;
			z-index:100000;
			margin:0;
			li{
				margin: 0;
				position: relative;
				&:hover{
					background: #f5f5f5;
				}
				a{
					color: #666666;
					text-decoration: none;
				}
			}
		}
		&:hover{
			color: #fff;
			background-color: #0e8dea;
		}
		&:hover ul{
			display: block;
		}
		span,.icon{
		background: none !important;
		}
	}
</style>
