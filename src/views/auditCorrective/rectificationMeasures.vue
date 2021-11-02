<template>
  <div class="rectificationMeasures">
    <div style="width: 100%; overflow: hidden">
      <div style="float: right;">
        <el-form class="search-form" :inline="true" :model="form" @keyup.enter.native="init()">
          <el-form-item label="状态:">
            <el-select v-model="form.zt" placeholder="请选择">
              <el-option
                label="1"
                value="1"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目:">
            <el-select v-model="form.zt" placeholder="请选择">
              <el-option
                label="1"
                value="1"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题:">
            <el-input
              placeholder="请输入问题"
              v-model="form.info"
              class="input-with-select"
            >
              <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      style="width: 100%"
      :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
      border
      :data="tableData"
      highlight-current-row
    >
      <el-table-column
        fixed="left"
        label="序号"
        type="index"
      />
      <el-table-column
        label="项目名称"
        width="200px"
        prop="name"
        algin="left"
      />
      <el-table-column
        label="问题"
        width="250px"
        prop="address"
        algin="left"
      >
        <template slot-scope="scope">
          <span class="blue">{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目类型"
        width="200px"
        prop="name"
        align="center"
      />
      <el-table-column
        label="整改时间"
        width="200px"
        prop="date"
        align="center"
      />
      <el-table-column
        label="整改责任部门及联系人"
        width="200px"
        align="center"
        prop="name"
      />
      <el-table-column
        label="状态"
        prop="date"
        align="center"
        width="100px"
      />
      <el-table-column
        label="整改结果"
        prop="name"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button class="blue" type="text" @click="examine">
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :page-sizes="[10, 50, 100]"
        :total="page.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 分页 end-->
    <el-dialog
      @close="close"
      :title="title"
      :visible.sync="isExamine"
      :destroy-on-close="true"
      width="80%"
      center
    > <el-divider></el-divider>
      <el-form :model="formState" class="formData"  label-width="100px">
        <el-form-item label="问题:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题描述:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            type="textarea"
            rows="6"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="整改建议:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="itemTwo" label="修改时间:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="itemTwo zgLabel" label="整改责任部门及联系人:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="整改计划:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            type="textarea"
            rows="6"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="整改落实情况:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            type="textarea"
            rows="6"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <div class="zl-title">文件资料列表:</div>
        <div class="left-100">
          <el-form-item label="制度流程优化:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              placeholder="请输入"
            ></el-input>
            <el-upload
              class="upload-demo inline-block"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
              :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="其他措施:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              placeholder="请输入"
            ></el-input>
            <el-upload
              class="upload-demo inline-block"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
              :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="系统升级改造:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              placeholder="请输入"
            ></el-input>
            <el-upload
              class="upload-demo inline-block"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="( response, file, fileList)=>{uploadPorgress( response, file, fileList)}"
              :on-remove="( file, fileList)=>{handleRemove( file, fileList)}"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button class="zl-up-btn" size="small" icon="el-icon-upload2">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div class="zl-title">未完成整改原因及预计完成整改时间:</div>
        <div class="left-100">
          <el-form-item class="itemTwo" label="未完成整改原因:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item class="itemTwo zgLabel" label="预计完成整改日期:" >
            <el-date-picker :disabled="ifLook" v-model="formState.issueDate" type="date"  placeholder="请选择" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="itemTwo" label="整改状态:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              :disabled="ifLook"
              v-model="formState.basyName"
              type="textarea"
              rows="6"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="审核意见:">
          <el-input
            :disabled="ifLook"
            v-model="formState.basyName"
            type="textarea"
            rows="6"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-if="!ifLook" type="primary" @click="sub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isExamine:false,
        ifLook:false,
        title:'整改事项明细',
        form: {},
        formState:{},
        page: {
          current: 1,
          size: 10,
          total: 0
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
      uploadPorgress(file, fileList,tableList){},
      handleRemove( file, fileList){},
      sub(){},
      close(){
        this.isExamine=false;
      },
      //分页点击
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.list_data_start();

      },
      handleCurrentChange(val) {
        this.searchForm.pageNo= val;
        this.list_data_start();
      },
      examine() {
        this.isExamine=true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .rectificationMeasures {
    padding: 1%;
    .addBtn {
      background: #4bdcb4 !important;
      color: #fff;
    }
  }

  .page {
    width: 100%;
    padding: 20px 10px;
    display: flex;
    justify-content: flex-end;
  }
</style>
<style scoped>
  @import '../../assets/styles/css/yw.css';
  >>>.zgLabel .el-form-item__label{
    width: 27%!important;
  }
  >>>.zgLabel .el-form-item__content {
    width: 56%;
  }
  .left-100{
    box-sizing: border-box;
    padding:0 100px;
  }
  >>>.left-100 .el-input{
    width: 40%;
    margin-right: 20px;
  }
  >>>.zl-up-btn .el-icon-upload2{
    color:#49BAE8!important;
    font-weight: bold;
    transform: scale(1.2);
  }
  >>>.left-100 .itemTwo .el-input{
    width: 100%;
    margin-right: 0;
  }
  .zl-title{
    margin-top: 20px;
    font-weight: bold;
  }
</style>
