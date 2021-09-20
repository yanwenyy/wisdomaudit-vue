<template>
  <div class="page-container">
    <div class="filter-container">
  <el-card class="title"> 项目列表 </el-card>
    <el-card class="queryInput">
      <el-form label-width="65px" ref="queryForm" v-model="queryFrom">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="项目名称">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="被审计对象">
              <el-select
                placeholder="请选择被审计对象"
                v-model="queryFrom.auditee"
                class="auditee"
              >
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="项目类型">
              <el-select
                placeholder="请选择项目类型"
                v-model="queryFrom.projectType"
              >
                <el-option label="经责审计" value="shanghai"></el-option>
                <el-option label="专项审计" value="beijing"></el-option>
                <el-option label="内控审计" value="conAudit"></el-option>
                <el-option label="审计调查或调研" value="auditResearch"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="projectTab">
      <el-row>
        <el-col :span="1" class="tableTitle"> 查询结果 </el-col>
        <el-button type="primary" @click="noecresAdd">新增（非经责）</el-button>
        <el-button type="primary" @click="ecresAdd">新增（经责）</el-button>
        <el-button type="primary">查看</el-button>
      </el-row>
      <el-row>
        <el-table class="table" :data="tableData" style="width: 100%" border stripe>
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
          <el-table-column  label="操作"></el-table-column>
        </el-table>
      </el-row>
    </el-card>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { listByPage, save, update, del, getAuditedTree, getAllPerson } from '@SDMOBILE/api/sdmobile/project'
import QueryField from '@/components/public/query-field/index'
import { getMemberList, saveMember, deleteAllProjectMemberById } from '@SDMOBILE/api/sdmobile/projectmember'
import _ from 'lodash'
import axios from 'axios'

export default {
  data() {
    return {
      queryFrom: {
        auditee: "",
        projectType: "",
      },
       tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
       }]
    }
  },
  methods: {
    ecresAdd(){
      this.$router.push({path:"/audit/projectInit/responseAdd"})
    },
    noecresAdd(){
      this.$router.push({path:"/audit/projectInit/application"})
    }
  }
}
</script>

<style scoped>
.title {
  background-color: #f2f2f2;
  margin-bottom: 1%;
  font-size: 13px;
  color: #333;
  font-weight: bold;
}
.queryInput {
  background-color: #f2f2f2;
  margin-bottom: 1%;
  height: 75px;
  /* line-height: 75px; */
}
.projectTab {
  background-color: #f2f2f2;
}
.tableTitle {
  font-size: 13px;
  color: #333;
  font-weight: bold;
  margin-top: 0.6%;
  margin-right: 1.2%;
}
.table {
  margin-top: 1%;
}
.el-input,.el-select{
  position: relative;
  top:-35px ;
  width: 80%;
  /* left: -30px; */
}
.auditee{
  margin-left:3% ;
}
</style>

