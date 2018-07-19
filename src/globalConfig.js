// global tool
import lodash from 'lodash'
import moment from 'moment'

// global component
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as components from './components'

const GlobalConfig = {
    install (Vue) {
        // global tools
        Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })
        Object.defineProperty(Vue.prototype, '$moment', { value: moment })
        // global component
        Vue.use(ElementUI)
        Object.keys(components).forEach((name) => {
            Vue.component(name, components[name])
        })
    },
}

export default GlobalConfig
