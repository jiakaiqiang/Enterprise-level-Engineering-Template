<template>
  <!-- 属性弹窗：最顶层 fixed 定位 -->
  <teleport to="body">
    <transition name="attr-dialog-fade">
      <div
        v-if="visible"
        class="attr-dialog-mask"
        @click.self="handleMaskClick"
      >
        <div class="attr-dialog" :style="dialogStyle">
          <!-- 头部 -->
          <div class="attr-dialog-header">
            <span class="title">组件属性</span>
            <button class="close-btn" @click="close">×</button>
          </div>

          <!-- 内容区 -->
          <div class="attr-dialog-body">
            <!-- 空状态 -->
            <div v-if="!currentComp" class="empty-tip">暂无选中组件</div>

            <!-- 属性表单 -->
            <div v-else class="attr-form">
              <div class="form-item" v-for="(item, key) in compAttrs" :key="key">
                <label class="form-label">{{ item.label }}</label>
                <component
                  :is="item.editor"
                  v-model="item.value"
                  class="form-editor"
                  v-bind="item.editorProps"
                />
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="attr-dialog-footer">
            <button class="btn btn-primary" @click="save">保存</button>
            <button class="btn btn-secondary" @click="close">取消</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

/* props */
const props = defineProps({
  visible: { type: Boolean, default: false },
  currentComp: { type: Object, default: null } // 低代码当前组件元信息
})

/* emits */
const emit = defineEmits(['update:visible', 'save'])

/* 响应式：拷贝一份属性，避免直接修改元对象 */
const localAttrs = ref({})

/* 计算属性：将元信息转为可渲染结构 */
const compAttrs = computed(() => {
  if (!props.currentComp || !props.currentComp.props) return {}
  const result = {}
  Object.keys(props.currentComp.props).forEach(key => {
    const meta = props.currentComp.props[key]
    result[key] = {
      label: meta.label || key,
      value: localAttrs.value[key] ?? meta.default,
      editor: meta.editor || 'el-input', // 默认使用 el-input，可按需替换
      editorProps: meta.editorProps || {}
    }
  })
  return result
})

/* 监听：每次打开弹窗时同步最新属性 */
watch(
  () => props.visible,
  val => {
    if (val && props.currentComp) {
      localAttrs.value = { ...props.currentComp.attrs }
    }
  },
  { immediate: true }
)

/* 关闭弹窗 */
function close() {
  emit('handleclose', false)
}

/* 点击遮罩关闭 */
function handleMaskClick() {
  close()
}

/* 保存并回传 */
function save() {
  // 组装回传数据
  const payload = {}
  Object.keys(compAttrs.value).forEach(key => {
    payload[key] = compAttrs.value[key].value
  })
  emit('save', payload)
  close()
}

/* 弹窗位置 & 尺寸，可自定义 */
const dialogStyle = {
  width: '480px',
  top: '10vh'
}
</script>

<style scoped>
/* 遮罩 */
.attr-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* 弹窗主体 */
.attr-dialog {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: var(--top, 10vh);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
}

/* 头部 */
.attr-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
}
.attr-dialog-header .title {
  font-size: 16px;
  font-weight: 500;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  color: #999;
}
.close-btn:hover {
  color: #333;
}

/* 内容区 */
.attr-dialog-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 表单 */
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.form-label {
  width: 90px;
  flex-shrink: 0;
  margin-right: 8px;
  text-align: right;
}
.form-editor {
  flex: 1;
}

/* 底部 */
.attr-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e5e5;
}
.btn {
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
}
.btn-secondary {
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
}

/* 过渡动画 */
.attr-dialog-fade-enter-active,
.attr-dialog-fade-leave-active {
  transition: opacity 0.2s;
}
.attr-dialog-fade-enter-from,
.attr-dialog-fade-leave-to {
  opacity: 0;
}
</style>
