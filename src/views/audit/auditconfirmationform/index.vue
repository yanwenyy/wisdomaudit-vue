<template>
  <div class="auditConfirmation">
    <el-button type="primary" @click="addConfirmation">新增确认单</el-button>
    <!-- 审计确认单列表 -->
    <el-table
      :data="confirmaryData"
      style="margin-top: 1%"
      class="confirmaryTable"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="审计(调查)事项" prop="string"></el-table-column>
      <el-table-column label="责任人" prop="people"></el-table-column>
      <el-table-column label="问题数" prop="problemNum"></el-table-column>
      <el-table-column label="确认单附件">
        <div class="update">
          <i class="update_icon">
            <svg
              t="1631877671204"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9939"
              width="15"
              height="15"
            >
              <path
                d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                fill="#FD9D27"
                p-id="9940"
              ></path>
            </svg>
          </i>
          <span>2</span>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            class="btnStyle"
            style="color: #1371cc"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="text"
            class="btnStyle"
            style="color: #1371cc"
            >上传附件</el-button
          >
          <el-button
            size="small"
            type="text"
            class="btnStyle"
            style="color: #db454b"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="最终版扫描件">
        <el-button
          size="small"
          type="text"
          class="btnStyle"
          style="color: #1371cc"
          >上传</el-button
        >
      </el-table-column>
    </el-table>
    <!-- 新增确认单弹出框 -->
    <el-dialog
      :visible.sync="confirmationDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="title">新增确认单</div>
      <el-form class="formData" label-width="130px">
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="审计项目名称:"
              >2021年泰纳分公司经责审计</el-form-item
            >
          </el-col>
          <el-col :span="10">
            <el-form-item label="被审计单位:">泰安分公司领导</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="审计（调查）事项:">
            <el-input type="textarea"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审计(调查)事项描述:">
            <el-button>关联问题</el-button>
            <el-input type="textarea"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="审计人员:">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="复核人:">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="编织日期:">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { auditConfirmation_pageList} from
      '@SDMOBILE/api/shandong/ls'
export default {
  props:['active_project'],
  data() {
    return {
      confirmaryData: [
        {
          string: "资产管理不规范",
          people: "小明",
          problemNum: "5",
        },
        {
          string: "资产管理不规范",
          people: "小明",
          problemNum: "5",
        },
        {
          string: "资产管理不规范",
          people: "小明",
          problemNum: "5",
        },
        {
          string: "资产管理不规范",
          people: "小明",
          problemNum: "5",
        },
      ],
      confirmationDialogVisible: false, //新增确认单弹框
    };
  },
  created() {
    console.log(this.active_project)
  },
  methods: {
    //列表数据
    list_data_start () {
      let params={
        pageNo: this.searchForm.pageNo,
        pageSize: this.searchForm.pageSize,
        condition: {
          basyName: this.searchForm.basyName,
          issueDate: this.searchForm.issueDate,
          publishDepartment: this.searchForm.publishDepartment,
        }
      };
      this.loading = true
      auditConfirmation_pageList(params).then(resp => {
        var datas=resp.data;
        this.tableData = datas.records;
        this.page={
          current:datas.current,
          size:datas.size,
          total:datas.total
        };
        this.loading = false
      })
    },
    //   新增确认单按钮事件
    addConfirmation() {
      this.confirmationDialogVisible = true;
    },
    // 增加弹出框关闭事件
    handleClose() {},
  },
};
</script>

<style lang="scss" scoped>
.auditConfirmation {
  padding: 1%;
}
.confirmaryTable {
  .update {
    display: flex;
    align-items: left;
    justify-content: left;
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
  .btnStyle {
    background: none;
    border: 0px;
  }
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
}
.formData {
  // border: 1px solid red;
  padding: 2%;
  .el-button{
      border-color: #ECECEC;
      color: #9E9E9F;
  }

}
</style>
<style scoped>
/deep/.formData .el-form-item__content {
    position: relative;
    top: -36px;
    left: 0%;
  }
 /deep/ .formData .el-textarea__inner{
     position: relative;
     top: 8px;
     left: 0%;
     width: 700px;
  }
  /deep/ .formData .el-input__inner{
     position: relative;
     width: 185px;
  }
  /deep/ .formData label {
    display: inline-block;
    width:500px;
    text-align: right;
  }
</style>
