<template>
  <div class="projectWorkbench">
    <div class="title">未初始化项目</div>
    <el-row>
      <el-col :span="5"
              style="margin-right:1%">
        <div class="text" @click="projectClick">
          <p class="companyName">2021年泰安分公司xxx领导经责审计</p>
          <el-row>
            <el-col :span="10">
              <div>
                <p>被审计对象：</p>
                <p>泰安分公司xxx领导</p>
              </div>
            </el-col>
            <el-col :span="14">
              <div>
                <p>审计周期：</p>
                <p>2021-12-12至2022 11-21</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="5"
              style="margin-right:1%">
        <div class="text">
          <p class="companyName">2021年泰安分公司xxx领导经责审计</p>
          <el-row>
            <el-col :span="10">
              <div>
                <p>被审计对象：</p>
                <p>泰安分公司xxx领导</p>
              </div>
            </el-col>
            <el-col :span="14">
              <div>
                <p>审计周期：</p>
                <p>2021-12-12至2022 11-21</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="5"
              style="margin-right:1%">
        <div class="text">
          <p class="companyName">2021年泰安分公司xxx领导经责审计</p>
          <el-row>
            <el-col :span="10">
              <div>
                <p>被审计对象：</p>
                <p>泰安分公司xxx领导</p>
              </div>
            </el-col>
            <el-col :span="14">
              <div>
                <p>审计周期：</p>
                <p>2021-12-12至2022 11-21</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="text">
          <p class="companyName">2021年泰安分公司xxx领导经责审计</p>
          <el-row>
            <el-col :span="10">
              <div>
                <p>被审计对象：</p>
                <p>泰安分公司xxx领导</p>
              </div>
            </el-col>
            <el-col :span="14">
              <div>
                <p>审计周期：</p>
                <p>2021-12-12至2022 11-21</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div class="initializeProject">
      <div class="title">初始化项目</div>
      <ul>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <li>2021年泰安分公司xxx领导经责审计</li>
        <span @click="project_more()">更多>></span>
      </ul>
    </div>

    <el-row class="tac">
      <!-- 左侧导航 -->
      <div class="left_menu">
        <el-col>
          <div class="menu">
            <el-menu class="el-menu-vertical-demo"
                     @select="open"
                     background-color="#F1F5FB"
                     default-active="1-1">
              <el-submenu index="1">
                <template slot="title">
                  <span style="margin-left:20px;font-weight: 400;">审计准备</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">组员及任务维护 <span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span style="margin-left:20px;font-weight: 400;">审计实施</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1">审计资料<span></span></el-menu-item>
                  <el-menu-item index="2-2">审计任务<span></span></el-menu-item>
                  <el-menu-item index="2-3">审计问题<span></span></el-menu-item>
                  <el-menu-item index="2-4">审计确认单<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <span style="margin-left:20px;font-weight: 400;">报告阶段</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="3-1">审计报告<span></span></el-menu-item>
                  <el-menu-item index="3-2">经营指标<span></span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-col>
      </div>
      <!-- 左侧导航 end -->

      <!-- 右侧内容 -->
      <div class="right_conter">
        <el-col>
          <!-- 组员及任务维护 -->
          <div class="routerView"
               v-if="index == '1-1'">
            <TeamPersonTask  ref="temPersonRef"/>
          </div>
          <!-- 审计资料 -->
          <div class="routerView"
               v-else-if="index =='2-1'">
            <AuditData></AuditData>
          </div>
          <!-- 审计任务 -->
          <div class="routerView"
               v-else-if="index =='2-2'">
            <AuditTask></AuditTask>
          </div>
          <div class="routerView"
               v-else-if="index =='2-3'">
            <Auditproblem></Auditproblem>
          </div>
          <div class="routerView"
               v-else-if="index =='2-4'">3</div>
          <div class="routerView"
               v-else-if="index =='3-1'">4</div>
          <div class="routerView"
               v-else>
            <Businessindicator></Businessindicator>
          </div>
        </el-col>
      </div>
      <!-- 右侧内容 end -->
    </el-row>

    <!-- 查看更多未初始化项目 -->
    <div class="project_data"
         :class="project_data == true ?'opctin':''">
      <div class="right_data"
           @click="close()">
        <ul :class="project_data == true ?'style_width':''"
            class="ul_data">
          <li @click.stop="look_project()">2021年泰安分公司xxx领导经责审计</li>
          <li>2021年泰安分公司xxx领导经责审计</li>
          <li>2021年泰安分公司xxx领导经责审计</li>
          <li>2021年泰安分公司xxx领导经责审计</li>
          <li>2021年泰安分公司xxx领导经责审计</li>
          <li>2021年泰安分公司xxx领导经责审计</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TeamPersonTask from '@WISDOMAUDIT/views/audit/teamperson-task/index'
import AuditData from '@WISDOMAUDIT/components/workbench/AuditData/index'//审计资料
import AuditTask from '@WISDOMAUDIT/components/workbench/AuditTask/index'//审计任务
import Auditproblem from '@WISDOMAUDIT/components/workbench/auditproblem/index'//审计问题
import Businessindicator from '@WISDOMAUDIT/components/workbench/businessindicator/index'//经营指标
export default {
  components: {
    TeamPersonTask,//组员及任务维护
    AuditData,//审计资料
    AuditTask,//审计任务 
    Auditproblem,//审计问题
    Businessindicator,//经营指标
  },
  data () {
    return {
      index: '1-1',//默认指定项
      project_data: false,//更多项目
    }
  },
  created () {
  },
  methods: {
    open (index) {
      this.index = 0;
      this.index = index;
    },
    // 查看更多
    project_more () {
      this.project_data = true;
    },
    close () {
      this.project_data = false;
    },
    look_project () {
      // console.log(222);
    },
    //调用组员维护组件的第一步第二步弹框事件
    projectClick(){
      this.$refs.temPersonRef.addPerson();
    }
  },
};
</script>

<style lang="scss" scoped>
// 二级导航 穿透样式
// 选中高亮
::v-deep.el-menu .el-menu-item {
  position: relative;
}
// 新增高亮样式
::v-deep.el-menu .el-menu-item span {
  width: 3px;
  height: 20px;
  background-color: #12579a;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  left: 0;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0;
}
// 高亮样式
::v-deep.el-menu-item.is-active span {
  opacity: 1 !important;
}

.el-menu-item {
  padding: 0 0 0 30px !important;
  min-width: 160px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
::v-deep.el-menu {
  border-right: none;
}

::v-deep.el-menu-item-group__title {
  color: red !important;
  padding: 0 !important;
}
// 二级导航 穿透样式 end

.projectWorkbench {
  padding: 2%;
  .title {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 1%;
  }
  .text {
    background: #fff;
    border: 1px solid #EBF0F6;
    border-radius: 10px;
    padding: 5%;
    color: #000;
    box-shadow:0px 15px 10px -15px #DEE4E8;
    cursor: pointer;
    .companyName {
      margin-bottom: 5%;
    }
  }
}

.initializeProject {
  margin: 2% 1% 1% 0;
  ul {
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    // margin-bottom: 1%;
    li {
      float: left;
      width: 16%;
      background: #f1f5fb;
      margin-left: 0.2%;
      padding: 1.5%;
      border-radius: 10px;
    }
    span {
      color: #12579a;
      margin: 0 10px;
      min-width: 60px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.tac {
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left_menu {
    width: 160px;
    display: flex;
    box-sizing: border-box;
    background-color: rgb(241, 245, 251);
  }
  .right_conter {
    width: calc(100% - 160px);
  }
  .menu {
    width: 100%;
    //   border: 1px solid red;
    background: #f1f5fb;
  }
  .routerView {
    // border: 1px solid red;
    padding: 10px;
  }
}
// 展示更多项目
.project_data {
  width: 0;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.5s, background 0.3s;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  .right_data {
    position: relative;
    display: flex;
    height: 100%;

    .ul_data {
      width: 0;
      height: 100%;
      position: absolute;
      right: -300px;
      top: 0;
      // width: 300px;
      padding: 20px 0;
      background-color: #fff;
      float: left;
      transition: width 0.3s;
      // margin-bottom: 1%;
      li {
        margin: 0 auto;
        width: 80%;
        min-height: 60px;
        margin-bottom: 20px;
        background: #f1f5fb;
        padding: 10px;
        border-radius: 10px;
        transition: all 0.3s;
        cursor: pointer;
      }
      li:hover {
        background-color: rgb(66, 130, 254, 0.4);
      }
    }
  }
}
.opctin {
  width: 100% !important;
  opacity: 1 !important;
}
.style_width {
  right: 0px !important;
  width: 300px !important;
}
</style>