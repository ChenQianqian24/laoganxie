<template>
  <div>
    <el-form label-width="100px" class="demo-ruleForm" style="width:500px">
      <el-form-item label="上传文件">
        <el-upload
          class="upload-demo"
          drag
          :on-change="handleChange"
          :file-list="fileList"
          action="http://94.191.59.11/robot/register"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>

      <el-form-item label="文件名称">
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="text"
          maxlength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="文件摘要">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          maxlength="50"
          show-word-limit
        >
        </el-input>
      </el-form-item>

      <el-form-item label="审批类型">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script
  src="./cos-js-sdk-v5-master/dist/cos-js-sdk-v5.js"
  type="text/javascript"
  charset="utf-8"
></script>
<script>
export default {
  data() {
    return {
      text: '',
      textarea: '',
      fileList: [],
      options: [],
      value: '',
      redata: []
    }
  },
  created() {
    this.$axios
      .post('/robot/json', {
        operation: 'queryEEARulesInf'
      })
      .then(res => {
        this.redata = res.data.data
        this.handleRedata()
        window.console.log(this.redata)
      })
      .catch(err => {
        window.console.log(err)
      })
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleRedata() {
      this.redata.forEach(element => {
        this.options.push({
          value: element.EEARuleID,
          label: element.EEAdescription
        })
      })
    },
    submit() {
      window.console.log(this.fileList[0])
      var cos = new COS({
        SecretId: 'AKIDtbfYCak0rSoOn8OG4ctuhIejjV2Ia7C2',
        SecretKey: 'kRu86pKeiBahZFgkNksuiHbm0zjDRELD'
      })
      if (this.fileList[0]) {
        cos.putObject(
          {
            Bucket: 'eea-files-1258427546', //存储桶用户识别   （必须有）
            Region: 'ap-chongqing', //地区识别（必须有）
            Key: 'CurrentEEAFolder/' + this.fileList[0].name, //此处可以规定文件夹
            StorageClass: 'STANDARD', //可以不写
            Body: JSON.stringify(this.fileList[0]), //上传文件对象（可以不写）
            onProgress: function(progressData) {
              console.log('' + JSON.stringify(progressData))
            }
          },
          function(err, data) {
            /*这里是为了调试你的代码，可以拿到报错信息*/
            console.log(err || data)
            console.log(data) //可以拿到文件地址
          }
        )
      }

      //   let eeAfiles = {
      //     'eeAfiles.fileTitile': this.text,
      //     'eeAfiles.fileSize': this.fileList[0].size,
      //     'eeAfiles.descriptionInf': this.textarea,
      //     'eeAfiles.EEARule': this.redata[0].EEAOrder,
      //     'eeAfiles.EEAInf': null,
      //     'eeAfiles.nextEEAindex': '1', //下一个的索引
      //     'eeAfiles.URL': 'CurrentEEAFolder/' + this.fileList[0].name,
      //     'eeAfiles.EEAState': '0',
      //     'eeAfiles.submissionUserID': '',
      //     'eeAfiles.nextEEAsectionID': this.redata[0].EEAOrder[0],
      //     'eeAfiles.nextEEAauthority': this.redata[0].EEAOrder[1]
      //   }

      //   var arr1 = [
      //     [1, 2, 3],
      //     [4, 5, 6]
      //   ] //this.redata[0].EEAOrder
      //   for (var i = 0; i < arr1.length; i++) {
      //     //定义临时数组
      //     window.console.log(arr1[i])
      //     var temp = new Array(2) //将一维数组再次拆分，准备存入二维数组
      //     temp = arr1[i].split(':') //定义将要存放数据的一维数组的每一个元素都为一个数组(实际上就是定义二维数组了)
      //     arr2[i] = new Array(temp.length) //遍历临时数组将其值存入二维数组
      //     for (var j = 0; j < temp.length; j++) {
      //       arr2[i][j] = temp[j] //完成字符串转换为二维数组
      //     }
      //   }

      window.console.log(arr2, eval(this.redata[0].EEAOrder))
    }
  }
}
</script>
