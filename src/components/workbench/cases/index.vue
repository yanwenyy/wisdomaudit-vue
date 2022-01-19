<template>
  <div class="sjzl">
    <!-- tab 切换 -->

    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <div class="projectTab">
        <el-row class="titleMes">
          <el-col :span="1.5">
            <el-button type="primary">新增</el-button>
          </el-col>
        </el-row>

        <el-table :data="tableData"
                  style="width: 100%"
                  @select="Selects">
          <el-table-column prop="date"
                           label="编号"> </el-table-column>
          <el-table-column prop="name"
                           label="领域"> </el-table-column>
          <el-table-column prop="province"
                           label="专题"> </el-table-column>
          <el-table-column prop="city"
                           label="问题"> </el-table-column>
          <el-table-column prop="address"
                           label="依据"> </el-table-column>
          <el-table-column prop="leixing"
                           label="描述"> </el-table-column>
          <el-table-column prop="zip"
                           label="涉及金额(元)"> </el-table-column>
          <el-table-column prop="state"
                           label="附件">
            <template slot-scope="scope">
              <icon class="update_icon">
                <svg t="1631877671204"
                     class="icon"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="9939"
                     width="200"
                     height="200">
                  <path d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                        fill="#FD9D27"
                        p-id="9940"></path>
                </svg>
              </icon>
              <span style="margin-left: 10px">{{ scope.row.state }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="source"
                           label="来源"> </el-table-column>
          <el-table-column prop="time"
                           label="审计年度"> </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="primary">编辑</el-link>
              <el-link type="danger"
                       class="delete"
                       @click="deletes(scope.row,scope.$index)">删除</el-link>
              <el-link type="primary"
                       class="delete"
                       @click="edit">下载</el-link>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background
                       layout="prev, pager, next"
                       :total="1000">
        </el-pagination>
      </div>
      <!-- 分页 end-->
    </el-tabs>
    <el-dialog :title="title"
               :append-to-body='true'
               :visible.sync="isAdd"
               v-if="isAdd"
               :destroy-on-close="true"
               width="800px"
               center>
      <el-form :model="form">
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="资料名称"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="文号"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="重点条款"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发文日期"
                          :label-width="formLabelWidth">
              <el-date-picker v-model="value1"
                              type="date"
                              placeholder="请选择发文日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="文本类型"
                          :label-width="formLabelWidth">
              <el-select v-model="value"
                         placeholder="请选择文本类型">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发文部门"
                          :label-width="formLabelWidth">
              <el-input v-model="formState.name"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="80">
          <el-col :span="12">
            <el-form-item label="上传到附件"
                          :label-width="formLabelWidth">
              <el-upload class="upload-demo"
                         drag
                         action="https://jsonplaceholder.typicode.com/posts/"
                         multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  点击上传或将文件拖到虚线框<br />支持.zip .doc
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件内容"
                          :label-width="formLabelWidth">
              <el-input type="textarea"
                        v-model="text"
                        :rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button class="btn"
                   @click="isAdd = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      title: "",
      formState: {
        username: "",
        email: "",
        roleCheckedList: [],
        name: "",
        state: "启用",
        describe: "",
        time: "",
        route: "",
        url: "",
      },
      text: "",
      isAdd: false,
      btn: false,
      activeName: 0,
      // color: '',   // 上传文件icon 颜色

      tableData: [
        {
          date: "1",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        },
        {
          date: "2",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "3",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "4",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "5",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "6",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "7",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "1",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "1",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        }, {
          date: "1",
          name: "2021年内控审计",
          province: "淄博",
          city: "202112-21",
          address: "2021年内控审计",
          leixing: "淄博",
          zip: "2021-12-21",
          state: "3",
          source: '2021-12-21',
          time: '2021-12-21'
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    deletes (val, inx) {
      console.log(val, inx);
      this.tableData.splice(inx, 1)
    },
    addlist () {
      this.isAdd = true;
      this.title = "新增审计依据";
    },
    Selects (selection, row) {
      console.log(selection, row);
      this.btn = !this.btn;
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },

    deleteRow (index, rows) {
      rows.splice(index, 1);
    },
    edit () {
      this.isAdd = true;
      this.title = "编辑审计依据";
    }
  },
  created () { },
  mounted () { },
};
</script>

<style scoped>
.el-tabs {
  padding: 0 1% 1% 1%;
}
.btn {
  background: dodgerblue !important;
  color: #fff !important;
}
.delete {
  margin-left: 6px;
}
.sjzl .conter {
  width: 100%;
  float: left;
}
.tab_ul {
  width: 100%;
  float: left;
  height: 50px;

  border-bottom: 2px solid #eeeeee;
}

.titleMes {
  padding: 10px 0 10px 0;
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-table__header {
  border-top: none !important;
}
.update {
  display: flex;
  align-items: center;
  justify-content: center;
}
.update_icon {
  width: 15px;
  height: 15px;
}
.update_icon svg {
  float: left;
  width: 15px;
  height: 15px;
}
.update span {
  color: #1371cc;
  margin-left: 5px;
}
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.update_icon svg {
  margin-top: 5px;
}
</style>
