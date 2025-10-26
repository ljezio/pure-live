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
import { KEYS } from '@/common/constants';
import { storage, throttle } from '@/common/utils';

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
  storage.set(KEYS.DRAGGABLE_AXIS, { oldX: axis.x, oldY: axis.y, oldWidth: innerWidth, oldHeight: innerHeight });
}

const beforeSize = reactive({ width: innerWidth, height: innerHeight });

const resize = throttle(() => {
  setNewAxis((axis.x / beforeSize.width) * innerWidth, (axis.y / beforeSize.height) * innerHeight);
  beforeSize.width = innerWidth;
  beforeSize.height = innerHeight;
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
  const oldAxis = storage.get(KEYS.DRAGGABLE_AXIS);
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
  position: fixed;
  cursor: move;
  padding: 8px;
  background-color: transparent;
  user-select: none;
}
</style>
