<template>
  <div class="parameterManagement">
    <!-- 模糊查询分类名称 -->
    <el-row :gutter="24">
      <el-col :span="4">
        <div class="search">
          <el-input
            placeholder="请输入分类名称"
            @keyup.enter.native="queryName"
          >
          </el-input>
          <div
            class="search_icon"
            style="background: rgb(12, 135, 214) !important"
            @click="queryName"
          >
            <i class="el-icon-search" style="color: white"></i>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 分类表格 -->
    <el-table
      ref="singleTable"
      highlight-current-row
      :data="maintableData"
      style="width: 100%"
      :header-cell-style="{ 'background-color': '#F4FAFF' }"
    >
      <el-table-column type="selection" width="100"></el-table-column>
      <el-table-column type="index" width="150" label="序号"> </el-table-column>

      <el-table-column align="center" property="date" label="分类名称">
      </el-table-column>
      <el-table-column align="center" property="name" label="分类编码">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            style="background: #0c87d6; color: #fff"
            @click="maintainDictionary(scope.row)"
            >维护字典</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 分页end -->

    <!-- 维护字典弹框 -->
    <el-dialog
      :visible.sync="mainDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <div class="mainTitle">维护字典</div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="mainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mainDialogVisible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 维护字典列表数据
      maintableData: [
        {
          date: "第一条",
          name: "name1",
        },
        {
          date: "第一条",
          name: "name1",
        },
        {
          date: "第一条",
          name: "name1",
        },
      ],
      mainDialogVisible:false, //维护字典弹框
    };
  },
  created() {},
  methods: {
    // 模糊查询
    queryName() {
      alert(123);
    },
    //维护字典按钮事件
    maintainDictionary(rows) {
      console.log(rows);
      this.mainDialogVisible = true;
    },
    // 弹框关闭事件
    handleClose(){},
  },
};
</script>

<style lang="scss" scoped>
.parameterManagement {
  padding: 1%;
  //   border: 1px solid red;
  .mainTitle{
      text-align: center;
      padding: 10px;
      border-bottom: 1px solid #d2d2d2;
  }
}
</style>
<style scoped>
@import "../../../assets/styles/css/yw.css";
.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 220px !important;
  border-radius: 5px 0 0 5px;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .search_icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0%;
  width: 36px;
  height: 36px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
.parameterManagement >>> .el-dialog__body {
  padding: 5px 0 !important;
}
</style>
