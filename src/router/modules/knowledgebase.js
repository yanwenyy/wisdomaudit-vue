

const riskmonitoringRouter =
{
  path: '/knowledgebase',
  component: () => import('@WISDOMAUDIT/layout/index'),
  // redirect: '/audit/project',
  name: 'knowledgebase',
  meta: {
    title: '知识库',
    icon: 'nested'
  },
  children: [
    {
      path: 'basis',
      name: 'basis',
      component: () => import('@SDMOBILE/views/audit/projectmanagement'),
      meta: {
        title: '审计依据'
      }
    },
    {
      path: 'modellist',
      name: 'modellist',
      component: () => import('@SDMOBILE/views/audit/projectworkbench'),
      meta: {
        title: '模型清单'
      }
    },
    {
      path: 'findings ',
      name: 'findings ',
      component: () => import('@WISDOMAUDIT/views/audit/knowledgeBase/Historicalaudit'),
      meta: {
        title: '省内审计发现'
      }
    },
    {
      path: 'references',
      name: 'references',
      component: () => import('@SDMOBILE/views/audit/projectworkbench'),
      meta: {
        title: '优秀案例及内参'
      }
    },
  ]
}



export default riskmonitoringRouter
