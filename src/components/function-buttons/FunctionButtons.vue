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
  <div v-show="isShow">
    <draggable>
      <button-group/>
    </draggable>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ButtonGroup from '@/components/function-buttons/ButtonGroup.vue';
import Draggable from '@/components/function-buttons/Draggable.vue';

const isShow = ref(true);

// 全屏不显示功能按钮
function handleShowButtonGroup() {
  isShow.value = !document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleShowButtonGroup);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleShowButtonGroup);
});
</script>

<style scoped>
</style>
