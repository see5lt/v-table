<template>
    <div class="v-form-box" >
        <uploader ref="uploader" class="uploader" :options="options" @file-success="onFileSuccess" @file-added="onFileAdded">
            <uploader-drop>
                <uploader-btn class="uploadBtn">上传文件</uploader-btn>
            </uploader-drop>
    </uploader>
    </div>
</template>

<script>
import $ from 'jquery'
import SparkMD5 from 'spark-md5'
import { ajax } from '@/utils/index'
export default {
    name:"v-showfile",
    data() {
        return {
            chunk_guid: '',
            aliyunOss:'1',
            fileUrl:'/api/Common/File/Merge',
            options:{
                target:'/api/Common/File/Upload',  //url
                testChunks:false,                                  //是否开启服务器分片校验
                chunkSize: 5 * 1024 * 1000,                       // 分块大小
                headers:{
                    // Authorization: "Bearer " access_token
                }
            },
        };
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
                let data  = {
                        guid: that.chunk_guid,
                        fileExt: res.Data.fileExt,
                        fileName: res.Data.fileName,
                        aliyunOss: that.aliyunOss
                    }
                ajax.post(that.fileUrl,data,function(res) {
                   if(res.Data.hasError) {
                        console.log('文件合并失败')
                    } else {

                    }
                })
                // $.ajax({
                //     type:'post',
                //     url:'',
                //     // headers: { "Authorization": "Bearer " + access_token },
                //     data:{
                //         guid: this.chunk_guid,
                //         fileExt: res.Data.fileExt,
                //         fileName: res.Data.fileName,
                //         aliyunOss: this.aliyunOss
                //     },
                //     success:function(res) {
                //         if(res.Data.hasError) {
                //             console.log('文件合并失败')
                //         } else {

                //         }
                //     }
                // })
            }
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
           console.log(md5)
           this.chunk_guid = md5;
           Object.assign(uploader.opts,{
               query:{
                   guid:md5,
                   aliyunOss: this.aliyunOss 
               }
           })
           file.resume();
        }
    }
};
</script>

<style scoped lang="scss">
    .uploader {
        font-size: 14px;
    }
</style>
