<template>
  <div class="sjyj-body">

    <el-row type="flex" :gutter="20">
      <div>
        <el-col :span="6">
          <div class="kuan">资料名称:</div>
          <el-input v-model="searchForm.basyName" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文时间:</div>
          <el-date-picker v-model="searchForm.issueDate"  format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文部门:</div>
          <el-input v-model="searchForm.publishDepartment" placeholder="请输入关键字"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getData">查询</el-button>
          <el-button type="primary" @click="addlist">新增依据</el-button>
        </el-col>
      </div>
    </el-row>
    <auditbasis ref="listShow"></auditbasis>

  </div>
</template>

<script>
  import auditbasis from '@WISDOMAUDIT/components/workbench/auditbasis/index'

  export default {
    components: {
      auditbasis
    },
    data() {
      return {
        searchForm: {
          basyName: '',
          issueDate: '',
          publishDepartment: ''
        },
        input: '',
        name: ''
      }
    },
    methods: {
      //查询按钮点击
      getData() {
        this.$nextTick(() => {
          this.$refs.listShow.getSearchForm(this.searchForm);
        })
      },
      //新增依据
      addlist(){
        this.$nextTick(() => {
          this.$refs.listShow.addlist();
        })
      }
    }
  };
</script>

<style scoped>
  .el-col {
    display: flex;
    align-items: center;
  }

  .kuan {
    width: 50%;
  }

  .el-row {
    padding: 10px 0 0 1%;
  }
  .sjyj-body{
    background: #fff;
  }
</style>>
