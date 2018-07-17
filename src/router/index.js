import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import MainHome from '../views/main/Home'

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
            ],
        },
    ],
})
