import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'


const riskmonitoringRouter =
{
  path: '/riskmonitoring',
  component: Layout,
  // redirect: '/audit/project',
  name: 'Audit',
  meta: {
    title: '风险监控',
    icon: 'nested'
  },
  children: [
    {
      path: 'project',
      name: 'project',
      component: AppMain,
      meta: {
        title: '风险扫描',
      },
      children: [
        {
          path: 'risperson',
          name: 'risperson',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '个人'
          },
        },
        {
          path: 'risgovernment',
          name: 'risgovernment',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '政企'
          },
        },
        {
          path: 'risfinance',
          name: 'risfinance',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '财务'
          },
        },
        {
          path: 'risnetwork',
          name: 'risnetwork',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '网络'
          }
        },
      ]
    },
    {
      path: 'numriskMonitoring',
      name: 'numriskMonitoring',
      component: AppMain,
      meta: {
        title: '数据审计风险监控',
      },
      children: [
        {
          path: 'numperson',
          name: 'numperson',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '个人'
          },
        },
        {
          path: 'numgovernment',
          name: 'numgovernment',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '政企'
          },
        },
        {
          path: 'numfinance',
          name: 'numfinance',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '财务'
          },
        },
        {
          path: 'numnetwork',
          name: 'numnetwork',
          component: () => import('@SDMOBILE/views/audit/responseAdd'),
          meta: {
            title: '网络'
          }
        },
      ]
    },

    {
      path: 'numriskMonitoring',
      name: 'numriskMonitoring',
      component: AppMain,
      // redirect: '/numriskMonitoring/notification',
      children:[
        {
          path: 'notification',
          name: 'notification',
          component: () => import('@SDMOBILE/views/audit/project'),
          meta: {
            title: '数据审计风险监控通报',
          },
        }
      ]
    } 
   
  ]
}



export default riskmonitoringRouter
