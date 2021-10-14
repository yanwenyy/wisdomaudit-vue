import Vue from 'vue'
import Router from 'vue-router'
import store from '@WISDOMAUDIT/store/index.js'

import wisdomauditRouter from './modules/wisdomaudit'
//审计整改模块
import auditCorrective from './modules/auditCorrective'
//模型管理模块
import modelManagement from './modules/modelManagement'
// 数据管理
import datamanagement from './modules/datamanagement'
// 系统管理
import systemmanagement from './modules/systemmanagement'

Vue.use(Router)

// if(sessionStorage.getItem("TOKEN")){

//   store.commit("set_token",sessionStorage.getItem("TOKEN"))
// }
/* Layout */
import Layout from '@/layout/index'
import {
  AppMain
} from "@/layout/components";


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@WISDOMAUDIT/views/login'),
  },

  {
    path: '/404',
    component: () => import('@WISDOMAUDIT/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/audit/home',
    // children:[
    //   {
    //     path:'/audit/accountableAdd',
    //     component: () => import('@/views/audit/project/accountableAdd.vue')
    //   }
    // ]
  },

  {
    path: "/audit/home",
    name: "home",
    component: Layout,

    children: [{
      path: "/audit/home",
      name: "home",
      component: () => import("@WISDOMAUDIT/views/audit/home"),
      meta: {
        title: "首页"
      }
    }]

  },

  {
    path: "/project",
    name: "project",
    component: Layout,
    meta: {
      title: "审计概览"
    },
    children:[
      {
        path: "/project",
        name: "project",
        component: () => import("@WISDOMAUDIT/views/audit/project"),
        meta: {
          title: "审计概览"
        }
      }
    ]
    
  },
  {
    path: "/Newpage",
    name: "Newpage",
    component: () => import("@WISDOMAUDIT/views/audit/project"),
    hidden:true,
    meta: {
      title: "审计概览"
    }
  },
  {
    path: "/audit/riskMonitoring",
    name: "riskMonitoring",
    redirect: "/riskMonitoring/riskScan/personal",
    component: Layout,
    meta: {
      title: "风险监控"
    },
    children: [{
      path: "riskScan",
      name: "riskScan",
      component: () => import("@/layout/blank"),
      // component: () => import('@WISDOMAUDIT/views/audit/accountableAdd'),
      // wisdomaudit-vue\src\views\audit\riskScan\personal
      meta: {
        title: "风险扫描"
      },
      children: [{
          path: "/personal",
          name: "personal",
          component: () =>
            import("@WISDOMAUDIT/views/audit/riskScan/personal"),
          meta: {
            title: "个人"
          }
        },
        {
          path: "/enterprise",
          name: "enterprise",
          component: () =>
            import("@WISDOMAUDIT/views/audit/riskScan/enterprise"),
          meta: {
            title: "政企"
          }
        }
      ]
    }]
  },

  {
    path: "/audit/auditItems",
    name: "auditItems",
    component: Layout,
    meta: {
      title: "审计项目"
    },
    children: [{
        path: "application",
        name: "application",
        component: () => import("@WISDOMAUDIT/views/audit/projectmanagement"),
        meta: {
          title: "项目管理"
        }
      },
      {
        path: "projectWorkbench",
        name: "projectWorkbench",
        component: () => import("@WISDOMAUDIT/views/audit/projectworkbench"),
        meta: {
          title: "项目工作台"
        }
      },
      {
        path: "feedback",
        name: "Feedback",
        component: () => import("@WISDOMAUDIT/views/audit/feedback"),
        meta: {
          title: "反馈审计资料"
        }
      }
    ]
  },
  auditCorrective,
  {
    path: "/audit/personalManage",
    name: "personalManage",
    component: Layout,
    // component: () => import('@WISDOMAUDIT/views/audit/personalManage'),
    meta: {
      title: "知识库"
    },
    children: [{
        path: "auditbasis",
        name: "Auditbasis",
        component: () => import("@WISDOMAUDIT/views/audit/auditbasis"),
        meta: {
          title: "审计依据"
        }
      },
      {
        path: "excellentcases",
        name: "Excellentcases",
        component: () => import("@WISDOMAUDIT/views/audit/excellentcases"),
        meta: {
          title: "优秀案例及内参"
        }
      },
      {
        path: "ModelList",
        name: "ModelList",
        component: () => import("@WISDOMAUDIT/views/audit/ModelList"),
        meta: {
          title: "模型清单"
        }
      },
      {
        path: "auditHistory",
        name: "auditHistory",
        component: () => import("@WISDOMAUDIT/views/audit/auditHistory"),
        meta: {
          title: "省内历史审计发现"
        }
      }
    ]
  },

  wisdomauditRouter,
  modelManagement,
  datamanagement,
  {
    path: '/systemmanagement',
    component: Layout,
    redirect: '/systemmanagement',
    name: 'modelManagement',
    meta: {
      title: '系统管理',
    },
    children: [{
      path: '/systemmanagement',
      component: () => import("@WISDOMAUDIT/views/systemmanagement"),
      name: 'modelManagement',
      meta: {
        title: '系统管理',
      },
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
