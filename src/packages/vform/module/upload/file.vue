<template>
    <div class="v-form-box">
         <a class="v-link" style="margin:0 4px;" @click="openList">相关附件 <span>(0)</span></a>
         <a class="update-button" @click="openUpload">上传附件</a>
        <el-dialog title="上传附件" :visible.sync="dialogVisible" width="40%"  @close="handleClose" :close-on-click-modal="ismodalClose">
                <v-upload style="z-index:999" ref="upload" :uploadType="uploadType" @uploadsuccess="uploadSuccess"></v-upload> 
                <span slot="footer" class="dialog-footer">
                    <a class="file-button" style="margin:5px 6px 5px 6px" @click="upload">确 定</a>
                    <a class="file-button" style="margin:5px 6px 5px 6px" @click="dialogVisible = false">取 消</a>
                </span>
        </el-dialog>
        <el-dialog title="附件列表" :visible.sync="uploadList" width="40%" :close-on-click-modal="ismodalClose">
                <upload-list @openUpload="openUpload"> </upload-list>
        </el-dialog>
    </div>
</template>

<script>
import vUpload from './upload'
import uploadList from './upload-list'
import $ from 'jquery'
import { ajax } from '@/utils/index'
export default {
    name:'v-file',
    data() {
        return {
            fileUrl:'/api/Common/File/Get',
            dialogVisible:false,
            ismodalClose:false,
            uploadList:false,
            uploadType:{
                business_type: this.fileData.business_type,
                business_guid: this.fileData.business_guid
            }  
        };
    },
    props:{
        fileData:{
            type: Object
        }
    },
    components:{
        vUpload,
        uploadList
    },
    created() {

    },
    mounted() {
        this.getUploadList();
    },
    methods: {
        openUpload() {
            this.dialogVisible = true;
        },
        openList() {
            this.uploadList = true;
        },
        upload() {
            this.$refs['upload'].upload();
        },
        uploadSuccess() {
            this.dialogVisible = false;
        },
        handleClose() {
            this.$refs['upload'].crearList();
        },
        getUploadList() {
            let that = this;
            let data = {
                    business_guid: that.fileData.business_guid,
                    business_type: that.fileData.business_type
                }
            // 加载图片列表

            // ajax.get(that.fileUrl,data,function(res){
            //     console.log(res)
            // })
          
        }
    }
};
</script>

<style scoped lang="scss">
    .v-link {
        color:#00f;
        text-decoration: underline;
        line-height: 24px;
        font-size: 14px;
    }
    .update-button {
        font-size: 14px;
        line-height: 16px;
        margin-left: 10px;
        padding: 1px 6px;
        background-color: rgb(239, 239, 239);
        border: 1px solid rgb(118, 118, 118);
      //  border-color: rgb(118, 118, 118);
        border-radius: 3px;
    }
    .update-button:hover {
        background-color: #E5E5E5;
    }
    .dialog-footer {

        a {
            font-size: 14px;
        }
    }
    
</style>
