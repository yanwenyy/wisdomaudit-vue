<template>
  <div class="sjzl">
    <div class="conter">
      <div class="two">
        <div class="projectTab">
          <el-row :gutter="24" class="titleMes">
            <el-col :span="1.5">
              <el-button type="primary" @click="new_add()">新增</el-button>
            </el-col>
          </el-row>
          <!-- 表单 -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="模型任务名称">
            </el-table-column>
            <el-table-column prop="name" label="任务类型"> </el-table-column>
            <el-table-column prop="province" label="责任人"> </el-table-column>
            <el-table-column prop="address" label="任务描述"> </el-table-column>
            <el-table-column prop="address" label="附件" width="90">
              <div class="update">
                <icon class="update_icon">
                  <svg
                    t="1631877671204"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9939"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M825.6 198.4H450.1l-14.4-28.7c-18.8-37.6-56.5-60.9-98.5-60.9H174.1C113.4 108.8 64 158.2 64 218.9v561.9c0 74.1 60.3 134.4 134.4 134.4h627.2c74.1 0 134.4-60.3 134.4-134.4v-448c0-74.1-60.3-134.4-134.4-134.4z m44.8 582.4c0 24.7-20.1 44.8-44.8 44.8H198.4c-24.7 0-44.8-20.1-44.8-44.8V467.2h716.8v313.6z m0-403.2H153.6V218.9c0-11.3 9.2-20.5 20.5-20.5h163.1c7.8 0 14.9 4.4 18.4 11.4l39.1 78.2h430.9c24.7 0 44.8 20.1 44.8 44.8v44.8z"
                      fill="#FD9D27"
                      p-id="9940"
                    ></path>
                  </svg>
                </icon>
                <span>2</span>
              </div>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: #1371cc"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  style="color: #db454b"
                  size="small"
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 end-->
        </div>

        <!-- 分页 -->
        <div class="page">
          <el-pagination background layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div>
        <!-- 分页 end-->
      </div>
    </div>

    <el-dialog :visible.sync="addDialogVisible" width="60%">
      <div class="title">2021年泰安分公司xxx领导经责审计</div>
      <div class="addPerson" v-if="step == 1">
        <div class="stepNew">
          <div class="stepOneN">
            <div>1.第一步：添加组员</div>
            <span></span>
          </div>
          <div class="stepTwoN">
            <span></span>
            <div>2.第二步：添加审计任务</div>
            <span></span>
          </div>
        </div>
        <el-table :data="leaderData" style="width: 100%" border>
          <el-table-column label="角色" prop="projectItem" width="150">
          </el-table-column>
          <el-table-column prop="auditee" label="姓名" width="250">
            <el-input
              placeholder="请输入"
              v-model="leaderData.auditee"
              class="auditeeInput"
              style="width: 200px"
            ></el-input>
          </el-table-column>
          <el-table-column prop="mobile" label="联系方式"> </el-table-column>
          <el-table-column prop="company" label="所属单位"> </el-table-column>
          <el-table-column prop="Department" label="所属部门"> </el-table-column>

          <el-table-column prop="personCharge" label="是否接口人" width="280">
            <el-select placeholder="请选择" class="auditeeInput">
              <el-option label="是" value="shi"></el-option>
              <el-option label="否" value="fou"></el-option>
            </el-select>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" style="color: #db454b" @click.native.prevent="deleteRow(scope.$index, leaderData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="addIcon" @click="addData">
          <i class="el-icon-plus"></i>
          <span>添 加</span>
        </div>

        <div class="stepBtn">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button class="nextBtn" @click="nextBtn">下一步</el-button>
        </div>
      </div>

      <div class="addAudit" v-else-if="step == 2">
        <div class="stepNew">
          <div class="auditStepOneN">
            <div>1.第一步：添加组员</div>
            <span></span>
          </div>
          <div class="auditStepTwoN">
            <span></span>
            <div>2.第二步：添加审计任务</div>
            <span></span>
          </div>
        </div>
        <div class="optionBtn" v-if="radio == '1'">
          <span>类型：</span>
          <el-radio v-model="radio" label="1">模型任务</el-radio>
          <el-radio v-model="radio" label="2">自建任务</el-radio>
          <el-row style="margin-top: 10px">
            <el-col :span="15">
              <div style="margin-top: 2.5%; color: #5f6165">
                请选择想要引用的模型(可多选)
              </div>
            </el-col>
            <el-col :span="9">
              <el-input
                placeholder="请输入内容"
                v-model="input3"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="selection"> </el-table-column>
            <el-table-column prop="date" label="模型编号"> </el-table-column>
            <el-table-column prop="name" label="所属领域"> </el-table-column>
            <el-table-column prop="province" label="所属专题">
            </el-table-column>
            <el-table-column prop="name" label="模型名称"> </el-table-column>
            <el-table-column prop="address" label="说明" width="300">
            </el-table-column>
            <el-table-column prop="address" label="规则" width="300">
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="radio == '2'" class="selfTask">
          <el-form label-width="80px">
            <el-form-item label="类型：" style="margin-bottom:50px">
              <div style="margin-top: -7.7%;margin-bottom:20px">
                <el-radio v-model="radio" label="1">模型任务</el-radio>
                <el-radio v-model="radio" label="2">自建任务</el-radio>
              </div>
            </el-form-item>
            <el-form-item label="自建任务名称：">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="责任人：">
              <el-select placeholder="请选择" class="auditeeInput">
                <el-option label="是" value="shi"></el-option>
                <el-option label="否" value="fou"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务描述：">
              <el-input
                type="textarea"
                style="top: -35px; width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传附件：">
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="stepBtn">
          <el-button @click="prevoius">上一步</el-button>
          <el-button class="nextBtn">完成</el-button>
        </div>
      </div>

       <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="dialogVisible = false" class="nextBtn"
          >下一步</el-button
        >
        </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      radio: "1",
      step: 1, //判断步骤条
      addDialogVisible: false, //添加弹框的隐藏与显示
      color: "white", // 上传文件icon 颜色
      tab: [{ name: "审计资料任务列表" }, { name: "已操作的资料列表" }],
      label: "黄金糕",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
      leaderData: [
        {
          projectItem: "hk123456",
          mobile:'13564578989',
          company:'审计局',
          Department:'事业部',
          auditee: "",
          role: "组长",
          personCharge: "",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 新增
    new_add() {
      this.addDialogVisible = true;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    nextBtn(){
      this.step = 2
    },
    prevoius(){
      this.step = 1
    },
     deleteRow(index, rows) {
      rows.splice(index, 1);
    },
     addData() {
      // alert(11);
      this.leaderData.push({
        projectItem: "hk123456",
         mobile:'13564578989',
          company:'审计局',
          Department:'事业部',
        role: "组长",
        personCharge: "",
      });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
.sjzl .conter {
  width: 100%;
  float: left;
  padding: 10px;
}
/* 内容  按钮 */
.sjzl >>> .el-button--primary {
  background-color: #42d7a5 !important;
  border: none;
}
.titleMes {
  box-sizing: border-box;
}
.table {
}
.sjzl >>> .el-button {
  background: none;
  border: none;
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

.search {
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.search >>> .el-input__inner {
  width: 180px;
  display: flex;
  float: right;
}
.search >>> .search_icon {
  position: absolute;
  top: 0;
  right: 70px;
  background: #1371cc;
  width: 37px;
  height: 37px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.search >>> .el-button {
  background: #1371cc !important;
}

.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}
.title {
  border-bottom: 1px solid #d2d2d2;
  padding: 10px;
  text-align: center;
}
/* 方法二 */
.stepNew {
  /* border: 1px solid red; */
  width: 45%;
  height: 50px;
  margin: 30px auto;
}

/*  */
.stepOneN {
  width: 230px;
  font-size: 0;
  position: relative;
  float: left;
  background: #508ce6;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.stepOneN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #fff;
  line-height: 50px;
  text-align: center;
}

.stepOneN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #e0e0e0 transparent #e0e0e0 transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.auditStepOneN {
  width: 230px;
  font-size: 0;
  position: relative;
  float: left;
  background: #e0e0e0;
  z-index: 50;
  /* 更改此处的颜色即可完成 */
}

.auditStepOneN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: center;
}

.auditStepOneN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #508ce6 transparent #508ce6 transparent;
  position: absolute;
  top: 0;
  right: 0;
}

/*  */
.stepTwoN {
  width: 230px;
  font-size: 0;
  position: relative;
  left: -5%;
  float: left;
  background: #e0e0e0;
}

.stepTwoN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
}

.stepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 0;
  left: 0;
}

.stepTwoN span:nth-of-type(2) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #fff transparent #fff transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.auditStepTwoN {
  width: 230px;
  font-size: 0;
  position: relative;
  left: -5%;
  float: left;
  background: #508ce6;
}
.auditStepTwoN div {
  width: 180px;
  height: 50px;
  vertical-align: text-bottom;
  font-size: 15px;
  color: #000;
  line-height: 50px;
  text-align: right;
  margin-left: 8%;
}

.auditStepTwoN span:nth-of-type(1) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
  position: absolute;
  top: 0;
  left: 0;
}

.auditStepTwoN span:nth-of-type(2) {
  border-width: 25px 0 25px 25px;
  border-style: solid;
  border-color: #fff transparent #fff transparent;
  position: absolute;
  top: 0;
  right: 0;
}
.addIcon {
  background-color: #fff;
  width: 100%;
  padding: 10px;
  color: #128ad7;
  text-align: center;
  border: 1px solid #ebeef2;
  cursor: pointer;
  margin: 1% 0 2% 0;
}

.stepBtn{
  /* border: 1px solid red; */
  margin-top: 5%;
  text-align: center;
}
.addAudit .nextBtn{
   background: #508ce6 !important;
  color: #fff;
}
.addPerson .nextBtn {
  background: #508ce6 !important;
  color: #fff;
}
.optionBtn {
  /* border: 1px solid red; */
  padding: 2%;
}
.selfTask {
  width: 50%;
  margin: 0 auto;
  /* border: 1px solid red; */
}
.selfTask .el-input {
  position: relative;
  top: -35px;
  width: 400px;
}
.selfTask .el-select {
  position: relative;
  top: -35px;
  width: 400px;
}
.selfTask .el-form-item {
  margin-bottom: -10px !important;
}
.upload-demo{
  margin-top: -35px;
}
</style>
