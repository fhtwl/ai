import App from "./App";
// #ifndef VUE3
import Vue from "vue";
import uView from "uview-ui";
import mixin from "./common/mixin.js"

Vue.use(uView);



import "./config/route.js";
import "./config/request.js";


Vue.mixin(mixin)

import tabbar from "@/components/tabbar.vue";
Vue.component("tabbar", tabbar);

Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
