<template>
  <div class="custom-node" :class="`custom-node-${type}`">
    <!-- 顶部输入连接点 -->
    <Handle
      v-if="showTopHandle"
      type="target"
      :position="Position.Top"
      :id="`top-target-${id}`"
      class="custom-handle top-handle"
    />
    
    <!-- 左侧输入连接点 -->
    <Handle
      v-if="showLeftHandle"
      type="target"
      :position="Position.Left"
      :id="`left-target-${id}`"
      class="custom-handle left-handle"
    />
    
    <div class="node-content">
     
      <div class="node-header">{{ data.title || data.label || data.name}}</div>
      <div class="node-type">{{ data.nodeType }}</div>
      
      <div class="node-content-delete" @click.stop="handleDeleteClick(id)" v-if="type!='custom-input'">
        删除
      </div>

    </div>
    
    <!-- 右侧输出连接点 -->
    <Handle
      v-if="showRightHandle"
      type="source"
      :position="Position.Right"
      :id="`right-source-${id}`"
      class="custom-handle right-handle"
    />
    
    <!-- 底部输出连接点 -->
    <Handle
      v-if="showBottomHandle"
      type="source"
      :position="Position.Bottom"
      :id="`bottom-source-${id}`"
      class="custom-handle bottom-handle"
    />
  </div>
</template>

<script setup lang="ts">

import { Handle, Position, type NodeProps } from '@vue-flow/core'

// 定义组件属性
const props = withDefaults(defineProps<NodeProps & {
  showTopHandle?: boolean
  showLeftHandle?: boolean
  showRightHandle?: boolean
  showBottomHandle?: boolean
}>(), {
  showTopHandle: true,
  showLeftHandle: true,
  showRightHandle: true,
  showBottomHandle: true
})
const handleDeleteClick = ()=>{
 
  if(props.type==='custom-input'){
    return
  }
}
</script>

<style scoped lang="scss">
.custom-node {
 
  border-radius: 8px;
  width: 50px;
  background-color: white;
  border: 2px solid #555;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.node-content {
  text-align: center;
  width: 100%;
  position:relative;
  .node-content-delete{
    position:absolute;
    top:0;
    right:0;
    font-size: 6px;
    color: #999;
    background-color: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
  }
}

.node-header {
  font-size: 10px;
 
  color: #333;
 
}

.node-body {
  font-size: 10px;
  color: #666;

}

.node-type {
  font-size: 6px;
  color: #999;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.custom-handle {
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border: 2px solid white;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.custom-handle:hover {
  width: 10px;
  height: 10px;
  background-color: #2E7D32;
}

/* 不同类型节点的样式 */
.custom-node-input {
  border-color: #2196F3;
  background-color: #E3F2FD;
}

.custom-node-approval {
  border-color: #FF9800;
  background-color: #FFF3E0;
}

.custom-node-output {
  border-color: #F44336;
  background-color: #FFEBEE;
}

.custom-node-condition {
  border-color: #9C27B0;
  background-color: #F3E5F5;
  clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
}
</style>