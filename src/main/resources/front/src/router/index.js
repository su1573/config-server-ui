import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/User.vue'], resolve)
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/Role.vue'], resolve)
                },
                {
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve)
                },
                {
                    path: '/datasource',
                    component: resolve => require(['../components/page/DataSource.vue'], resolve)
                },
                {
                    path: '/runtime',
                    component: resolve => require(['../components/page/Runtime.vue'], resolve)
                },
                {
                    path: '/trace',
                    component: resolve => require(['../components/page/Trace.vue'], resolve)
                },
                {
                    path: '/log',
                    component: resolve => require(['../components/page/Log.vue'], resolve)
                },
                {
                    path: '/profile',
                    component: resolve => require(['../components/page/Profile.vue'], resolve)
                },
                {
                    path: '/label',
                    component: resolve => require(['../components/page/Label.vue'], resolve)
                },
                {
                    path: '/application',
                    component: resolve => require(['../components/page/Application.vue'], resolve)
                },
                {
                    name:'application',
                    path: '/application/:applicationId',
                    component: resolve => require(['../components/page/ApplicationProperty.vue'], resolve)
                },
                {
                    path: '/property',
                    component: resolve => require(['../components/page/Property.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})