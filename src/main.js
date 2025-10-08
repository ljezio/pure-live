import { createApp } from "vue";
import { scriptSwitch } from "./common";
import {
  autoFullWindow,
  autoHighestImage,
  avoidSmallWindow,
  dbClick,
} from "./core";
import App from "./html/App.vue";

window.onload = () => {
  createApp(App).mount(
    (() => {
      const div = document.createElement("div");
      document.body.append(div);
      return div;
    })(),
  );
  if (scriptSwitch.isOn()) {
    import("./restyle.css");
    avoidSmallWindow();
    autoFullWindow().then(() => autoHighestImage());
    dbClick();
  }
};
