import { createApp } from 'vue';
import Element from './Element.vue';

export * from './src/common';

export default function mountElement() {
  createApp(Element).mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  );
}
