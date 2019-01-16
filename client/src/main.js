import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-socket.io";
import store from "./store";
import axios from "axios";
import Buefy from "buefy";
import VueProgressBar from "vue-progressbar";

import "buefy/dist/buefy.css"; //remove for custom styling

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(
  new VueSocketIO({
    connection: "localhost:8081"
  })
);
Vue.use(VueProgressBar, {
  color: "#7957d5",
  failedColor: "rgb(244, 67, 54)",
  height: "2px"
});

const User = JSON.parse(localStorage.getItem("User"));
if (User) {
  store.commit("logInUser", User);
  axios.defaults.headers.common["x-auth-token"] = User.JWToken;
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
