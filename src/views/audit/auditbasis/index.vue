<template>
  <div class="sjyj-body">
    <el-row type="flex"
            :gutter="20">
      <div class="searchBbtn">
        <el-col :span="6">
          <div class="kuan">资料名称:</div>
          <el-input v-model="searchForm.basyName"
                    placeholder="请输入资料名称"></el-input>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文时间:</div>
          <el-date-picker v-model="searchForm.issueDate"
                          format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div class="kuan">发文部门:</div>
          <el-input v-model="searchForm.publishDepartment"
                    placeholder="请输入发文部门"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary"
                     @click="getData">查询</el-button>

        </el-col>
      </div>
    </el-row>
    <div class="addbtn">
      <el-button type="primary"
                 v-if="Add == true"
                 @click="addlist">新增依据</el-button>
    </div>

    <auditbasis ref="listShow"
                :Add="Add"
                :Edit="Edit"
                :Delete="Delete"></auditbasis>

  </div>
</template>

<script>
import auditbasis from "@WISDOMAUDIT/components/workbench/auditbasis/index";
import { getUserPermissionList } from '@SDMOBILE/api/shandong/common';
export default {
  components: {
    auditbasis,
  },
  data () {
    return {
      dqtoken: "",
      searchForm: {
        basyName: "",
        issueDate: "",
        publishDepartment: "",
      },
      input: "",
      name: "",
      Add: false,//权限
      Edit: false,//权限
      Delete: false,//权限

    };
  },
  created () {
    this.dqtoken = sessionStorage.getItem("TOKEN");
    this.jurisdiction_control();//按钮权限控制

  },

  methods: {

    // 按钮权限 接口
    jurisdiction_control () {
      getUserPermissionList().then(resp => {
        let data = resp.data
        data.forEach((item) => {
          if (item.name == '知识库') {
            let control_children = item.children
            // console.log(this.control_children);
            control_children.forEach((item_son) => {
              if (item_son.name == '审计依据') {
                let control_children_son = item_son.children
                control_children_son.forEach((item_son_child) => {
                  // this.children_data.push(item_son_child.url)
                  if (item_son_child.url == 'add') {
                    this.Add = true;
                  }
                  if (item_son_child.url == 'edit') {
                    this.Edit = true;
                  }
                  if (item_son_child.url == 'delete') {
                    this.Delete = true;
                  }
                })
              }
            })
          }
        })

      })
    },


    //查询按钮点击
    getData () {
      this.$nextTick(() => {
        this.$refs.listShow.getSearchForm(this.searchForm);
      });
    },
    //新增依据
    addlist () {
      this.$nextTick(() => {
        this.$refs.listShow.addlist();
      });
    },
  },
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
.sjyj-body {
  background: #fff;
}
.addbtn {
  margin-top: 10px;
  margin-left: 10px;
}
</style>>
