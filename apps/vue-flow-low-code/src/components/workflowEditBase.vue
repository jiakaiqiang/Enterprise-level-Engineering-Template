<template>
  <div class="workflow-container" style="height: 80vh; width: 100%; display: flex;">
    <aside class="sidebar" style="width: 200px; border-right: 1px solid #ccc; padding: 10px;">
      <div class="description">拖拽节点到画布</div>
      <div class="nodes">
        <div class="custom-node-item" v-for="item in componentData" :key="item.type" @dragstart="onDragStart($event, item)" draggable="true">
          <div class="node-preview input-preview">{{item.name}}</div>
       
        </div>
        <!-- <div class="custom-node-item" @dragstart="onDragStart($event, 'custom-approval')" draggable="true">
          <div class="node-preview approval-preview">审批节点</div>
       
        </div>
        <div class="custom-node-item" @dragstart="onDragStart($event, 'custom-condition')" draggable="true">
          <div class="node-preview condition-preview">条件节点</div>
          
        </div>
        <div class="custom-node-item" @dragstart="onDragStart($event, 'custom-output')" draggable="true">
          <div class="node-preview output-preview">结束节点</div>
       
        </div> -->
      </div>
    </aside>

    <div class="main-canvas" style="flex-grow: 1;">
      <optionButtonList @handleClick="handleOptionClick" />
      <VueFlow
        :nodes="elements"
        @dragover="onDragOver"
        @drop="onDrop"
        @node-click="onNodeClick"
       :fit-view-on-init="true"
        :edges="edges"
        @edge-click="onEdgeClick"
        @connect="onConnect"
        @edge-connect="onEdgeConnect"
        :connection-mode="ConnectionMode.Strict"
      >
      <!-- :connection-mode="ConnectionMode.Strict" 设置成严格模式，只能从输出连接点连接到输入连接点 -->
        <!-- 注册自定义节点 -->
        <template #node-custom-input="nodeProps">
          <CustomNode
            v-bind="nodeProps"
            :show-top-handle="false"
            :show-left-handle="false"
            :show-right-handle="true"
            :show-bottom-handle="false"
          />
        </template>
        
        <template #node-custom-approval="nodeProps">
           
          <CustomNode
            v-bind="nodeProps"
            :show-top-handle="false"
            :show-left-handle="true"
            :show-right-handle="true"
            :show-bottom-handle="false"
          />
        </template>
        
       
        
        <template #node-custom-output="nodeProps">
          <CustomNode
            v-bind="nodeProps"
            :show-top-handle="false"
            :show-left-handle="true"
            :show-right-handle="false"
            :show-bottom-handle="false"
          />
        </template>
        
        <Background />
      
      </VueFlow>
    </div>
    <!-- 添加右侧抽屉 -->
    <paramComponent
     v-if=paramDrawerVisible
      ref="paramDrawer"
      :visible="paramDrawerVisible"
      :current-comp="currentComp"
      @handleclose="paramDrawerVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow, Node, Edge, Connection,ConnectionMode } from '@vue-flow/core'
//ConnectionMode 设置成
import { Background } from '@vue-flow/background'
import optionButtonList from './optionButtonList.vue'
import { Controls } from '@vue-flow/controls'
import CustomNode from './CustomNode.vue'
import {componentData} from './data/componentData.ts'
import itemData from './data/schma.json'
import paramComponent from './paramComponent.vue'
let  paramDrawerVisible =  ref(false)
let currentComp = ref(null)
// 导入样式
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const { addNodes, project } = useVueFlow()

// 初始化数据
const elements = ref<Node[]>([
  {
    id: 'start-1',
    type: 'custom-input',
    position: { x: 400, y: 50 },
    data: {
      title: '开始节点',
      description: '流程起点',
      nodeType: '开始'
    }
  }
])
const handleOptionClick = (event: string) => {
    if(event=='save'){
      console.log('保存')
      // 保存流程
      const workflow = {
        nodes: elements.value,
        edges: edges.value
      }
      console.log(workflow,'workflow')
    }
    if(event=='back'){
      console.log('回退')
    }
}
// 处理节点点击事件
const onNodeClick = (node:any) => {
    
     if(node.node.data.type=='custom-input'){
      return 
     }
   // 点击的时候显示对应匹配的属性值 

   paramDrawerVisible.value = true
   currentComp.value = node
}

// 定义边
const edges = ref<Edge[]>([])


// 处理边连接事件
const onEdgeConnect = (params) => {
  console.log('边已连接:', params)
  // params包含source、target、sourceHandle、targetHandle等信息
}

// 处理连接事件（与edge-connect类似，但包含更多上下文）
const onConnect = (connection) => {
  console.log('连接创建:', connection)
  // 可以在这里自定义边的属性
  const newEdge = {
    ...connection,
    id: `${connection.source}->${connection.target}`,
    animated: true
  }
  edges.value.push(newEdge)
}

// 处理边更新事件
const onEdgeUpdate = (params) => {
  console.log('边已更新:', params)
}

// 处理边断开事件
const onDisconnect = (edge) => {
  console.log('边已断开:', edge)
  // 从edges数组中移除断开的边
  edges.value = edges.value.filter(e => e.id !== edge.id)
}

// 处理边点击事件
const onEdgeClick = (edge) => {
  console.log('边被点击:', edge)
  
  // 确认删除边
  if (confirm('是否删除这条连接线？')) {
    // 从edges数组中移除点击的边
    edges.value = edges.value.filter(e => e.id !== edge.id)
  }
}
// 拖拽处理
const onDragStart = (event, item) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vue-flow', JSON.stringify(item))
    event.dataTransfer.effectAllowed = 'move'
  }
}

const onDragOver = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent) => {
  const itemStr = event.dataTransfer?.getData('application/vue-flow')
  const item = JSON.parse(itemStr)

  //获取对应的节点数据
 const currentNodeData =  itemData[item.id]

console.log(currentNodeData,'currentNodeData')

  const type=`custom-${currentNodeData.type}`

  const { left, top } = event.currentTarget.getBoundingClientRect()
  console.log(item,'wefwefwfwfwf')
  // 将屏幕坐标转换为画布坐标
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })

  const nodeId = `${type}-${Date.now()}`
  const nodeTypeLabel = type.replace('custom-', '')
  
  // 根据不同节点类型创建不同的数据
  const newNode: Node = {
    id: nodeId,
    type,
    position,
    data: {
      title: `${currentNodeData.name}`,
      description: ``,
      nodeType: currentNodeData.type,
      ...JSON.parse(JSON.stringify(currentNodeData))
    }
  }
  console.log(newNode)
  

  addNodes([newNode])
}
</script>

<style scoped>
.sidebar {
  background-color: #f5f5f5;
  height: 100%;
}

.description {
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.custom-node-item {
  margin-bottom: 20px;
  cursor: grab;
  user-select: none;
}

.custom-node-item:active {
  cursor: grabbing;
}

.node-preview {
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-preview {
  background-color: #E3F2FD;
  border-left: 4px solid #2196F3;
}

.approval-preview {
  background-color: #FFF3E0;
  border-left: 4px solid #FF9800;
}

.condition-preview {
  background-color: #F3E5F5;
  border-left: 4px solid #9C27B0;
  clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
}

.output-preview {
  background-color: #FFEBEE;
  border-left: 4px solid #F44336;
}

.node-info {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 5px;
  padding: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
}

/* 覆盖默认样式 */
.vue-flow__node {
  z-index: 2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vue-flow__node:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.vue-flow__handle {
  z-index: 3;
}

/* 边的样式 */
.vue-flow__edge-path {
  stroke-width: 2;
  stroke: #555;
  fill: none;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #ff4757;
  stroke-width: 3;
}

/* 边的悬停效果 */
.vue-flow__edge:hover .vue-flow__edge-path {
  stroke: #ff4757;
  stroke-dasharray: 5, 5;
  cursor: pointer;
}

/* 边的删除线效果 */
.vue-flow__edge-path.delete-mode {
  stroke-dasharray: 5, 5;
  stroke: #ff4757;
  stroke-width: 3;
}
</style>