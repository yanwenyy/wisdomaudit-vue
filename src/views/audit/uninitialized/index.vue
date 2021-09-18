<template>
  <div>
    <el-button type="success" class="btn">下发</el-button>
    <el-card>
      <el-row :gutter="24" class="titleMes">
        <el-col :span="1.5">
          <span class="title">成员维护</span>
        </el-col>
        <el-col :span="1.2">
          <el-button type="primary" @click="addTab">新增</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="primary">删除</el-button>
        </el-col>
      </el-row>
      <el-form ref="form" :model="form">
        <el-table
          ref="singleTable"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column type="index" width="100" label="序号">
          </el-table-column>
          <el-table-column property="role" label="角色" width="200">
          </el-table-column>
          <!-- <el-table-column
            property="name"
            label="姓名"
            width="200"
            v-if="isAdd == true"
          >
          </el-table-column> -->
          <el-table-column poperty="name" label="姓名" width="280">
            <el-form-item>
              <el-select v-model="tableData.name" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-table-column>
          <el-table-column property="mobile" label="联系方式">
          </el-table-column>
          <el-table-column property="affUnit" label="所属单位">
          </el-table-column>
          <el-table-column property="department" label="所属部门">
          </el-table-column>
          <el-table-column
            property="contactPerson"
            label="是否接口人"
            width="150"
          >
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="24" class="titleMes">
        <el-col :span="1.5">
          <span class="title">审计任务</span>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addModelTask"
            >添加模型任务</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addselfTask">添加自建任务</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary">删除</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="assignPerson">分配责任人</el-button>
        </el-col>
      </el-row>
      <el-table :data="auditTab" style="width: 100%" border>
        <el-table-column type="selection" width="100"> </el-table-column>
        <el-table-column property="modelTask" label="模型任务名称" width="200">
        </el-table-column>
        <el-table-column property="taskType" label="任务类型" width="280">
        </el-table-column>
        <el-table-column property="personLiable" label="责任人">
        </el-table-column>
        <el-table-column property="taskDes" label="任务描述"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" @click="setParameters">设置参数</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <el-row :gutter="24" class="titleMes">
        <el-col :span="1.5">
          <span class="title">审计资料准备</span>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary">下发</el-button>
        </el-col>
      </el-row>
      <el-table :data="auditDataTab" style="width: 100%" border>
        <el-table-column type="selection" width="100"> </el-table-column>
        <el-table-column property="category" label="类别" width="200">
        </el-table-column>
        <el-table-column property="number" label="编号" width="280">
        </el-table-column>
        <el-table-column property="secNumber" label="二级编号">
        </el-table-column>
        <el-table-column property="dataName" label="资料名称">
        </el-table-column>
        <el-table-column property="department" label="部门"> </el-table-column>
        <el-table-column property="remarks" label="备注"> </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加模型任务 -->
    <el-dialog
      title="模型列表"
      :visible.sync="addModelDialogVisible"
      width="30%"
    >
      <el-card class="modelName">
        <el-row>
          <el-col :span="18">
            <el-form v-model="modelFrom" label-width="80px" label-position="right">
              <el-form-item label="模型名称">
                <el-input class="modelNameInput" v-model="modelFrom.name"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="5">
             <el-button type="primary" size="small">查询</el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="queryCard">
          <el-row>
              <el-col :span="18">
                  <span class="queryResult">查询结果</span>
              </el-col>
              <el-col :span="5">
                  <el-button type="primary" size="small">引用</el-button>
              </el-col>
          </el-row>
      </el-card>

      <el-table :data="modelNameTab">
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column label="模型名称" prop="modelName">
          </el-table-column>
      </el-table>
    </el-dialog>

     <!-- 添加自建任务 -->
    <el-dialog
      :visible.sync="addselfDialogVisible"
      width="30%"
    >
      <el-card>
          <el-button type="primary" size="small">保存</el-button>
          <el-button type="primary" size="small">返回</el-button>
      </el-card>
      <el-card class="auditInfo">
          <span>审计任务信息</span>
      </el-card>
      <el-form label-width="80px" class="auditInfoForm">
        <el-form-item label="任务名称：">
          <el-input></el-input>
        </el-form-item>
          <el-form-item label="任务描述：">
          <el-input type="textarea" class="textarea"></el-input>
        </el-form-item>
          <el-form-item label="责任人：">
          <el-select v-model="form.region" placeholder="张三">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="上传文件:">
          <el-button type="primary">附件上传</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配责任人 -->
    <el-dialog
      :visible.sync="assignPersonDialogVisible"
      width="60%"
    >
      <el-card style="height:40px; line-height:5px">经营指标列表</el-card>
       <el-card class="queryInput" style="height:80px; margin-bottom:1%">
      <el-form label-width="65px" v-model="queryForm" class="assignPerson" label-position="right">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="指标名称">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年 度">
              <el-select
                placeholder="2021"
                v-model="queryForm.year"
                class="auditee"
              >
                <el-option label="2021" value="2021"></el-option>
                <el-option label="2022" value="2022"></el-option>
                <el-option label="2023" value="2023"></el-option>
                <el-option label="2024" value="2024"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="区 域">
              <el-select
                placeholder="地市1"
                v-model="queryForm.region"
                class="auditee"
              >
                <el-option label="地市1" value="地市1"></el-option>
                <el-option label="地市2" value="地市2"></el-option>
                 <el-option label="地市3" value="地市3"></el-option>
                <el-option label="地市4" value="地市4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
     <el-card style="height:65px; line-height:8px">
          <el-row>
              <el-col :span="20">
                  <span class="queryResult">查询结果</span>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" style="margin:-5px 0 0 20px">引用</el-button>
              </el-col>
          </el-row>
      </el-card>
      <el-table :data="listIndicators">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="类别" prop="type">
        </el-table-column>
        <el-table-column label="指标名称" prop="name">
        </el-table-column>
        <el-table-column label="年份" prop="year">
        </el-table-column>
        <el-table-column label="区域" prop="place">
        </el-table-column>
        <el-table-column label="单位" prop="Company">
        </el-table-column>
        <el-table-column label="状态" prop="code">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 设置参数 -->
    <el-dialog
     :visible.sync="setParametersDialogVisible"
      width="60%"
    >
      <el-card class="setParameters">
        参数设置
      </el-card>
      <el-card class="parameters">
        <i class="el-icon-s-grid"></i>
         请输入参数值
      </el-card>
      <el-card class="parametersTab">
        <el-form label-width="100px" >
          <el-row>
            <el-form-item label="被审计单位">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审计期间_开始">
               <el-input placeholder="请输入内容" >
                 <el-button slot="append" icon="el-icon-error"></el-button>
               </el-input>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="审计期间_结束">
               <el-input placeholder="请输入内容" >
                 <el-button slot="append" icon="el-icon-error"></el-button>
               </el-input>
            </el-form-item>
          </el-row>
           <el-row>
            <el-form-item label="欠费金额大于">
               <el-input placeholder="请输入内容" >
               </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        region: "",
      },
      tableData: [
        {
          role: "组员",
          name: "一一",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "是",
        },
        {
          role: "组员",
          name: "二二",
          mobile: "13999999999",
          affUnit: "审计系统",
          department: "内审部",
          contactPerson: "否",
        },
      ],
      auditTab: [
        {
          modelTask: "模型1",
          taskType: "模型任务",
          personLiable: "xxx",
          taskDes: "123",
        },
        {
          modelTask: "任务1",
          taskType: "自建任务",
          personLiable: "xxx",
          taskDes: "456",
        },
      ],
      auditDataTab: [
        {
          category: "基本信息",
          number: "DS001",
          secNumber: "DS001-1",
          dataName: "1.分公司基本情况介绍材料",
          department: "综合",
          remarks: "书面及纸质文件",
        },
        {
          category: "基本信息",
          number: "DS002",
          secNumber: "DS002-1",
          dataName: "2.同志个人简历",
          department: "人力资源部",
          remarks: "书面及纸质文件",
        },
      ],
      addModelDialogVisible: false,
      addselfDialogVisible: false,
      assignPersonDialogVisible:false,
      setParametersDialogVisible:false,
      modelNameTab:[
          {
              modelName:'绩营业绩考核得分指标'
          },
           {
              modelName:'绩营业绩考核得分指标'
          },
           {
              modelName:'资产、损益及收入结构指标'
          },
           {
              modelName:'资产、损益及收入结构指标'
          },
           {
              modelName:'资产、损益及收入结构指标'
          },
           {
              modelName:'资产、损益及收入结构指标'
          },
           {
              modelName:'用户及业务发展指标'
          },
          {
              modelName:'用户及业务发展指标'
          },
          {
              modelName:'用户及业务发展指标'
          },
          {
              modelName:'资本开支及网络能力指标'
          },
      ],
      modelFrom:{
          name:'',
      },
      queryForm:{
        name:'',
        year:'',
        region:''
      },
      listIndicators:[
        {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
         {
          type:'绩营业绩考核得分指标 ',
          name:'经营业绩考核得分',
          year:'2021',
          place:'地市1',
          Company:'分',
          code:'正常'
        },
      ]
    };
  },
  methods: {
    addTab() {
      // this.isAdd = false;
      this.tableData.push({
        role: "组员",
        name: "lisi",
        mobile: "13999999999",
        affUnit: "审计系统",
        department: "内审部",
        contactPerson: "否",
      });
    },
    addModelTask() {
      this.addModelDialogVisible = true;
    },
    addselfTask() {
        this.addselfDialogVisible = true;
    },
    assignPerson() {
      this.assignPersonDialogVisible = true;
    },
    setParameters() {
      this.setParametersDialogVisible = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.btn {
  color: #ffffff;
  background-color: #13ce66;
  border-color: #13ce66;
  margin: 1% 0 0% 2%;
}
.title {
  font-size: 13px;
  position: relative;
  top: 10px;
}
.el-card {
  background-color: #efefef;
  margin-top: 1%;
}
/* .titleMes {
  margin-bottom: 1%;
} */
.modelNameInput{
    width: 90%;
    position: relative;
    top: -35px;
}
.modelName{
    height: 70px;
    margin-bottom: 2%;
}
.el-form-item__label{
    font-size: 16px !important;
    color: #000 !important;
    float: none !important;
}
.queryResult{
    font-weight: 700;
    position: relative;
    top: 10px;
}
.queryCard .el-row{
    margin-top: -3%;
    height: 10px;
}
.auditInfo{
  height: 40px;
  line-height:5px;
  margin-top: 2%;
  margin-bottom: 1%;
}
.auditInfoForm {
  margin-top: 5%;
  .el-input,.el-select,.textarea{
    position: relative;
    top:-35px ;
    width: 80%;
    /* left: -30px; */
  }
  .el-button{
    position: relative;
    top:-35px ;
  }
}
.assignPerson{
  .el-input,.el-select{
    position: relative;
    top: -35px;
    width: 180px;
  }
}
.setParameters{
  margin: 0;
  height: 50px;
  background:#4476A7 ;
  margin-top:-10px ;
  font-size: 15px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 2%;
}
.parameters{
  font-size: 15px;
  background: #ECEDF2;
  border: 0;
}
.parametersTab{
  margin-top: -0.7%;
  background: #DBDFE9;
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
