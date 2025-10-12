<template>
  <div
    ref="draggableRef"
    class="draggable"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
  >
    <slot/>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

const draggableE = useTemplateRef('draggableRef');
const isDragging = ref(false);
const x = ref(0);
const y = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);

function startDrag(event) {
  if (event.target !== draggableE.value) return;
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  isDragging.value = true;
}

function onDrag(event) {
  if (!isDragging.value) return;
  setNewAxis(event.clientX - mouseX.value + x.value, event.clientY - mouseY.value + y.value);
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
}

function stopDrag() {
  isDragging.value = false;
}

const beforeWidth = ref(innerWidth);
const beforeHeight = ref(innerHeight);

function resize() {
  setNewAxis((x.value / beforeWidth.value) * innerWidth, (y.value / beforeHeight.value) * innerHeight);
  beforeWidth.value = innerWidth;
  beforeHeight.value = innerHeight;
}

/**
 * 设置新的坐标，不超过浏览器边界
 */
function setNewAxis(newX, newY) {
  if (newX < 0) {
    x.value = 0;
  } else if (newX > document.documentElement.clientWidth - draggableE.value.offsetWidth) {
    x.value = document.documentElement.clientWidth - draggableE.value.offsetWidth;
  } else {
    x.value = newX;
  }
  if (newY < 0) {
    y.value = 0;
  } else if (newY > document.documentElement.clientHeight - draggableE.value.offsetHeight) {
    y.value = document.documentElement.clientHeight - draggableE.value.offsetHeight;
  } else {
    y.value = newY;
  }
}

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('resize', resize);
});
</script>

<style scoped>
.draggable {
  z-index: 99999;
  position: fixed;
  cursor: move;
  padding: 10px;
  background-color: transparent;
  user-select: none;
}
</style>
