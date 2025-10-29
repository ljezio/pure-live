/*
 * pure-live, a script that makes live webpages pure.
 * Copyright (C) 2025-present ljezio
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import { createApp } from 'vue';
import { INJECTION_KEY } from '@/common/constants';
import App from '@/components/App.vue';

export default function mountVue(topLayerEl, inputMaxlength, sendBulletChatFn) {
  const app = createApp(App);
  app.provide(INJECTION_KEY.TOP_LAYER_EL, topLayerEl);
  app.provide(INJECTION_KEY.INPUT_MAX_LENGTH, inputMaxlength);
  app.provide(INJECTION_KEY.SEND_BULLET_CHAT_FN, sendBulletChatFn);
  app.mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  );
}
