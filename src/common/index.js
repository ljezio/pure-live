import { createApp } from 'vue';
import Container from './Container.vue';

export function mountVue() {
  createApp(Container).mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  );
}
