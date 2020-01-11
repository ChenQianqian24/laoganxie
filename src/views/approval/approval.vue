<template>
  <div>
    用户：{{user}}
    <br>

    <router-link :to="{name: '/'}"
                 target=_blank>返回登录</router-link>
    <br>

    <router-link :to="{name: 'rule'}"
                 target=_blank>审批规则注册</router-link>
    <br>

    <router-link :to="{name: 'file'}"
                 target=_blank>审批文件注册</router-link>
    <br>

    <router-link :to="{name: 'Administrative'}"
                 target=_blank>部门注册</router-link>
    <br>

    <el-table ref="singleTable"
              :data="tableData"
              :default-sort="{prop: 'date', order: 'descending'}"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%">

      <el-table-column type="index"
                       width="50">
      </el-table-column>

      <el-table-column property="date"
                       label="日期"
                       sortable
                       width="120">
      </el-table-column>

      <el-table-column property="fileTitile"
                       label="文件名称"
                       width="120">
      </el-table-column>

      <el-table-column property="descriptionInf"
                       label="文件描述"
                       width="120">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleDownload(scope.$index, scope.row)">下载</el-button>

          <el-switch v-model="switchValue"
                     active-text="同意"
                     inactive-text="驳回"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     style="margin:20px">
          </el-switch>

          <el-button size="mini"
                     type="danger"
                     v-if="scope.row.btnStatus"
                     @click="
                     open(scope.row),handleApproval(scope.$index,
                     scope.row)">发布审批</el-button>

          <el-input type="textarea"
                    placeholder="请输入审批意见"
                    v-model=scope.row.approvalSuggestion
                    maxlength="50"
                    show-word-limit
                    autosize
                    style="margin-left:20px; width:400px">
          </el-input>

        </template>
      </el-table-column>

    </el-table>

    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[0])">选中第二行</el-button>
      <el-button @click="setCurrent()">取消选择</el-button>
    </div>

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
      user: '',
      textarea: '',
      tableData: [],
      currentRow: null,
      redata: [],
      switchValue: true,
      updataRule: {}
    }
  },
  created() {
    this.user = sessionStorage.getItem('user')
    this.$axios.post('/robot/json',
      {
        'operation': 'queryUserEEAFiles',
        'user.SectionID': '2',  //sessionStorage.getItem('SectionID')
        'user.authority': '2'   //  sessionStorage.getItem('authority')
      }
    ).then((res) => {

      this.redata = res.data.data

      this.redataHandler()
    }).catch((err) => {
      window.console.log(err)
    })
  },
  methods: {
    getCurrentRow(x) {
      window.console.log(x)
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      window.console.log(currentRow, oldCurrentRow)
      this.currentRow = currentRow;
    },
    redataHandler() {
      for (var value of this.redata) {
        this.tableData.push({
          'date': value.fileID,
          'fileTitile': value.fileTitile,
          'descriptionInf': value.descriptionInf,
          'approvalSuggestion': '',
          'EEARule': value.EEARule,
          'EEAInf': value.EEAInf,
          "nextEEAindex": value.nextEEAindex,
          'btnStatus': true
        })
      }
    },

    /**
     * 用于下载审批文件
     */
    handleDownload(index, row) {
      var cos = new COS({
        SecretId: '', //线下调试时自行填入, 这种方式只供调试
        SecretKey: '' //线下调试时自行填入, 这种方式只供调试
      })
      cos.getObjectUrl({
        Bucket: 'eea-files-1258427546',
        Region: 'ap-chongqing',
        Key: this.redata[index].URL,
        Sign: true
      }, function (err, data) {
        if (err) return console.log(err);
        var downloadUrl = data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
        window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
      });
    },

    /**
     * 用于审批该文件，填写审批意见
     */
    open(row) {
      this.$confirm('此操作将永久提交您的审批意见, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '审批成功!'
        });
        //审批过后 更新审批规则
        //自动刷新页面重新请求最新的审批规则
        //发布审批按钮设置为不可用
        row.btnStatus = false
        this.$axios.post('/robot/json', this.updataRule)
          .then((res) => {
            window.console.log('发送成功')
          })
          .catch((err) => {
            window.console.log("发送失败")
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    /**
     * 更新审批规则
     */
    handleApproval(index, row) {
      let currentEEARule = JSON.parse(this.tableData[index].EEARule)
      let currentNextEEAindex = Number(this.tableData[index].nextEEAindex) + 1

      let EEAState
      if (currentNextEEAindex == currentEEARule[0].length) {
        EEAState = '1'
      } else {
        if (this.switchValue == true) {
          EEAState = '0'
        } else if (this.switchValue == false) {
          EEAState = '2'
        }
      }
      window.console.log(currentEEARule);

      this.updataRule = {
        'operation': 'updataEEAFile',
        'userID': this.user,
        'eeAfiles.fileID': row.date,
        'eeAfiles.EEAState': EEAState,
        'eeAfiles.nextEEAsectionID': currentEEARule[0][currentNextEEAindex],
        'eeAfiles.nextEEAauthority': currentEEARule[1][currentNextEEAindex],
        'eeAfiles.nextEEAindex': currentNextEEAindex,   //Number类型
        'eeAfiles.EEAInf': this.tableData[index].EEAInf + ',' + row.approvalSuggestion //每个环节的审批意见
      }

      window.console.log(this.updataRule);

    }
  }
}
</script>

<style>
.el-textarea__inner {
  height: 80px !important;
}
</style>