<!--
  - pure-live, a script that makes live webpages pure.
  - Copyright (C) 2025-present ljezio
  -
  - This program is free software: you can redistribute it and/or modify it under the
  - terms of the GNU General Public License as published by the Free Software Foundation,
  - either version 3 of the License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  - without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  - See the GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License along with this program.
  - If not, see <https://www.gnu.org/licenses/>.
  -->
<script setup>
import { inject, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const topLayerEl = inject('topLayerEl');
const inputMaxlength = inject('inputMaxlength', 30);
const sendBulletChatFn = inject('sendBulletChatFn', () => {});

const bulletInputEl = useTemplateRef('bulletInput');

const isShow = ref(false);
const bulletChat = ref('');
const composing = ref(false); // 是否中文输入法输入中

function send() {
  if (document.activeElement !== bulletInputEl.value) {
    bulletInputEl.value.focus();
  }
  if (!bulletChat.value) return;
  sendBulletChatFn(bulletChat.value);
  bulletChat.value = '';
  isShow.value = false;
}

function handleEnter(event) {
  if (event.key !== 'Enter' && event.code !== 'Enter') return;
  if (isShow.value === false) {
    isShow.value = true;
    nextTick(() => bulletInputEl.value.focus());
    return;
  }
  // 中文输入法还没选择候选词的时候，输入框获取的字符串（bulletChat.value）为空
  if (composing.value) return;
  if (isShow.value === true && !bulletChat.value) {
    isShow.value = false;
    return;
  }
  send();
}

onMounted(() => {
  document.addEventListener('keydown', handleEnter);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEnter);
});
</script>

<template>
  <Teleport v-if="topLayerEl" :to="topLayerEl">
    <div class="wrap" v-show="isShow">
      <input
        class="input"
        placeholder="请输入弹幕~"
        :maxlength="inputMaxlength"
        autocomplete="off"
        ref="bulletInput"
        v-model="bulletChat"
        @compositionstart="composing = true"
        @compositionend="composing = false"
      >
      <button class="button" @click="send">发送 (Enter)</button>
    </div>
  </Teleport>
</template>

<style scoped>
.wrap {
  z-index: 99999;
  display: flex;
  align-items: center;
  width: 650px;
  height: 40px;
  position: fixed;
  left: calc(50vw - 325px);
  bottom: 20vh;
  border-radius: 10px;
  background: hsla(0, 0%, 100%, 80%);
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.25098);
  font-size: 14px;
}

.wrap:focus-within {
  background: #fff;
}

.input {
  flex: 1;
  padding: 0 16px;
  height: 28px;
  border: 0;
  color: #333;
  font-weight: 400;
  opacity: 0.5;
  background: none;
}

.input:focus {
   opacity: 1;
   outline: none;
 }

.button {
  position: relative;
  flex-shrink: 0;
  padding: 0 13px;
  margin: 4px;
  height: 32px;
  line-height: 32px;
  border-radius: 8px;
  border: none;
  text-align: center;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 500%;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.5;
}

.button::before {
  z-index: -1;
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 12px;
  background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);
  background-size: 500%;
  filter: blur(20px);
  opacity: 0;
}

.wrap:focus-within .button, .wrap:focus-within .button::before {
  animation: flow 10s linear infinite;
  opacity: 1;
}

@keyframes flow {
  from {
    background-position: 0;
  }
  to {
    background-position: 500%;
  }
}
</style>
