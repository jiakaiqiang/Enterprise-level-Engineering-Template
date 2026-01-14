import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerMicroApps, start, setDefaultMountApp } from 'qiankun';
import router from './router'

const apps = [
  {
    name: 'sub-frondSystem', // 子应用名称
    entry: '//localhost:3303/frondSystem', // 子应用入口
    container: '#subapp-viewport', // 容器ID
    activeRule: '/sub-frondSystem', // 激活路由规则
    props: { // 传递给子应用的数据
      routerBase: '/frondSystem',
     
    }
  },
 
];
registerMicroApps(apps, {
  // 生命周期钩子
  beforeLoad: (app) => {
    console.log('[主应用] before load', app.name);
    return Promise.resolve();
  },
  beforeMount: (app) => {
    console.log('[主应用] before mount', app.name);
    return Promise.resolve();
  },
  afterMount: (app) => {
    console.log('[主应用] after mount', app.name);
    return Promise.resolve();
  },
  afterUnmount: (app) => {
    console.log('[主应用] after unmount', app.name);
    return Promise.resolve();
  }
});
// // 设置默认启动子应用
// setDefaultMountApp('/sub-frondSystem');

// 启动 qiankun
start({
  sandbox: {
    strictStyleIsolation: true, // 严格的样式隔离
    experimentalStyleIsolation: true // 实验性的样式隔离
  },
  prefetch: true, // 开启预加载
  singular: true // 单实例模式
});

createApp(App).use(router).mount('#app')
