<template>
    <div>
        <el-button v-for="item in optionButtonList" :key="item.event" :type="item.type" :size="item.size" @click="handleClick(item.event)">{{ item.name }}</el-button>
    </div>
</template>
<script setup lang="ts">
let  emits =  defineEmits(['handleClick'])
import { optionButtonList } from '@/components/data/componentData'
const handleClick = (event: string) => {
    emits('handleClick', event)
}
</script>
