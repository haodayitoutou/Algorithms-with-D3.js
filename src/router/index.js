import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import MainHome from '../views/main/Home'

import FundamentalsHome from '../views/fundamentals/Home'
import Fundamentals from './fundamentals'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: '',
                    component: MainHome,
                },
                {
                    path: 'fundamentals',
                    component: FundamentalsHome,
                    children: Fundamentals,
                },
            ],
        },
    ],
})
