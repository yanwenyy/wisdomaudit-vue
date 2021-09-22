<template>
  <div class="projectmanagement">
    <el-row>
      <el-col :span="17">
        <!-- 添加按钮 -->
        <el-button type="success" class="addBtn" @click="addProject"
          >新增审计项目</el-button
        >
      </el-col>
      <el-col :span="5">
        <el-input
          placeholder="请输入内容"
          v-model="input3"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button style="margin-left: 10%; border: 1px solid #ebeef2"
          >筛选</el-button
        >
      </el-col>
    </el-row>

    <el-table
      class="table"
      :data="tableData"
      style="margin-top: 1%; width: 100%"
      border
      stripe
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="date" label="项目编号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="审计项目名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="被审计对象"> </el-table-column>
      <el-table-column prop="address" label="项目类型"> </el-table-column>
      <el-table-column prop="address" label="项目负责人"> </el-table-column>
      <el-table-column prop="address" label="项目组长"> </el-table-column>
      <el-table-column prop="address" label="审计期间"> </el-table-column>
      <el-table-column prop="address" label="创建人"> </el-table-column>
      <el-table-column prop="address" label="创建日期"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: #db454b"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增" :visible.sync="addDialogVisible" width="50%"  @close="addDialogClosed">
      <div class="addForm">
        <el-form
          label-width="100px"
          :rules="rules"
          :model="addProjectManagement"
          ref="form"
        >
          <el-row>
            <el-form-item label="项目编号:" prop="itemNo">
              <el-input
                placeholder=""
                v-model="addProjectManagement.itemNo"
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目分类:" prop="itemClassfication">
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.itemClassfication"
              >
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="项目名称:"
              prop="projectName"
            >
              <el-input
                placeholder="请输入"
                v-model="addProjectManagement.projectName"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="项目负责人:"
              prop="projectLeader"
            >
              <el-select
                placeholder="请选择"
                v-model="addProjectManagement.projectLeader"
              >
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="审计期间:"
              prop="projectPeriod"
            >
              <el-date-picker
                type="date"
                placeholder="请选择"
                v-model="addProjectManagement.projectPeriod"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="设置组长"></el-form-item>
            <el-table :data="leaderData" style="width: 100%" border class="projectTable">
              <el-table-column label="项目编号" prop="projectItem" width="110">
              </el-table-column>
              <el-table-column prop="auditee" label="被审计单位" width="330">
                <template scope="scope">
                  <el-form-item prop="auditee">
                  <el-input 
                    placeholder="请输入"
                    v-model="scope.row.auditee"
                    class="auditeeInput"
                  ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="role" label="角色" width="60">
              </el-table-column>
              <el-table-column prop="personCharge" label="负责人" width="330">
                <template scope="scope">
                  <el-form-item prop="personCharge">
                     <el-select
                    placeholder="请选择"
                    class="auditeeInput"
                    v-model="scope.row.personCharge"
                  >
                    <el-option label="是" value="shi"></el-option>
                    <el-option label="否" value="fou"></el-option>
                  </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: #db454b"
                    size="small"
                    @click.native.prevent="deleteRow(scope.$index, leaderData)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="addIcon" @click="addData">
              <i class="el-icon-plus"></i>
              <span>新增</span>
            </div>
          </el-row>
        </el-form>

         <div class="stepBtn">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="nextBtn">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      input3: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      leaderData: [
        {
          projectItem: "hk123456",
          auditee: "",
          role: "组长",
          personCharge: "",
        },
      ],
      //新增项目管理的表单
      addProjectManagement: {
        itemNo: "",
        itemClassfication: "",
        projectName: "",
        projectLeader: "",
        projectPeriod: "",
      },
      // 新增的表单验证
      rules: {
        itemNo: [
          { required: true, message: "请输入项目编号", trigger: "blur" },
          {
            max: 10,
            message: "项目编号应在10个字符之内",
            trigger: "change",
          },
        ],
        itemClassfication: [
          { required: true, message: '请选择项目分类', trigger: "change"}
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" },
          { max: 10, message: "项目名称在10个字符之内", trigger: "change" },
        ],
        projectLeader:[
           { required: true, message: "请选择项目负责人", trigger: "change" },
        ],
        projectPeriod :[
           { required: true, message: "请选择审计期间", trigger: "change" },
        ],
        auditee:[
           { required: true, message: "请输入被审计单位", trigger: "blur" },
        ],
        personCharge:[
           { required: true, message: "请选择负责人", trigger: "change" },
        ]
      },
    };
  },
  methods: {
    addProject() {
      this.addDialogVisible = true;
    },
    addData() {
      // alert(11);
      this.leaderData.push({
        projectItem: "hk123456",
        auditee: "",
        role: "组长",
        personCharge: "",
      });
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    nextBtn() {
      this.$refs["form"].validate((valid) => {
        console.log(valid);
      })
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.projectmanagement {
  padding: 1%;
  .addBtn {
    background: #4bdcb4 !important;
  }
}
.addForm {
  margin-top: 2%;
  .el-select,
  .el-input {
    position: relative;
    top: -35px;
    width: 400px;
  }
  .el-form-item {
    margin-bottom: -25px !important;
  }
  .auditeeInput {
    position: relative;
    top: 0px !important;
    left: -110px !important;
    height: 100%;
    width: 200px;
    height: 64px;
  }
  .addIcon {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    color: #128ad7;
    text-align: center;
    border: 1px solid #ebeef2;
    cursor: pointer;
    margin-bottom: 5%;
  }
}
.stepBtn {
  /* border: 1px solid red; */
  // margin-top: 5%;
  text-align: center;
  .nextBtn {
  background: #508ce6 !important;
  color: #fff;
}
}

</style>
<style scoped>
  .addForm /deep/ .el-form-item__error{
    position: absolute;
    top: -70%;
    left: 52%;
  }
  .projectTable /deep/ .el-form-item__error{
    position: absolute;
    top: 15%;
    left: 45%;
  }
</style>