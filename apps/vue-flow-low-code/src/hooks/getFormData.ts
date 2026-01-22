import { ref } from 'vue'

export const getFormItemData = () => {
  // 获取所有formItemData文件夹下的所有文件
  const formItemDataFiles = import.meta.glob('../components/formDataComponent/*.vue')
  // 使用ref创建响应式Map
  const componentMap = ref(new Map())
  
  // 加载所有组件
  const loadComponents = async () => {
    for (const path in formItemDataFiles) {
      try {
        const mod = await formItemDataFiles[path]()
        // 通过地址获取文件的名称
        const fileName = path.split('/').pop()?.replace('.vue', '') ?? ''
        componentMap.value.set(fileName, mod.default)
        console.log(`Loaded component: ${fileName}`)
      } catch (error) {
        console.error(`Failed to load component ${path}:`, error)
      }
    }
  }
  
  // 立即加载组件
  loadComponents()
  
  // 返回响应式的Map
  return componentMap
}
