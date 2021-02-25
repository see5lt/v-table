<template>
    <div class="upload-list">
         <v-grid :show-page="false"  :show-footer="false" title="附件列表" style="border-bottom:none">
              <template slot="buttons">
                    <v-button type="button" text="批量下载" ></v-button>
                    <v-button type="button" text="上传" @click="upload"></v-button>
                    <v-button type="button" text="删除"></v-button>
              </template>
              <template slot="cells">
                  <cell type="text" title="文档名称" field="status" align="left" width="100"></cell>
                  <cell type="text" title="文档分类" field="status" align="left" width="100"></cell>
                  <cell type="text" title="文档描述" field="status" align="left" width="100"></cell>
                  <cell type="text" title="上传人" field="status" align="center" width="100"></cell>
                  <cell type="text" title="上传时间" field="status" align="center" width="100"></cell>
                  <cell type="text" title="操作" field="status" align="center" width="100"></cell>
              </template>
         </v-grid>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        upload() {
            this.$emit("openUpload")
        }
    }
};
</script>

<style scoped lang="scss">
.upload-list {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color:#333;
}
.el-dialog__body {
    padding: 0;
}
</style>
