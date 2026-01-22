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
            <span class="title">{{currentComp?.node?.data?.title || '组件属性'}}</span>
            <button class="close-btn" @click="close">×</button>
          </div>

          <!-- 内容区 -->
          <div class="attr-dialog-body">
            <!-- 空状态 -->
            <div v-if="!currentComp" class="empty-tip">暂无选中组件</div>

            <!-- 属性表单 -->
            <div v-else class="attr-form">
             <el-form :model="localAttrs" :rules="rules" ref="formRef">
              <el-form-item class="form-item" v-for="(item, index) in compAttrs" :key="index"  :label="item.label">
                <!-- 确保组件存在才渲染 -->
                <component
               
                  :is="item.component"
                  v-model="localAttrs[item.modelValue]"
                  class="form-editor"
                  v-bind="item.editorProps"
                />
              
              </el-form-item>
              </el-form>
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
import {getFormItemData} from '@/hooks/getFormData'

const  rules =  ref({})
const componentsList= getFormItemData()
console.log(componentsList.value,'components')
/* props */
const props = defineProps({
  visible: { type: Boolean, default: false },
  currentComp: { type: Object, default: null } // 低代码当前组件元信息
})
console.log(props.currentComp,'props.currentComp')
/* emits */
const emit = defineEmits(['handleclose', 'save'])

/* 响应式：拷贝一份属性，避免直接修改元对象 */
const localAttrs = ref({})

/* 处理组件显示效果：返回响应式计算属性，确保数据变化后视图自动更新 */
const compAttrs = computed(() => {
  if (!props.currentComp || !props.currentComp.node?.data?.defaultProps) return []
  // 同步本地属性副本
  localAttrs.value = props.currentComp.node.data.defaultData || {}
  const formDataItemField = props.currentComp.node.data.defaultProps
  console.log(formDataItemField, 'formDataItemField', componentsList.value.get('input'))
  return formDataItemField.map(item => ({
    label: item.name,
    modelValue: item.modelValue, // 这是表单字段的键名
    component: componentsList.value.get(item.type),
    editorProps: {
  
      ...(item.options ? { options: item.options } : {})
    }
  }))
})


console.log(compAttrs.value,'compAttrs.value')
/* 监听：每次打开弹窗时同步最新属性 */
watch(
  () => props.visible,
  val => {
    if (val && props.currentComp) {
      localAttrs.value = { ...props.currentComp.node.data.defaultData }
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
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

/* 弹窗主体 */
.attr-dialog {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: var(--top, 10vh);
  display: flex;
  flex-direction: column;
  width:350px !important;
  height: 700px !important;
  
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
