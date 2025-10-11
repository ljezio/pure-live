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

const draggableElement = useTemplateRef('draggableRef');
const isDragging = ref(false);
const x = ref(window.innerWidth - 40);
const y = ref(10);
const mouseX = ref(0);
const mouseY = ref(0);

function startDrag(event) {
  if (event.target !== draggableElement.value) return;
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  isDragging.value = true;
}

function onDrag(event) {
  if (isDragging.value) {
    x.value += event.clientX - mouseX.value;
    y.value += event.clientY - mouseY.value;
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;
  }
}

function stopDrag() {
  isDragging.value = false;
}

const beforeWidth = ref(window.innerWidth);
const beforeHeight = ref(window.innerHeight);

function resize() {
  x.value = x.value / beforeWidth.value * window.innerWidth;
  y.value = y.value / beforeHeight.value * window.innerHeight;
  beforeWidth.value = window.innerWidth;
  beforeHeight.value = window.innerHeight;
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
  position: absolute;
  cursor: move;
  padding: 8px;
  background-color: transparent;
  user-select: none;
}
</style>
