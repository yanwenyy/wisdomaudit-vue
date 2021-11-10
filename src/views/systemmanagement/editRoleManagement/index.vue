<template>
  <div class="new-user-management-g-wrapper">
    <!-- 面包屑导航 -->


    <el-form
      ref="newRoleManagementForm"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="108px"
      class="g-form"
    >
      <el-form-item class="u-margin-top-20" label="角色名称：" prop="roleName">
        <el-input
          minlength="2"
          maxlength="50"
          class="m-input-normal"
          placeholder="请输入"
          v-model="form.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item class="u-margin-top-20" label="角色描述：" prop="roleDesc">
        <el-input
          minlength="2"
          maxlength="200"
          class="m-input-normal"
          placeholder="角色描述长度在2到200之间"
          v-model="form.roleDesc"
          type="textarea"
          resize="none"
          row="4"
        ></el-input>
      </el-form-item>
      <el-form-item  label="角色权限：" prop="permissionIdList">
        <el-tree
          :data="permissionIdList"
          show-checkbox
          node-key="permissionId"
          ref="tree"
          highlight-current
          :props="defaultProps"
         @check-change="checkId"
          :default-checked-keys="form.permissionIds"
          :check-strictly="false"
        ></el-tree>
      </el-form-item>
      <el-form-item>
        <el-row class="g-footer">
          <div class="g-footer-btn">
            <el-button class="m-button-normal" @click="submit($event)">确定</el-button>
            <el-button class="m-button-normal u-margin-left-20" @click="cancle()">取消</el-button>
          </div>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getPermission ,getRoleData,modifyRole}  from "../../../api/user";

/**
 * @name: editRoleManagement.vue
 * @description: 角色编辑
 * @author: Shan Youjing(mail)
 * @update: 2019-01-28
 */
// 通用组件引入
// import {
//   comBreadCrumb,
//   comTitleDivider,
//   comSingleSelect,
//   comShowOverFlowTip
// } from '@/components/commons'
// // 混入引入
// import { CascaderAreaCounty } from '@/assets/js/mixins'
// // 接口引入
// import { GetRoleInfoById, UpdateRole, PermissionTree } from '@/api'
export default {
  name: 'newRoleManagement',
  // mixins: [CascaderAreaCounty],
  data() {
    return {
      breadCrumdItems: [
        {
          name: '角色管理'
        },
        {
          name: '编辑角色'
        }
      ],
      form: {
        roleName: '',
        roleDesc: '',
        permissionIds: []
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            max: 10,
            message: '最长10个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 200,
            message: '字符限制2~200',
            trigger: 'blur'
          }
        ]
      },
        permissionIdList :[],
        defaultProps: {
        children: 'children',
        label: 'name'
      },
      allPermissionIdList: []
    }
  },
  created() {
    this.modifyPermission()
    this.getinformation()

    // this.getPermissionList()
    // this.getRoleInfoById()

  },
  methods: {
    async getinformation(){
       let roleId  = this.$route.query.id
        let res = await getRoleData({roleId:roleId})
        this.form.roleName   = res.data.roleName
        this.form.roleDesc   = res.data.roleDesc
        this.form.permissionIds   = res.data.permissionIdList
        console.log( this.form,'id');
    },


 handleNodeClick() {
      let res = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        this.form.permissionIds=[...res]
        console.log( res)
 },








   async modifyPermission(){
      let res=await getPermission()
       this.permissionIdList=res.data
      console.log(res);

    },
    /**
     * 根据角色id获取角色信息
     */
    async getRoleInfoById() {
      let _self = this
      // 获取权限树
      let res = await _self.$http.get(PermissionTree)
      // 获取所有权限id
      this.allPermissionIdList = res.data.map(item => {
        return item.id
      })
      // 获取最外层1级元素
      res.data.forEach(item => {
        if (item.pId == 0) {
          _self.permissionIdList.push({
            id: item.id,
            pId: item.pId,
            label: item.name,
            children: []
          })
        }
      })
      res.data.forEach(item => {
        _self.permissionIdList.forEach(val => {
          if (item.pId == val.id) {
            val.children.push({
              id: item.id,
              label: item.name,
              children: []
            })
          }
        })
      })
      res.data.forEach(item => {
        _self.permissionIdList.forEach(subItem => {
          if (subItem.children.length == 0) return
          subItem.children.forEach(thirdItem => {
            if (thirdItem.id == item.pId) {
              thirdItem.children.push({
                id: item.id,
                label: item.name,
                children: []
              })
            }
          })
        })
      })
      if (res.status == 0) {
        setTimeout(function() {
          // 获取当前用户权限
          _self.$http
            .get(GetRoleInfoById, {
              roleId: _self.$route.params.id
            })
            .then(res => {
              _self.form.roleName = res.data.roleName
              _self.form.roleDesc = res.data.roleDesc
              // 判断是否是管理员账户
              if (res.data.roleDesc === '全部权限') {
                _self.form.permissionIds = this.allPermissionIdList
              } else {
                _self.form.permissionIds = res.data.permissionIdList
              }
            })
        }, 100)
      }
    },
    /**
     * 获取权限列表
     */
    getPermissionList() {},
    /**
     * 确定按钮点击事件
     * @param { Object } e 提交点击事件对象
     */
     submit() {


      this.$refs.newRoleManagementForm.validate( async valid => {
        if (!valid) {
          return
        }
        let data = {
          roleName: this.form.roleName,
          roleDesc: this.form.roleDesc,
          permissionIds: this.form.permissionIds,
          roleId: this.$route.query.id
        }
         let res= await modifyRole(data)
         console.log(res,'确定');
           if(res.status==0){
           this.$message({
          message: '修改成功',
          type: 'success'
        });
           _self.$router.go(-1)
        }else{
          this.$message({
          message: '修改失败',
          type: 'warning'
        });
        }
      })
    },
    /**
     * 复选框点击事件
     * @param {Object} param1 该节点所对应的对象
     * @param {Object} param2 树目前的选中状态对象
     *
     */
    checkId(param1, param2) {
      // 获取除基础功能外的所有三级节点
      let thirdIdList = []
      this.permissionIdList.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(subItem => {
            if (subItem.children.length > 0) {
              subItem.children.forEach(thirdItem => {
                if (thirdItem.label !== '基础功能') {
                  thirdIdList.push(thirdItem.id)
                }
              })
            }
          })
        }
      })

      if (thirdIdList.includes(param1.id) && param2) {
        // 获取选中节点的父级节点
        let parentObj = {}
        this.permissionIdList.forEach(item => {
          item.children.forEach(subItem => {
            subItem.children.forEach(thirdItem => {
              if (thirdItem.id == param1.id) {
                parentObj = subItem
              }
            })
          })
        })
        // 设置基础功能选中
        if (Object.keys(parentObj) == 0) return
        let basicFunctionId = parentObj.children.find(item => {
          return (item.label = '基础功能')
        }).id
        this.$refs.tree.setChecked(basicFunctionId, true)
      }

      // 如果有其它三级权限的按钮选中，阻止用户手动取消基础功能
      if (param1.label == '基础功能' && !param2) {
        console.log(param1.label, param2)
        let parentObj = {}
        this.permissionIdList.forEach(item => {
          item.children.forEach(subItem => {
            subItem.children.forEach(thirdItem => {
              if (thirdItem.id == param1.id) {
                parentObj = subItem
              }
            })
          })
        })
        let flag = false
        let checkedIdList = this.$refs.tree.getCheckedKeys() // 获取当前被选中的节点数组
        parentObj.children.forEach(item => {
          if (checkedIdList.includes(item.id)) {
            flag = true
          }
        })
        if (flag) {
          this.$refs.tree.setChecked(param1.id, true)
          this.common.showErrorToast('有三级按钮选中时，必须选中基础功能')
        }
      }
    },
    /**
     * 取消按钮点击事件
     */
    cancle() {
      this.$router.go(-1)
    }
  },
  // components: {
  //   comBreadCrumb,
  //   comTitleDivider,
  //   comSingleSelect,
  //   comShowOverFlowTip
  // }
}
</script>

<style scoped lang='scss'>
.el-tree {
  border: 1px solid #dadde4;
  border-radius: 0px;
  background-color: #fff;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #ffff !important ;
}

.sidebar-g-container {
  overflow-x: hidden;
}

.new-user-management-g-wrapper .g-form .el-checkbox {
  width: 24px !important;
}

.new-user-management-g-wrapper .g-form {
  width: 550px;
  text-align: left;
  margin: 0 auto;
}

.new-user-management-g-wrapper .g-form .g-form-item {
  width: 500px;
}

.new-user-management-g-wrapper .g-form .line {
  text-align: center;
}

.new-user-management-g-wrapper .g-form .el-date-editor.el-input,
.new-user-management-g-wrapper .g-form .el-date-editor.el-input__inner {
  width: auto;
}

.new-user-management-g-wrapper .g-form .el-input__prefix {
  left: auto;
  right: 0;
}

.new-user-management-g-wrapper .g-form .g-upload {
  display: inline;
  height: 40px;
  line-height: 55px;
}

.new-user-management-g-wrapper .g-form .el-upload-button {
  padding: 0 15px;
  height: 28px !important;
  line-height: 28px;
}

.new-user-management-g-wrapper .g-form .show-off-class .g-divider {
  margin-right: 10px;
}

.new-user-management-g-wrapper .g-form .show-off-class .iconfont {
  cursor: pointer;
}

.new-user-management-g-wrapper .g-form .high-setup-class {
  margin-top: 10px;
  min-height: 200px;
  border: 1px dashed #888;
  background: rgba(245, 247, 253, 1);
}

.new-user-management-g-wrapper .g-form .el-checkbox {
  width: 130px;
}

.new-user-management-g-wrapper .g-form .g-checkbox .el-checkbox__label {
  vertical-align: middle;
}

.new-user-management-g-wrapper .g-form .g-checkbox .tool-tip-g-content {
  width: 105px;
}

.new-user-management-g-wrapper .g-form .g-check-box-class {
  margin-left: 0;
}

.g-footer .g-footer-btn {
  width: 200px;
  margin: 0 auto;
}

.g-footer .m-button-normal {
  float: unset;
  width: 88px;
}

.g-footer button:first-child {
  color: #fff;
  background: #3f6acb;
}

.new-user-management-g-wrapper .g-search-select {
  width: 132px;
}

.el-upload-filelist-wrapper {
  text-align: left;
}

.el-upload-filelist {
  display: block;
  float: left;
  width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 36px;
  color: #2aa3f0;
}

.el-upload-close {
  color: #606266;
  font-size: 14px;
  float: right;
  line-height: 36px;
}

.buttom-upload {
  width: 68px !important;
}

</style>
