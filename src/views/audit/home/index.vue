<template>
  <div class="page-container">
    <div class="filter-container">
      <el-card class="box-card" v-loading="floading1">
        <div slot="header" class="clearfix">
          <span>
            <svg-icon icon-class="edit" class="homepage-icon" /> 审计项目</span
          >
          <el-button
            style="float: right; padding: 0; color: #439bd8; font-size: 18px"
            type="text"
            @click="goWorkbench()"
            >···</el-button
          >
        </div>

        <div class="project-wapper" style="height: 270px">
          <div
            class="project-item"
            v-for="(item, index) in projectlist"
            :key="'project' + index"
          >
            <h3>{{ item.projectName || "--" }}</h3>
            <ul :style="index == 0 ? '' : 'border-left:1px solid #ccc;'">
              <li>
                <div class="icon-wapper pointer" @click="projectEvent('1')">
                  <svg-icon icon-class="fmodel" />
                  <br />
                  <span>模型任务 {{ item.mxCount }}</span>
                </div>
              </li>
              <li>
                <div class="icon-wapper pointer" @click="projectEvent('2')">
                  <svg-icon icon-class="ftrask" /><br />
                  <span>自建任务 {{ item.zjCount }}</span>
                </div>
              </li>
              <li>
                <div class="icon-wapper pointer" @click="projectEvent('3')">
                  <svg-icon icon-class="fproblem" /><br />
                  <span>问题 {{ item.wtCount }}</span>
                </div>
              </li>
              <li>
                <div class="icon-wapper pointer" @click="projectEvent('4')">
                  <svg-icon icon-class="fconfirm" /><br />
                  <span>审计确认单 {{ item.qrdCount }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="14">
          <el-card class="body-padding" v-loading="floading2">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="task"
                  class="homepage-icon"
                />我的模型任务</span
              >
            </div>

            <ul style="height: 406px; overflow: scroll" class="odd-even">
              <li v-for="(item, index) in modellist" :key="'model' + index">
                <div class="li-item">
                  <h5 @click="taskModelEvent" class="pointer">
                    {{ item.projectName || "--" }}
                  </h5>
                  <span>{{ timefilter(item.createTime || "") }}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>{{ item.taskName || "--" }}</p>
                  <el-button type="primary" size="mini" @click="taskModelEvent"
                    >前去处理<i class="el-icon-d-arrow-right el-icon--right"></i
                  ></el-button>
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card v-loading="floading3">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="view"
                  class="homepage-icon"
                />审计资料</span
              >
            </div>

            <ul style="height: 200px; overflow: scroll" class="odd-even">
              <li v-for="(item, index) in datalist" :key="'data' + index">
                <div class="li-item">
                  <h5 @click="auditInfoEvent" class="pointer">
                    {{ item.projectName || "--" }}
                  </h5>
                  <span>{{ timefilter(item.createTime || "") }}</span>
                </div>
                <el-divider></el-divider>
                <div class="li-item">
                  <p>{{ item.title || "--" }}</p>
                </div>
              </li>
            </ul>
          </el-card>

          <el-card style="margin-top: 20px">
            <div slot="header" class="clearfix">
              <span>
                <svg-icon
                  icon-class="star"
                  class="homepage-icon"
                />快捷功能</span
              >
              <el-button
                style="float: right; padding: 3px 0; color: #439bd8"
                type="text"
                @click="openfast"
                ><i class="el-icon-setting" style="font-size: 18px"></i
              ></el-button>
            </div>
            <div class="shortcut-wapper" style="">
              <div
                @click="shortcutEvent(item.url)"
                v-for="(item, index) in outfastlist"
                :key="'fastli' + index"
                class="fastli"
              >
                <span
                  class="item-icon"
                  :class="
                    index % 5 == 1
                      ? 'icon-warning'
                      : index % 5 == 2
                      ? 'icon-green'
                      : index % 5 == 3
                      ? 'icon-error'
                      : index % 5 == 4
                      ? 'icon-blue'
                      : ''
                  "
                ></span>
                <span>{{ item.menuName }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="快捷功能设置"
      :visible.sync="fastDialogVisible"
      width="60%"
      center
    >
      <div class="fastoutbox">
        <div class="fastleft">
          <el-table
            ref="multipleTable"
            :data="fastlist"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="可选菜单选项">
              <template slot-scope="scope">{{ scope.row.menuName }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="fastright">
          <el-table
            :data="dqfastlist"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="" width="55"></el-table-column>
            <el-table-column label="已选菜单选项">
              <template slot-scope="scope">{{ scope.row.menuName }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  style="color: red"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeclosefastlist()">取 消</el-button>
        <el-button type="primary" @click="savefastlist()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { validUsername } from "@/utils/validate";
export default {
  data() {
    return {
      modellist: [],
      projectlist: [],
      datalist: [],
      floading1: false,
      floading2: false,
      floading3: false,
      fastDialogVisible: false,
      fastlist: [],
      dqfastlist: [],
      outfastlist: [],
    };
  },
  created() {
    axios.defaults.headers.common["TOKEN"] = sessionStorage.getItem("TOKEN");
    this.getmodellist();
    this.getprojectlist();
    this.getdatalist();
    this.getmeunlist();
  },
  methods: {
    //保存快捷功能
    savefastlist() {
      if (this.dqfastlist.length > 6) {
        this.$message({
          message: "选择请不要超过6条",
          type: "warning",
        });
      } else {
        axios({
          url: `/wisdomaudit/homePage/shortCutSet`,
          method: "post",
          data: this.dqfastlist,
        }).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.fastDialogVisible = false;
            this.$refs.multipleTable.clearSelection();
            this.$message({
              message: "设置成功",
              type: "success",
            });
            this.getdqfastlist();
          } else {
            this.$message.error(res.data.data.msg);
          }
        });
      }
    },
    //关闭快捷功能设置前
    beforeclosefastlist() {
      this.$confirm("取消不会保存您的操作，是否继续取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "返回",
        type: "warning",
      })
        .then(() => {
          this.fastDialogVisible = false;
          this.$refs.multipleTable.clearSelection();
        })
        .catch(() => {});
    },
    //选择快捷功能Change事件
    handleSelectionChange(val) {
      this.dqfastlist = val;
    },
    //删除选择
    handleDelete(val) {
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    //添加选择
    handlechoose(val) {
      this.$refs.multipleTable.toggleRowSelection(val, true);
    },
    //整理菜单数据
    finishinglist(list, pr) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type != 2) {
          if (pr && list[i].url) {
            this.fastlist.push({
              menuName: pr + "-" + list[i].name,
              url: list[i].url,
            });
          } else if (list[i].url) {
            this.fastlist.push({ menuName: list[i].name, url: list[i].url });
          }
          if (list[i].children) {
            this.finishinglist(list[i].children, list[i].name);
          }
        }
      }
    },
    //获取当前快捷功能
    getdqfastlist() {
      axios({
        url: `/wisdomaudit/homePage/pageList`,
        method: "post",
        data: {},
      }).then((res) => {
        this.dqfastlist = res.data.data.records;
        this.outfastlist = res.data.data.records;
        let _this = this;
        for (let i = 0; i < res.data.data.records.length; i++) {
          this.fastlist.forEach((row) => {
            if (row.menuName == res.data.data.records[i].menuName) {
              _this.handlechoose(row);
            }
          });
        }
      });
    },
    //获取菜单权限列表
    getmeunlist() {
      axios({
        url: `/wisdomaudit/permission/getUserPermissionList`,
        method: "get",
        data: {},
      }).then((res) => {
        this.finishinglist(res.data.data);
        this.getdqfastlist();
      });
    },
    timefilter(time) {
      let oldTime = new Date(time).getTime();
      let newTime = new Date(oldTime).toLocaleString("zh", { hour12: false });
      return newTime;
    },
    //打开快捷功能设置
    openfast() {
      this.getdqfastlist();
      this.fastDialogVisible = true;
    },
    getmodellist() {
      this.floading2 = true;
      axios({
        url: `/wisdomaudit/homePage/homeMxList`,
        method: "post",
        data: {},
      }).then((res) => {
        this.floading2 = false;
        this.modellist = res.data.data || "";
      });
    },
    getprojectlist() {
      this.floading1 = true;
      axios({
        url: `/wisdomaudit/homePage/homeProjectList`,
        method: "post",
        data: {},
      }).then((res) => {
        this.floading1 = false;
        if (res.data.data.homePageDtoList) {
          this.projectlist = res.data.data.homePageDtoList.slice(0, 3) || "";
        }
      });
    },
    getdatalist() {
      this.floading3 = true;
      axios({
        url: `/wisdomaudit/homePage/homeZlList`,
        method: "post",
        data: {},
      }).then((res) => {
        this.floading3 = false;
        this.datalist = res.data.data || "";
      });
    },
    goWorkbench() {
      this.$router.push({
        path: "/audit/auditItems/projectWorkbench",
      });
    },
    projectEvent(type) {
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

    shortcutEvent(url) {
      this.$router.push({
        path: url,
      });
    },
  },
};
</script>

<style lang="scss"  scoped>
.fastli {
  width: 33%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.fastoutbox {
  display: flex;
  padding: 10px;
  .fastleft {
    width: 45%;
    height: 400px;
    border: 1px solid #ccc;
    margin: 0 4%;
    overflow: auto;
  }
  .fastright {
    width: 44%;
    height: 400px;
    border: 1px solid #ccc;
    overflow: auto;
  }
}
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
        width: 110px;
        margin: 10px auto;

        padding: 10px 2px;

        border: 1px solid #ccc;
        border-radius: 10px;

        text-align: center;

        .svg-icon {
          width: 40px;
          height: 40px;
        }

        span {
          display: inline-block;
          margin-top: 15px;
          font-size: 16px;

          width: 106px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .icon-wapper:hover {
        background-image: linear-gradient(#e0edf8, #4d7cfd);
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
    background: #f4f4f4;
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
  height: 100px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .fastli {
    width: 33%;
    height: 50px;
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
    }
    span.item-icon {
      display: inline-block;
      width: 8px;
      height: 18px;

      border-radius: 8px;
      background-image: linear-gradient(#e0a6fb, #8478f3);
      margin-right: 5px;
    }

    span.item-icon.icon-warning {
      background-image: linear-gradient(#ffe8a7, #ff9d3a);
    }

    span.item-icon.icon-error {
      background-image: linear-gradient(#feaad1, #f24c76);
    }

    span.item-icon.icon-green {
      background-image: linear-gradient(#85f4ea, #03cdbb);
    }

    span.item-icon.icon-blue {
      background-image: linear-gradient(#67baee, #5584fc);
    }
  }
}
</style>
<style lang="scss">
.el-card .el-card__header {
  font-size: 15px;
  font-weight: bold;
  color: #439bd8;
  padding: 10px !important;
}
.homepage-icon {
  margin-right: 3px;
  height: 1.2rem !important;
  width: 1.2rem !important;
  vertical-align: -0.3em !important;
}
.pointer {
  cursor: pointer;
}
.fastoutbox .el-table__header {
  border: none !important;
}
</style>

