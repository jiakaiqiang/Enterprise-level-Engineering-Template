<template>
  <div id="main-app">
    <!-- 主应用导航 -->
    <div class="main-nav">
      <router-link to="/">首页</router-link>
      <router-link to="/sub-frondSystem">Vue子应用</router-link>
     
    </div>
    
    <!-- 主应用路由区域 -->
    <div v-if="!isMicroAppRoute">
      <router-view />
    </div>
    
    <!-- 子应用挂载容器 -->
    <div  id="subapp-viewport"></div>

  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMicroAppRoute = computed(() => {
  // 判断当前路由是否为微应用路由
  return route.path.startsWith('/sub-') 
})
</script>

<style scoped>
#main-app {
  font-family: Arial, sans-serif;
}

.main-nav {
  padding: 20px;
  background: #f0f0f0;
  margin-bottom: 20px;
}

.main-nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
}

.main-nav a:hover {
  color: #1890ff;
}
</style>