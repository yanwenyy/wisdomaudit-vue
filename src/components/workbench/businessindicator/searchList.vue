<template>
  <div>
    <el-dialog
      center
      width="80%"
      title="添加指标"
      :visible.sync="visible"
      :append-to-body="true">
      <div>
        <el-button @click="" type="primary" @click="dialogFormVisible=true">新增指标</el-button>
        <el-table
          :data="dataList"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          :header-cell-style="{
          'text-align': 'center',
          'background-color': 'whitesmoke',
        }"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="moduleName"
            show-overflow-tooltip
            label="指标类型">
          </el-table-column>
          <el-table-column
            prop="contractName"
            header-align="center"
            align="center"
            label="指标名称">
          </el-table-column>
          <el-table-column
            prop="contractCode"
            header-align="center"
            align="center"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="createOrgName"
            header-align="center"
            align="center"
            label="资料提供部门">
          </el-table-column>
          <el-table-column
            prop="createUserName"
            header-align="center"
            align="center"
            label="取数口径或公式">
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            :current-page="page.current"
            :page-size="page.size"
            :page-sizes="[20, 50, 100]"
            :total="page.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="sub()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="新增指标"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        class="zb-form"
      >
        <el-form-item label="指标类型" prop="indexName">
          <el-select v-model="temp.indexUnit" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标名称" prop="indexName">
          <el-input
            v-model="temp.indexName"
            placeholder="请输入指标名称"
          />
        </el-form-item>
        <el-form-item label="单位" prop="indexName">
          <el-select v-model="temp.indexUnit" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料提供部门" prop="indexName">
          <el-select v-model="temp.indexUnit" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取数口径或公式" prop="indexName">
          <el-select v-model="temp.indexUnit" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否同步到指标库" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible=false"
        >保存</el-button
        >
      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "search-list",
    data() {
      return {
        visible: false,
        dialogFormVisible:true,
        temp:{},
        dataList: [],
        page: {
          current: 1,
          size: 10,
          total: 0
        },
      }
    },
    methods: {
      // 初始化
      init() {
        this.visible = true;
      },
      //分页点击
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNo = val;
        this.getData();
      },
    }
  }
</script>

<style scoped>
  >>>.zb-form .el-form-item{
    margin-bottom: 10px!important;
  }
  >>>.zb-form .el-form-item__content{
    width: 30%;
    display: inline-block;
  }
  >>>.zb-form .el-form-item__label{
    width: 20%!important;
    text-align: right!important;
    display: inline-block;
  }
</style>
