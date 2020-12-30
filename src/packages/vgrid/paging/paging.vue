<template>
	<div class="paging">
		<span class="page-total">共{{total}}条</span>
		<ul class="page-ul">
			<li :key="index" v-for="(item,index) in limitList" :class ="item.class" @click.stop="setPage(item.page)" v-html="item.html">
			</li>
		</ul>
		<select class="page-select" @change="selectChange" :value="pageSize">
			<option v-for="(val,key) in pageList" :value="val" :key="key" >每页{{val}}条</option>
		</select>
		<div class="page-search">
			当前第{{page}}页/共{{totalPage}}页&nbsp;&nbsp;
			转到<input type="number" class="pager-search-input" v-model="skipPage" v-on:keyup.13="setPage(skipPage)">页
			<a class="pager-search-btn" @click.stop="setPage(skipPage)">确定</a>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'paging',
        props: {
			total: {
			    type: [Number],
			    default:0
			},
			prevHtml: {
			    type: [String],
			    default:"上一页"
			},
			nextHtml: {
			    type: [String],
			    default:"下一页"
			},
			page: {
			    type: [Number],
			    default:1
			},
			pageSize: {
			    type: [Number],
			    default:20
			},
			pageList: {
			    type: Array,
			    default: function () {
			        return [50, 100, 300, 500]
			    }
			},
			maxPage: {
			    type: [Number],
			    default:4
			}
        },
        data() {
            return {
				skipPage:1
            }
        },
		computed: {
			limitList: function() {
				var _this = this,
					limitList = [];
				let pageCount = Math.ceil(_this.total / _this.pageSize);
				let page = _this.page;
				let prevHtml = _this.prevHtml ? _this.prevHtml : '&lt;';
				let nextHtml = _this.nextHtml ? _this.nextHtml : '&gt;';
				let maxPage = _this.maxPage ? _this.maxPage : 9;
			
				let hasPrev = page > 1;
				let hasNext = page < pageCount;
			
				//上一页
				limitList.push({
					class: hasPrev ? '' : 'disabled',
					page: hasPrev ? page - 1 : page,
					html: prevHtml
				});
			
				//首页
				limitList.push({
					class: page == 1 ? 'active' : '',
					page: 1,
					html: 1
				});
			
				var p0 = Math.floor(maxPage / 2);
				var p1 = 1 + 2 + p0; //首页+省略至少2个页码+中间页面数的一半
			
				var start, end;
				if(page >= p1) {
					start = page - p0;
					//前置省略号
					limitList.push({
						class: 'dot',
						page: page,
						html: '...'
					});
				} else {
					start = 2;
				}
			
				var p2 = page + p0;
				if(p2 < pageCount) {
					end = p2;
				} else {
					end = pageCount - 1;
				}
			
				//页码列表
				for(let i = start; i <= end; i++) {
					limitList.push({
						class: page == i ? 'active' : '',
						page: i,
						html: i
					});
				}
			
				if(end < pageCount - 1) {
					//后置省略号
					limitList.push({
						class: 'dot',
						page: page,
						html: '...'
					});
				}
			
				//尾页
				if(pageCount > 1) {
					limitList.push({
						class: page == pageCount ? 'active' : '',
						page: pageCount,
						html: pageCount
					});
				}
			
				//下一页
				limitList.push({
					class: hasNext ? '' : 'disabled',
					page: hasNext ? page + 1 : page,
					html: nextHtml
				});
				return limitList;
			},
			totalPage(){
				return Math.ceil(this.total / this.pageSize);
			}
		},
		watch:{
			page(newVal){
				this.setSkipPage();
			},
			total(newVal){
				this.setSkipPage();
			}
		},
		mounted() {
			this.setSkipPage();
		},
		methods: {
			setPage: function(page) {
				if(page != this.page) {
					if(page > this.totalPage){
						this.skipPage = this.totalPage;
						this.$emit('pagehandler',this.totalPage,Number(this.pageSize));
					}else{
						this.$emit('pagehandler', Number(page), Number(this.pageSize) );
					}
				}
			},
			setSkipPage(){
				this.skipPage = this.page + 1 > this.totalPage ? 1 : this.page+1;
			},
			selectChange(e){
				this.$emit('pagehandler',1,Number(e.target.value));
			}
		}
    }
</script>
