//组件的数据结构  id 名称 类型 描述  位置    存储数据   id和其他表示一起关联数据

 interface ComponentData {
  id: string;
  name: string;
  type: string;
  description: string;
  position: {
    x: number;
    y: number;
  };

}

export const componentData: ComponentData[] = [
    {
        id: 'task-custom',
        name: '任务下发',
        type: 'task',
        description: '任务选择',
        position: {
            x: 100,
            y: 100
        },
        
    },
    {
        id: 'path-custom',
        name: '路径选择',
        type: 'path',
        description: '路径选择',
        position: {
            x: 200,
            y: 200
        },
    },
    {
        id: 'light-custom',
        name: '补光灯',
        type: 'light',
        description: '补光灯',
        position: {
            x: 300,
            y: 300
        },
    },
    {
        id: 'arm-custom',
        name: '机械臂',
        type: 'arm',
        description: '机械臂',
        position: {
            x: 300,
            y: 400
        },
    }
]