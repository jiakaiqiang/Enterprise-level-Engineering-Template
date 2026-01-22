<template>
    <div class="form-data-input">
        <el-input v-model="localValue" type="textarea" :placeholder="placeholder" />
    </div>
</template>
<script setup lang="ts">
// 使用正确的 defineModel 语法
const localValue = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  placeholder: { type: String, default: '' }
})
</script>