<template>
  <el-select v-model="value" placeholder="请选择">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">

const value  =  defineModel({
    type: String,
    default: ''
})
const props = defineProps({
 
  options: { type: Array, default: () => [] }
})
console.log(props.options,'props.options')
</script>
