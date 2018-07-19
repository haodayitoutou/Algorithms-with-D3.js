import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import MainHome from '../views/main/Home'

import FundamentalsHome from '../views/fundamentals/Home'
import Fundamentals from './fundamentals'

import SortingHome from '../views/sorting/Home'
import Sorting from './sorting'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    name: 'Main',
                    path: '',
                    component: MainHome,
                },
                {
                    path: 'fundamentals',
                    component: FundamentalsHome,
                    children: Fundamentals,
                },
                {
                    path: 'sorting',
                    component: SortingHome,
                    children: Sorting,
                },
            ],
        },
    ],
})
