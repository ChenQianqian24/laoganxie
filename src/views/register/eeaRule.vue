<template>
  <div>

    <el-form ref="dynamicRule"
             label-width="100px"
             class="demo-dynamic">

      <el-form-item label="审批描述">
        <el-input type="textarea"
                  placeholder="请输入内容"
                  v-model="textarea"
                  maxlength="10"
                  show-word-limit
                  style="width:500px">
        </el-input>
      </el-form-item>

      <el-form-item label="审批规则"></el-form-item>
      <el-form-item v-for="(item, index) in dynamicRule"
                    :key="index"
                    :label="'流程' + ++index">

        <el-cascader v-model="item.value"
                     :options="item.options"
                     @change="handleChange(item,index)"></el-cascader>
        <el-button type="primary"
                   @click="removeSelect(item)"
                   style="margin-left:20px">删除</el-button>

      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click='submit'>确定</el-button>
        <el-button type="primary"
                   @click="addSelect">新增规则</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { date } from '../../../public/createData'
export default {
  data() {
    return {
      textarea: '',
      dynamicRule: [],
      addRule: [],
      dynamicRuleServer: [],
      addRuleServer: [],
      currentValue: [],
      arr1: [],
      arr2: [],
      EEARule: [],
      eeaRule: {},
    };
  },
  created() {
    this.$axios
      .post('/robot/json', {
        operation: 'querySectionInf'
      })
      .then(res => {
        this.redata = res.data.data
        this.handleRedata()
      })
      .catch(err => {
        window.console.log(err)
      })
  },
  methods: {
    /**
     * dynamicRule中的每个options可一样，数量根据index决定
     * 只需看一个options
     * 目标：
     * 1. 让options中的对象个数 = redata中的对象个数，
     *    方法：以redata中的对象个数for循环，每次为options添加一个对象，
     *          此对象的value和label值都等于相应redata[i].sectionName
     * 2. options.children里面的对象个数 = 职务个数（6）
     *    方法：for循环时添加的对象的children属性，每次还应为children添加一个对象，
     *         对象的value和label值都等于相应redata中的对象的L1-L6 => redata[i]['L' + i]
     */
    handleRedata() {   //将数据渲染到选择器中
      this.dynamicRule.push({ options: [] })
      for (let i = 0; i < this.redata.length; i++) {
        let add = {}
        add.value = parseInt(this.redata[i].sectionID)//显示sectionName  发送sectionID
        add.label = this.redata[i].sectionName
        add.children = []
        for (let j = 1; j < 7; j++) {
          let addC = {}
          addC.value = j
          addC.label = this.redata[i]['L' + j]
          add.children.push(addC)
        }
        this.addRule.push(add)
        this.dynamicRule[0].options.push(add)
      }
    },

    /**
     * value:[部门，职务]
     * 如果value值相同，alert并清空当前value
     */
    handleChange(item) {

      this.currentValue.push(item.value)
      this.currentValue = this.new()

    },
    new() {
      let obj = {}
      return this.currentValue.filter((item) => {
        // 防止key重复
        let newItem = item + JSON.stringify(item)
        return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
      })
    },
    submit() {
      for (var i = 0; i < this.currentValue.length; i++) {
        this.arr1.push(this.currentValue[i][0])
        this.arr2.push(this.currentValue[i][1])
      }
      this.EEARule.push(this.arr1)
      this.EEARule.push(this.arr2)

      this.eeaRule = {
        'eeaRule.EEAdescription': this.textarea,
        'eeaRule.EEARule': this.EEARule,
        'eeaRule.lastModifyTime': date()
      }
      window.console.log(this.eeaRule['eeaRule.EEARule'])
      this.$axios.post('/robot/register', this.eeaRule)
        .then(res => {
          window.console.log(res)
        })
        .catch(err => {
          window.console.log(err)
        })
    },
    removeSelect(item) {
      var index = this.dynamicRule.indexOf(item)
      if (index !== -1) {
        this.dynamicRule.splice(index, 1)
      }
    },
    /**
     * 如果新增了一个规则，就为dynamicRule添加（push）一个新的对象
     */
    addSelect() {
      this.dynamicRule.push({
        options: this.addRule
      })
    }
  }
}
</script>



