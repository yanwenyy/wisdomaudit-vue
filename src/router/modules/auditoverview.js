import { AppMain } from '@WISDOMAUDIT/layout/components'
import Layout from '@WISDOMAUDIT/layout/index'


const riskmonitoringRouter = 
{
    path: '/auditoverview',
    component: Layout,
    // redirect: '/audit/project',
    name: 'Audit',
    children:[
      {
        path: 'project',
            name: 'project',
            component: () => import('@SDMOBILE/views/audit/project'),
            meta: {
              title: '审计概览',
              icon: 'nested'
            },
      }
    ]
}



export default riskmonitoringRouter
