import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Col,
  TimePicker,
  DatePicker,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Cascader,
  Icon,
  Upload,
  Table,
  TableColumn,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Col)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Switch)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cascader)
Vue.use(Icon)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
