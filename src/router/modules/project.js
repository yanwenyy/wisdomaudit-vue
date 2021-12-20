

const riskmonitoringRouter =
{
    path: '/auditItems',
    component: () => import('@WISDOMAUDIT/layout/index'),
    // redirect: '/audit/project',
    name: 'auditItems',
    meta: {
        title: '审计项目',
        icon: 'nested'
    },
    children: [
        {
            path: 'application',
            name: 'application',
            component: () => import('@SDMOBILE/views/audit/projectmanagement'),
            meta: {
                title: '项目管理'
            }
        },
        {
            path: 'projectWorkbench',
            name: 'projectWorkbench',
            component: () => import('@SDMOBILE/views/audit/projectworkbench'),
            meta: {
                title: '项目工作台'
            }
        }
    ]
}



export default riskmonitoringRouter
