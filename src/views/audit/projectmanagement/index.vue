<template>
  <div class="projectmanagement">
    <el-row>
      <el-col :span="17">
        <!-- 添加按钮 -->
        <el-button type="success" class="addBtn" @click="addProject"
          >添加</el-button
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
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <el-dialog title="新增" :visible.sync="addDialogVisible" width="50%">
        <div class="addForm">
            <el-form label-width="100px" >
          <el-row>
            <el-form-item label="项目编号:">
              <el-input placeholder="hk123456789" >
               </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目分类:">
               <el-select placeholder="专项"></el-select>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="项目名称:">
               <el-input placeholder="请输入" >
               </el-input>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="项目负责人:">
               <el-select placeholder="请输入"></el-select>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="审计期间:">
               
            </el-form-item>
          </el-row>
        </el-form>
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
    };
  },
  methods: {
    addProject() {
      this.addDialogVisible = true;
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
.addForm{
  margin-top: 2%;
  .el-select,.el-input{
    position: relative;
    top: -35px;
    width:400px;
  }
  .el-form-item{
    margin-bottom: -25px !important;
  }
}
</style>