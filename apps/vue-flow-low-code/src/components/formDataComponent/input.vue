<template>
    <div class="form-data-input">
        <el-input v-model="localValue" :placeholder="placeholder" />
    </div>
</template>
<script setup lang="ts">
// 使用 defineModel 实现双向绑定
const localValue = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  placeholder: { type: String, default: '' }
})
</script>