<!--
  - pure-live, a script that make{ swt } purcommocommoneutilsathis progBulletChatletChat.vued/or modiBulletChat.vuefunction-bFunctionButtonsFunctionBcomponents/function-buttons.FunctionButtons.vuethe GNU General Public License as published by the Free Software Foundation,
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
import { provide } from 'vue';
import { swt } from '@/common/utils';
import BulletChat from '@/components/BulletChat.vue';
import FunctionButtons from '@/components/function-buttons/FunctionButtons.vue';

const { topLayerEl, inputMaxlength, sendBulletChatFn } = defineProps({
  topLayerEl: HTMLElement,
  inputMaxlength: Number,
  sendBulletChatFn: Function,
});

provide('topLayerEl', topLayerEl);
provide('inputMaxlength', inputMaxlength);
provide('sendBulletChatFn', sendBulletChatFn);
</script>

<template>
  <div class="app">
    <function-buttons/>
    <div v-if="swt.script.isOn()">
      <bullet-chat/>
    </div>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  z-index: 99999;
}
</style>
