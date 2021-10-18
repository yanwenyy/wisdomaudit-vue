import Layout from '@/layout/index'


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
        title: '用户管理',
      },
    },
    {
      path: '/userManagement',
      component: () => import("@WISDOMAUDIT/views/systemmanagement"),

      name: 'modelManagement',
      meta: {
        title: '角色管理',
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

]
}

export default Systemmanagement
