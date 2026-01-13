import { createApp } from 'vue'
import '@/common/style/global.scss'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './App.vue'
import ElementPlus from "element-plus";
import install from './install/index'
// element css
import "element-plus/dist/index.css";
import * as Sentry from "@sentry/vue";
import '@/common/style/elementReset.scss';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import enUs from 'element-plus/es/locale/lang/en';
import i18n from './lang';
let instance: any = null;

//引入字体图标库
import '@/styles/iconfont.css';
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
import './styles/variables.scss';
import 'virtual:svg-icons-register' //注册svg图标模块
import '@/common/style/dark.scss';

import '@/common/style/light.scss';
//添加默认主题模式
document.documentElement.classList.add('light')


// 根据i18n设置Element Plus的语言
const getElementLocale = () => {
  const locale = i18n.global.locale.value;
  return locale === 'en-US' ? enUs : zhCn;
};


function render(props: any = {}) {
  const { container } = props;
  instance = createApp(App);
  // 初始化 Sentry 与 Vue 实例的连接
  if (instance && !Sentry.getCurrentScope().getClient()) {
    Sentry.init({
      app: instance,
      dsn: "https://3048882cbebd0f0fa5950cb5b4ef59e4@o4509684149518336.ingest.de.sentry.io/4509684151156816",
      sendDefaultPii: true,
      integrations: [Sentry.browserTracingIntegration(), Sentry.feedbackIntegration()],
      tracesSampleRate: 1.0
    });
  }
  instance.use(install)
  instance.use(ElementPlus, {  
    locale: getElementLocale(),  
  }); 
  instance.use(i18n)
  // 如果是在 qiankun 环境下，挂载到容器内；否则挂载到 #app
  instance.mount(container ? container.querySelector('#app') : '#app');
}
renderWithQiankun({
  mount(props) {
    console.log('mount', props);
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props) {
    console.log('unmount', props);
    instance.unmount();
    instance._container.innerHTML = '';
    instance = null;
  },
  update(props) {
    console.log('update', props);
  }
});

// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}