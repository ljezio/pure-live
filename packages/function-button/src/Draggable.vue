<template>
  <div
    ref="draggableRef"
    class="draggable"
    :style="{ left: axis.x + 'px', top: axis.y + 'px' }"
    @mousedown="startDrag"
  >
    <slot/>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue';
import { throttle } from './common';

const axisStorageKey = 'pure_live_draggable_axis';
const draggableE = useTemplateRef('draggableRef');
const isDragging = ref(false);
const axis = reactive({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

function startDrag(event) {
  if (event.target !== draggableE.value) return;
  axis.mouseX = event.clientX;
  axis.mouseY = event.clientY;
  isDragging.value = true;
}

function onDrag(event) {
  if (!isDragging.value) return;
  setNewAxis(event.clientX - axis.mouseX + axis.x, event.clientY - axis.mouseY + axis.y);
  axis.mouseX = event.clientX;
  axis.mouseY = event.clientY;
}

function stopDrag() {
  isDragging.value = false;
  // 保存组件坐标
  localStorage.setItem(
    axisStorageKey,
    JSON.stringify({ oldX: axis.x, oldY: axis.y, oldWidth: innerWidth, oldHeight: innerHeight }),
  );
}

const beforeWidth = ref(innerWidth);
const beforeHeight = ref(innerHeight);

const resize = throttle(() => {
  setNewAxis((axis.x / beforeWidth.value) * innerWidth, (axis.y / beforeHeight.value) * innerHeight);
  beforeWidth.value = innerWidth;
  beforeHeight.value = innerHeight;
}, 100);

/**
 * 设置新的坐标，不超过浏览器边界
 */
function setNewAxis(newX, newY) {
  if (newX < 0) {
    axis.x = 0;
  } else if (newX > document.documentElement.clientWidth - draggableE.value.offsetWidth) {
    axis.x = document.documentElement.clientWidth - draggableE.value.offsetWidth;
  } else {
    axis.x = newX;
  }
  if (newY < 0) {
    axis.y = 0;
  } else if (newY > document.documentElement.clientHeight - draggableE.value.offsetHeight) {
    axis.y = document.documentElement.clientHeight - draggableE.value.offsetHeight;
  } else {
    axis.y = newY;
  }
}

onBeforeMount(() => {
  // 恢复组件坐标
  const oldAxis = JSON.parse(localStorage.getItem(axisStorageKey));
  if (!oldAxis) return;
  axis.x = (oldAxis.oldX / oldAxis.oldWidth) * innerWidth;
  axis.y = (oldAxis.oldY / oldAxis.oldHeight) * innerHeight;
});

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
  padding: 8px;
  background-color: transparent;
  user-select: none;
}
</style>
