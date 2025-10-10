import { createApp } from 'vue';
import ButtonGroup from './src/ButtonGroup.vue';

export * from './src/common';

export default function mountFunctionButton() {
  createApp(ButtonGroup).mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  );
}
