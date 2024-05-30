import Vue from "vue";
import App from "./App.vue";
import { marked } from "marked"; // 导入marked模块
import hljs from "highlight.js"; // 导入highlight.js模块
import "highlight.js/styles/atom-one-dark.css"; //样式

//创建v-highlight全局指令
Vue.directive("highlight", function (el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});

Vue.config.productionTip = false;

// 配置marked
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
