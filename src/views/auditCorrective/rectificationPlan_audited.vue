<template>
  <div>
    <div class="header_dlag">
      <div class="search">
        <el-input placeholder="请输入项目名称"> </el-input>
        <div class="search_icon"
             style=" background: rgb(12, 135, 214) !important;"
             @click="search_list_details()">
          <i class="el-icon-search"
             style="color: white;"></i>
        </div>
      </div>
    </div>

    <div class="padding">
      <el-table :data="tableData"
                :header-cell-style="{'text-align':'center','background-color': '#F4FAFF',}"
                v-loading="loading"
                style="width: 100%">
        <el-table-column type="index"
                         label="编号"
                         width="50">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="审计项目名称">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="被审计单位">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="项目类型">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="项目负责人">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="项目组长">
        </el-table-column>
        <el-table-column align="center"
                         prop="problem"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="edit(scope.row)"
                       style="color: rgb(68, 163, 223);">
              编辑
            </el-button>
            <el-button type="text"
                       @click="save(scope.row)"
                       style="color: rgb(68, 163, 223);">
              提交
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">
        <!-- <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="this.issues_list.current"
                     :page-sizes="[100, 200, 300, 400]"
                     :page-size="this.issues_list.size"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.issues_list.total">
      </el-pagination> -->
      </div>
      <!-- 分页 end-->

    </div>

  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      loading: false,
      tableData: [
        { problem: '11' },
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 编辑
    edit () {

    },
    // 提交
    save () {

    },
  },
  created () {

  },
  mounted () {

  },
}
</script>

<style scoped>
/* 筛选 */
.search {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.search >>> .el-input__inner {
  width: 250px !important;
  display: flex;
  float: right;
  border-radius: 0 !important;
}
.search >>> .el-button {
  border-radius: 0 !important;
}
.search >>> .search_icon {
  position: absolute;
  top: 20px;
  right: 20px;
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
  cursor: pointer;
}
/* 筛选  end*/
/* 分页 */
.page {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  justify-content: flex-end;
}

.padding {
  padding: 0 20px 20px;
  box-sizing: border-box;
}
</style>
