import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'


const riskmonitoringRouter =
{
  path: '/knowledgebase',
  component: Layout,
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
      path: 'Historicalaudit ',
      name: 'Historicalaudit ',
      component: () => import('@SDMOBILE/views/audit/knowledgeBase/Historicalaudit'),
      meta: {
        title: '省内历史审计发现'
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
