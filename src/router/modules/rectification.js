import { AppMain } from '@WISDOMAUDIT/layout/components'
import Layout from '@WISDOMAUDIT/layout/index'


const riskmonitoringRouter =
{
    path: '/rectification',
    component: Layout,
    // redirect: '/audit/project',
    name: 'rectification',
    meta: {
        title: '审计整改',
        icon: 'nested'
    },
    children: [
        {
            path: 'plan',
            name: 'plan',
            component: () => import('@SDMOBILE/views/audit/projectmanagement'),
            meta: {
                title: '整改计划'
            }
        },
        {
            path: 'measures',
            name: 'measures',
            component: () => import('@SDMOBILE/views/audit/projectworkbench'),
            meta: {
                title: '整改措施'
            }
        },
        {
            path: 'book',
            name: 'book',
            component: () => import('@SDMOBILE/views/audit/projectmanagement'),
            meta: {
                title: '整改台账'
            }
        },
        {
            path: 'writeoff',
            name: 'writeoff',
            component: () => import('@SDMOBILE/views/audit/projectworkbench'),
            meta: {
                title: '整改销项'
            }
        },
    ]
}



export default riskmonitoringRouter
