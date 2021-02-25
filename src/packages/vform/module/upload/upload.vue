<template>
    <uploader ref="uploader" :autoStart="false" :options="options" class="uploader-example" @file-success="onFileSuccess" @file-added="onFileAdded">
        <uploader-unsupport></uploader-unsupport>
            <uploader-drop>
              <span class="drop-title orage">*文档分类:</span>  
              <select class="v-select">
                  <option :value="uploadType.business_type">{{uploadType.business_type}}</option>
              </select>
              <br>
              <span class="drop-title orage">*选择文件:</span>  <uploader-btn class="uploadBtn">点击选择</uploader-btn>
                <!-- <uploader-btn class="uploadBtn" :attrs="attrs">上传图片</uploader-btn>
                <uploader-btn class="uploadBtn" :directory="true">上传文件夹</uploader-btn> -->
            </uploader-drop>
        <div class="upload-title">
            <span style="width:45%;text-indent: 14px;">文档名称</span>
            <span style="width:12%;text-indent: 10px;">文档大小</span>
            <span style="width:28%">文档描述</span>
            <span style="width:15%;text-align:center">操作</span>
        </div>
        <!-- <uploader-list></uploader-list> -->
        <div class="upload-list">
             <ul>
                 <li style="height:35px;line-height:35px" v-for="(item,index) in this.fileList" :key="index">
                    <div class="uploader-file-info">
                       <div class="uploader-file-name"><i class="uploader-file-icon" :icon="fileCategory(item.name)"></i>{{item.name}}</div>
                        <div class="uploader-file-size">{{getFileSize(item.size)}}</div>
                        <div class="uploader-file-meta"> <input class="v-input-control" v-model="item.file_description"> </div>
                        <div class="uploader-file-actions">
                            <span class="uploader-file-remove" @click="remove(item)">删除</span>
                        </div> 
                    </div>
                 </li>
             </ul>
        </div> 
    </uploader>
</template>

<script>
import $ from 'jquery'
import SparkMD5 from 'spark-md5'
import { ajax } from '@/utils/index'
export default {
    name:'v-update',
    data() {
        return {
            chunk_guid: '',
            extension: '',
            fileUrl:'//localhost:5003/api/Common/File/Merge',
            aliyunOss:'1',
            fileList:[],
            options:{
                target:'//localhost:5003/api/Common/File/Upload',  //url
                testChunks:false,                                  //是否开启服务器分片校验
                chunkSize: 5 * 1024 * 1000,                       // 分块大小
                headers:{
                    // Authorization: "Bearer " access_token
                },
                simultaneousUploads:5,
            },
            attrs:{
                accept:'image/*'
            },
            
        };
    },
    props:{
        uploadType:{
            type: Object
        }
    },
    computed:{
      
    },
    created() {

    },
    mounted() {
       
    },
    methods: {
        onFileSuccess(rootFile, file, response, chunk) {
            let res = JSON.parse(response);
            let that = this;
            if(res.Data.chunked) {
                let data = {
                        guid: that.chunk_guid,
                        fileExt: res.Data.fileExt,
                        fileName: res.Data.fileName,
                        aliyunOss: that.aliyunOss,
                        business_type: that.uploadType.business_type,
                        business_guid: that.uploadType.business_guid,
                        file_description: file.file_description
                    }
                ajax.post(that.fileUrl,data,function(res){
                         if(res.Data.hasError) {
                            console.log('文件合并失败')
                        } else {
                            that.$emit('uploadsuccess');
                            that.crearList();
                        }
                })
                // $.ajax({
                //     type:'post',
                //     url:'http//localhost:5003/api/Common/File/Merge',
                //     // headers: { "Authorization": "Bearer " + access_token },
                //     data:{
                //         guid: that.chunk_guid,
                //         fileExt: res.Data.fileExt,
                //         fileName: res.Data.fileName,
                //         aliyunOss: that.aliyunOss,
                //         business_type: that.uploadType.business_type,
                //         business_guid: that.uploadType.business_guid,
                //         file_description: file.file_description
                //     },
                //     success:function(res) {
                //         if(res.Data.hasError) {
                //             console.log('文件合并失败')
                //         } else {
                //             that.$emit('uploadsuccess');
                //             that.crearList();
                //         }
                //     }
                // })
            }
        },
        crearList() {
            this.fileList = []; 
        },
        onFileAdded(file) {
            //计算md5
             let fileReader = new FileReader();
             let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
             let currentChunk = 0;
             const chunkSize = 2 * 1024 * 1000;
             let chunks = Math.ceil(file.size / chunkSize);
             let spark = new SparkMD5.ArrayBuffer();
             file.pause();

             loadNext();
             fileReader.onload = (e =>{
                 spark.append(e.target.result); 
                  if (currentChunk < chunks) { 
                      currentChunk++;
                      loadNext();
                  }else {
                      let md5 = spark.end();
                      this.computeMD5Success(md5, file);
                  }
             })

             function loadNext() {
                let start = currentChunk * chunkSize;
                let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
            }
        },
        computeMD5Success(md5,file) {
           let uploader = this.$refs.uploader.uploader;
           console.log(file);
           this.fileList = this.$refs.uploader.fileList;
           this.chunk_guid = md5;
           Object.assign(uploader.opts,{
               query:{
                   guid:md5,
                   aliyunOss: this.aliyunOss,
                   business_type: this.uploadType.business_type,
                   business_guid: this.uploadType.business_guid,
                   file_description: file.file_description
               }
           })
          // file.resume();
        },
        upload() {
            let list = this.fileList;
            if(list) {
                list.forEach(e =>{
                    e.resume();
                })
            }
        },
        remove(file) {
            console.log(file)
           // file.cancel();
        },
        getFileSize(fileByte) {
            let fileSizeByte = fileByte;
            let fileSizeMsg = "";
            if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
            else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
            else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
            else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
            else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            else fileSizeMsg = "文件超过1TB";
            return fileSizeMsg;
        },
        fileCategory(name) {
            let type = name.split('.')[1];
            const extension = this.extension;
            const typeMap = {
                image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
                video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
                audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
                document: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
            }
            Object.keys(typeMap).forEach((_type) => {
                 const extensions = typeMap[_type]
                if (extensions.indexOf(type) > -1) {
                    type = _type;
                }
            })
            return type;
        }
    }
};
</script>

<style scoped lang="scss">
    .uploader-example {
        width: 100%;
        padding: 0 20px;
        margin: 0px auto 0;
        font-size: 12px;

        // box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    }
    .uploader-example .uploader-btn {
        margin-right: 4px;
    }
    .uploader-example .uploader-list {
        max-height: 440px;
        overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .uploader-file-actions {
        width:15%;
        
    }
    .upload-title {
        width: 100%;
        font-size: 0;
        background: #f6f6f6;
        span {
            display: inline-block;
            font-size: 14px;
            // padding-left: 20px;
            color:#333;
        }
    }
    .uploadBtn {
        height: 30px;
        width: 100px;
        text-align: center;
        background-color: #458cde;
        border-color: #458cde;
        color: #fff;
    }
    .uploadBtn:hover {
        background-color: #2D67AA;
    }
    .drop-title {
        display: inline-block;
        width: 120px;

    }
.v-select {
  width: calc(100% - 125px);
  height: 28px;
  border-color: #ddd;
  font-size: 14px;
  padding-left:10px;
  color: #555;
}
.v-select:focus {
    border-color:#1E9FFF;
}
.upload-list {
    width: 100%;
}
</style>
