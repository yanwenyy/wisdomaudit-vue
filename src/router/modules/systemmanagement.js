import { AppMain } from '@/layout/components'
import Layout from '@/layout/index'





const riskmonitoringRouter = 
{
    path: '/system management',
    component: Layout,
    // redirect: '/audit/project',
    name: 'system management',
    children:[
      {
        path: 'project',
            name: 'project',
            component: () => import('@SDMOBILE/views/audit/project'),
            meta: {
              title: '系统管理',
              icon: 'nested'
            },
      }
    ]
}







export default riskmonitoringRouter
