// 引入标准的vue模块
import Vue from 'vue';

// 导入变量声明
import { smart, Event } from "@xtp-smart/sdk";

// 引入插件开发的vue组件
// @ts-ignore
import App from './App.vue';

namespace demo {
    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        new Vue({
            render: h => h(App),
        }).$mount('#app');
    });
}
