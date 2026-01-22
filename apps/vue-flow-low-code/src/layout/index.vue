<template>
  <!-- 通用路由模板：外壳不变，仅内部内容随路由变化 -->
  <div class="layout-wrapper">
    <!-- 顶部导航（固定） -->
    <header class="layout-header">
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/item">插件管理</router-link>
    
      </nav>
    </header>

    

    <!-- 主内容区：路由变化仅替换这里 -->
    <main class="layout-main">
      <router-view />
    </main>

    
  </div>
</template>

<script setup>
// 无需额外逻辑，模板已满足“外壳不变，内容随路由变化”
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;

}
.layout-header,
.layout-footer {
  background: #f5f5f5;
  padding: 12px 24px;
}
.layout-sidebar {
  width: 200px;
  background: #fafafa;
  padding: 16px;
}
.layout-main {
  flex: 1;
  padding: 24px;
}
</style>
