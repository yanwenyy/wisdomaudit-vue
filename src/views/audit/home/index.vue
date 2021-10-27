<template>
  <div class="page-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span> <svg-icon icon-class="edit" class="homepage-icon"/> 审计项目</span>
          <el-button
            style="float: right; padding: 3px 0; color: blue"
            type="text"
            >···</el-button
          >
        </div>

        <div class="project-wapper" >
          <div class="project-item" v-for="(item,index) in projectlist" :key="'project'+index" >
            <h3>{{item.projectName || '--'}}</h3>
            <ul :style="index==0?'':'border-left:1px solid #ccc;'">
              <li @click="projectEvent('1')">
                <div class="icon-wapper">
                  <svg-icon icon-class="fmodel" />
                  <br />
                  <span>模型任务 {{item.mxCount}}</span>
                </div>
              </li>
              <li @click="projectEvent('2')">
                <div class="icon-wapper">
                  <svg-icon icon-class="ftrask" /><br />
                  <span>自建任务 {{item.zjCount}}</span>
                </div>
              </li>
              <li @click="projectEvent('3')">
                <div class="icon-wapper">
                  <svg-icon icon-class="fproblem" /><br />
                  <span>问题 {{item.wtCount}}</span>
                </div>
              </li>
              <li @click="projectEvent('4')">
                <div class="icon-wapper">
                  <svg-icon icon-class="fconfirm" /><br />
                  <span>审计确认单 {{item.qrdCount}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="14">
          <el-card class="body-padding">
            <div slot="header" class="clearfix">
              <span> <svg-icon icon-class="task" class="homepage-icon"/>我的模型任务</span>
            </div>

            <ul style="height: 466px;overflow:scroll;" class="odd-even" @click="taskModelEvent">
              <li v-for="(item,index) in modellist" :key="'model'+index">
                <div class="li-item">
                  <h5>{{item.projectName || '--'}}</h5>
                  <span>{{item.updateTime || '--'}}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>{{item.taskName || '--'}}</p>
                  <el-button type="primary" size="mini"
                    >前去处理<i class="el-icon-d-arrow-right el-icon--right"></i
                  ></el-button>
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card>
            <div slot="header" class="clearfix">
              <span> <svg-icon icon-class="view" class="homepage-icon"/>审计资料</span>
            </div>

            <ul style="height: 245px;overflow:scroll;" class="odd-even" @click="auditInfoEvent">
              <li v-for="(item,index) in datalist" :key="'data'+index">
                <div class="li-item">
                  <h5>{{item.projectName || '--'}}</h5>
                  <span>{{item.createTime || '--'}}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>{{item.title || '--'}}</p>
                </div>
              </li>
            </ul>
          </el-card>

          <el-card style="margin-top: 20px">
            <div slot="header" class="clearfix">
              <span> <svg-icon icon-class="star" class="homepage-icon"/>快捷功能</span>
              <el-button
                style="float: right; padding: 3px 0; color: blue"
                type="text"
                ><i class="el-icon-setting"></i
              ></el-button>
            </div>
            <ul style="height: 100px" class="shortcut-wapper">
              <li @click="shortcutEvent('1')">
                <span class="item-icon"></span>
                数据审计风险监控
              </li>
              <li @click="shortcutEvent('2')">
                <span class="item-icon icon-warning"></span>
                风险扫描
              </li>
              <li @click="shortcutEvent('3')">
                <span class="item-icon"></span>
                项目工作台
              </li>
              <li @click="shortcutEvent('4')">
                <span class="item-icon"></span>
                模型化建模
              </li>
              <li @click="shortcutEvent('5')">
                <span class="item-icon icon-error"></span>
                数据导入
              </li>
              <li @click="shortcutEvent('6')">
                <span class="item-icon"></span>
                审计依据
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      modellist:[],
      projectlist:[],
      datalist:[]
    };
  },
  created(){
    this.getmodellist()
    this.getprojectlist()
    this.getdatalist()
  },
  methods: {
    getmodellist(){
      axios({
        url: `/wisdomaudit/homePage/homeMxList`,
        method: "post",
        data: {},
      }).then((res) => {
        console.log(res.data.data)
        this.modellist = res.data.data || ''
      });
    },
    getprojectlist(){
      axios({
        url: `/wisdomaudit/homePage/homeProjectList`,
        method: "post",
        data: {},
      }).then((res) => {
        console.log(res.data.data.homePageDtoList)
        if(res.data.data.homePageDtoList){
          this.projectlist = res.data.data.homePageDtoList.slice(0,3) || ''
        }
      });
    },
    getdatalist(){
      axios({
        url: `/wisdomaudit/homePage/homeZlList`,
        method: "post",
        data: {},
      }).then((res) => {
        console.log(res.data.data)
        this.datalist = res.data.data || ''
      });
    },
    projectEvent(type) {
      // this.$router.push({
      //   path: "/audit/auditItems/projectWorkbench",
      //   query: { index: "2-2" },
      // });

      switch (type) {
        case "1":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-2" },
          });
          break;
        case "2":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-2" },
          });
          break;
        case "3":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-3" },
          });
          break;
        case "4":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "2-4" },
          });
          break;

        default:
          break;
      }
    },

    taskModelEvent(data) {
      this.$router.push({
        path: "/audit/auditItems/projectWorkbench",
        query: { index: "2-2" },
      });
    },

    auditInfoEvent(data) {
      this.$router.push({
        path: "/audit/auditItems/projectWorkbench",
        query: { index: "2-1" },
      });
    },

    shortcutEvent(type) {
      switch (type) {
        case "1":
          this.$router.push({ path: "/audit/riskMonitoring/riskScan/personal" });
          break;
        case "2":
          this.$router.push({ path: "/audit/riskMonitoring/riskScan/personal" });
          break;
        case "3":
          this.$router.push({
            path: "/audit/auditItems/projectWorkbench",
            query: { index: "1-1" },
          });
          break;
        case "4":
          // this.$router.push({ path: "/audit/personalManage/ModelList" });

          break;
        case "5":
          // this.$router.push({ path: "/audit/audittasknode" });
          break;
        case "6":
          this.$router.push({ path: "/audit/personalManage/auditbasis" });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
.el-card {
  padding: 0 20px;
}

.project-wapper {
  display: flex;

  .el-divider {
    height: 270px;
  }

  .project-item {
    width: 33%;
    font-size: 0;
    height: 270px;

    // display: flex;

    h3 {
      text-align: center;
      font-size: 18px;
      margin-bottom: 10px;
    }

    ul {
      padding: 0 60px;
    }

    li {
      display: inline-block;
      width: 50%;
      // height: 90px;
      // height: 50px;
      // font-size: 16px;
      margin: 0 auto;

      .icon-wapper {
        height: 100px;
        width: 120px;
        margin: 10px auto;

        padding: 10px;

        border: 1px solid #ccc;
        border-radius: 5px;

        text-align: center;

        .svg-icon {
          width: 40px;
          height: 40px;
        }

        span {
          display: inline-block;
          margin-top: 15px;
          font-size: 16px;

          width: 100px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .icon-wapper:hover {
        background-color: rgb(90, 155, 245);
        color: #fff;
      }
    }

    // li:nth-of-type(odd) {
    //   margin: 0 5px 0 auto;
    // }
    // li:nth-of-type(even) {
    //   margin: 0 auto 0 5px;
    // }
  }
}

.odd-even {
  font-size: 18px;
  li:nth-of-type(even) {
    background: #F4F4F4;
  }

  li {
    margin-bottom: 5px;
    padding: 10px;
    .el-divider {
      margin: 5px 0;
    }

    .li-item {
      display: flex;
      justify-content: space-between;
    }

    h5 {
      color: rgb(67, 155, 216);
      font-size: 15px;
    }

    span {
      font-size: 13px;
    }

    p {
      font-size: 13px;
    }
  }
}

.el-card.body-padding ::v-deep .el-card__body {
  padding-left: 0px;
}

.shortcut-wapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    width: 30%;
    display: flex;
    align-items: center;
    span.item-icon {
      display: inline-block;
      width: 8px;
      height: 18px;

      border-radius: 8px;
      background-color: green;
      margin-right: 5px;
    }

    span.item-icon.icon-warning {
      background-color: chocolate;
    }

    span.item-icon.icon-error {
      background-color: red;
    }
  }
}
</style>
<style lang="scss">
.el-card .el-card__header{
  font-size: 15px;
  font-weight: bold;
  color: #439bd8;
}
.homepage-icon{
  margin-right:3px;
  height:1.2rem !important;
  width:1.2rem !important;
  vertical-align:-0.3em !important;
}
</style>

