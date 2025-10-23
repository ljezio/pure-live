<template>
  <div v-show="isShow">
    <draggable>
      <button-group/>
    </draggable>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ButtonGroup from './ButtonGroup.vue';
import Draggable from './Draggable.vue';

const isShow = ref(true);

onMounted(() => {
  document.addEventListener('fullscreenchange', handleShowButtonGroup);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleShowButtonGroup);
});

// 全屏不显示
function handleShowButtonGroup() {
  isShow.value = !document.fullscreenElement;
}
</script>

<style scoped>
</style>
