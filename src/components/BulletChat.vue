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
<template>
  <div class="wrap" v-show="isShow">
    <input
      class="input"
      type="text"
      placeholder="请输入弹幕~"
      maxlength="70"
      autocomplete="off"
      ref="bulletInput"
      v-model="bulletChat"
    >
    <button class="button" @click="send">发送（Enter）</button>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const emits = defineEmits(['sendBulletChat']);

const isShow = ref(false);
const bulletInputEl = useTemplateRef('bulletInput');
const bulletChat = ref('');

function send() {
  if (document.activeElement !== bulletInputEl.value) {
    bulletInputEl.value.focus();
  }
  if (!bulletChat.value) return;
  emits('sendBulletChat', bulletChat.value);
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

<style scoped>
.wrap {
  z-index: 99999;
  display: flex;
  align-items: center;
  width: 650px;
  height: 40px;
  position: absolute;
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

.button {
  flex-shrink: 0;
  padding: 0 13px;
  height: 40px;
  line-height: 40px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: center;
  background: linear-gradient(135deg, #06d6a0 0%, #118ab2 100%);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.5;
}

.input:focus, .wrap:focus-within .button {
  opacity: 1;
}
</style>
