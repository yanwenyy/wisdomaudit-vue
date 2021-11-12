<template>
  <div class="Vaultcertification">
    <el-dialog
      title="金库认证请求"
      :visible.sync="vaultVisible"
      width="50%"
      center
    >
      <span class="VaultTitle">远程授权</span>
      <div>
        <el-form
          ref="form"
          class="vault-form"
          :model="form"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="访问方式">
            <el-select v-model="form.region" placeholder="请选择访问方式">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="截止时间">
            <el-date-picker
              v-model="formtime"
              type="datetime"
              placeholder="选择截止时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审批人">
            <el-select v-model="form.region" placeholder="请选择审批人">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="常用申请原因">
            <el-select v-model="form.region" placeholder="请选择常用申请原因">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请原因">
            <el-input type="textarea" v-model="form.desc" placeholder="此内容会被审计请慎重填写"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vaultVisible = false">取 消</el-button>
        <el-button type="primary" @click="sortinfoVisible = true"
          >下一步</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="金库认证请求"
      :visible.sync="sortinfoVisible"
      width="50%"
      center
      ><span class="VaultTitle">远程授权</span>
      <div>
        <el-form ref="form" :model="sortform" label-width="180px" class="vault-form">
          <el-form-item label="请输入动态验证码">
            <el-input v-model="sortform.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortinfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="sortinfoVisible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:['vaultV','sceneId'],
  data() {
    return {
      vaultVisible: false,
      sortinfoVisible: false,
      form: {
        region: "",
        name: "",
        desc: "",
      },
      formtime: "",
      sortform: {
        info: "",
      },
    };
  },
  watch:{
    vaultV(val, oldVal){
      console.log(this.vaultV)
      this.vaultVisible = val
     },
  },
  methods: {},
};
</script>
<style lang="scss">
.Vaultcertification .el-form-item {
  width: 99%;
  margin: 10px 1% 10px 0 !important;
}
.Vaultcertification .vault-form {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0px 20px;
}
.vault-form .el-form-item__label {
  float: left !important;
}
.Vaultcertification .citebtn {
  height: 40px;
  margin-bottom: 6px;
}
.Vaultcertification .VaultTitle {
  padding: 10px 0 10px 80px;
  font-weight: bold;
}
</style>;
