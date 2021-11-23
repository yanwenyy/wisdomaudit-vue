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
          ref="vaultform"
          class="vault-form"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="120px"
        >
          <el-form-item label="访问方式" prop="region">
            <!-- <el-select v-model="form.region" placeholder="请选择访问方式">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select> -->
            <el-input v-model="form.region" disabled></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="people">
            <el-input v-model="form.people" disabled></el-input>
          </el-form-item>
          <el-form-item label="截止时间" prop="endTime">
            <el-input v-model="form.endTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="审批人" prop="approverAccount">
            <el-select
              v-model="form.approverAccount"
              placeholder="请选择审批人"
            >
              <el-option
                v-for="(item, index) in approvers"
                :key="'appa' + index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="常用申请原因">
            <el-select v-model="form.region" placeholder="请选择常用申请原因">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="申请原因" prop="cerReason">
            <el-input
              type="textarea"
              v-model="form.cerReason"
              placeholder="此内容会被审计请慎重填写"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vaultVisible = false">取 消</el-button>
        <el-button type="primary" @click="opensort()">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="金库认证请求"
      :visible.sync="sortinfoVisible"
      width="50%"
      center
      ><span class="VaultTitle">远程授权</span>
      <div>
        <el-form
          ref="sortform"
          :model="sortform"
          label-width="180px"
          class="vault-form"
        >
          <el-form-item label="请输入动态验证码">
            <el-input v-model="sortform.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sortinfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="secondauth()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: [
    "vaultV",
    "sceneId",
    "approvers",
    "maxTime",
    "account",
    "appSessionId",
    "dqtime",
  ],
  data() {
    return {
      vaultVisible: false,
      sortinfoVisible: false,
      form: {
        region: "动态口令（短信）",
        approverAccount: "",
        people: "",
        cerReason: "",
        endTime: "",
        beginTime: "",
      },
      rules: {
        cerReason: [
          { required: true, message: "请输入申请原因", trigger: "blur" },
        ],
      },
      sortform: {
        info: "",
      },
    };
  },
  watch: {
    vaultV(val, oldVal) {
      this.vaultVisible = val;
      if (!val) {
        this.resetForm();
      }
    },
    vaultVisible(val, oldVal) {
      this.changevault(val);
    },
    dqtime(val, oldVal) {
      //获取当前时间并打印
      let beginhh = this.dqtime.getHours();
      let targetday = this.dqtime.getTime() + 1000 * 60 * 60 * this.maxTime;
      this.dqtime.setTime(targetday);
      let _this = this;
      let yy = this.dqtime.getFullYear();
      let mm = this.dqtime.getMonth() + 1;
      let dd = this.dqtime.getDate();
      let hh = this.dqtime.getHours();
      let mf =
        this.dqtime.getMinutes() < 10
          ? "0" + this.dqtime.getMinutes()
          : this.dqtime.getMinutes();
      let ss =
        this.dqtime.getSeconds() < 10
          ? "0" + this.dqtime.getSeconds()
          : this.dqtime.getSeconds();
      let getbegintime =
        yy + "-" + mm + "-" + dd + " " + beginhh + ":" + mf + ":" + ss;
      let getendtime =
        yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
      console.log(getbegintime);
      console.log(getendtime);
      this.form.beginTime = getbegintime;
      this.form.endTime = getendtime;
    },
  },
  created() {
    let p = sessionStorage.getItem("store");
    this.form.people = JSON.parse(p).user.name;
  },
  methods: {
    changevault(val) {
      this.$emit("changevault", val);
    },
    resetForm() {
      this.$refs["vaultform"].resetFields();
    },
    opensort() {
      this.$refs["vaultform"].validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: `/wisdomaudit/treasury/remoteFirstAuth`,
            data: {
              account: this.account,
              sceneId: this.sceneId,
              approverAccount: this.form.approverAccount, //审批人主账号
              beginTime: this.form.beginTime,
              endTime: this.form.endTime,
              appSessionId: this.appSessionId,
              cerReason: this.form.cerReason, //原因
            },
          }).then((resp) => {
            this.sortinfoVisible = true;
          });
        } else {
          return;
        }
      });
    },
    secondauth() {
      axios({
        method: "post",
        url: `/wisdomaudit/treasury/remoteSecondAuth`,
        data: {
          account: this.account,
          sceneId: this.sceneId,
          approverAccount: this.form.approverAccount, //审批人主账号
          beginTime: this.form.beginTime,
          endTime: this.form.endTime,
          appSessionId: this.appSessionId,
          isCommonManager: "y",
          dynamicCode: this.sortform.info,
        },
      }).then((resp) => {
        this.vaultVisible = false;
        this.sortinfoVisible = false;
        this.sortform.info = "";
        if (resp.data.code == 0) {
          this.$message({
            message: "认证成功",
            type: "success",
          });
          this.$emit("download");
        } else {
          this.$message.error(resp.data.msg);
        }
      });
    },
  },
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
