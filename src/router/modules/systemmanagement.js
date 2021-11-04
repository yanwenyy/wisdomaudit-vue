import Layout from '@WISDOMAUDIT/layout/index'


const Systemmanagement = {
  path: '/systemmanagement',
  component: Layout,
  redirect: '/systemmanagement',
  name: 'modelManagement',
  meta: {
    title: '系统管理',

  },
     children: [{
      path: '/systemmanagement',
      component: () => import("@WISDOMAUDIT/views/systemmanagement/userManagement"),
      name: 'modelManagement',
      meta: {
        title: '系统管理-用户管理',
      },
    },
    {
      path: '/userManagement',
      component: () => import("@WISDOMAUDIT/views/systemmanagement"),

      name: 'modelManagement',
      meta: {
        title: '系统管理-权限管理',
      }
    },{
      path: '/newUserManagement',
      name: 'newUserManagement',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/systemmanagement/userManagement/newUserManagement'),
      meta: {
        title: '新增用户'
      },
    },
    {
      path: '/editUserManagement',
      name: 'editUserManagement',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/systemmanagement/userManagement/editUserManagement'),
      meta: {
        title: '编辑用户'
      },
    },
    {
      path: '/newRoleManagement',
      name: 'newRoleManagement',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/systemmanagement/newRoleManagement'),
      meta: {
        title: '新增用户'
      },
    },
    {
      path: '/editRoleManagement',
      name: 'editRoleManagement',
      hidden:true,
      component: () => import('@WISDOMAUDIT/views/systemmanagement/editRoleManagement'),
      meta: {
        title: '编辑用户'
      },
    },
    {
      path: '/parameterManagement',
      component: () => import('@WISDOMAUDIT/views/systemmanagement/parameterManagement'),
      meta: {
        title: '参数管理'
      },
    },
    {
      path: '/auditedInstitution',
      component: () => import('@WISDOMAUDIT/views/systemmanagement/auditedInstitution'),
      meta: {
        title: '被审计机构管理'
      },
    },
]
}

export default Systemmanagement
