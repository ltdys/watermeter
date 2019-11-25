export const menu_list = {
  data () {
    return {
      menus: [{
          id: "1",
          name: "帐户管理",
          icon: "el-icon-s-platform",
          url: "system-manage",
          level: 1,
          pids: [],
          children: [
            {
              id: "1-1",
              name: "权限管理",
              icon: "el-icon-lock",
              url: "/system-manage/jurisdiction",
              level: 1
            },
            {
              id: "1-2",
              name: "角色管理",
              icon: "el-icon-postcard",
              url: "/system-manage/role-manage",
              level: 1
            }, {
              id: "1-3",
              name: "用户管理",
              icon: "el-icon-user",
              url: "/system-manage/user-manage",
              level: 1
            },{
              id: "1-4",
              name: "组织管理",
              icon: "el-icon-reading",
              url: "/system-manage/resource-manage",
              level: 1
            }
          ]
        }, {
          id: "2",
          name: "设备管理",
          icon: "el-icon-s-platform",
          url: "222",
          level: 2,
          pids: [],
          children: [
            {
              id: "2-1",
              name: "集中器",
              icon: "el-icon-lock",
              url: "/2-1",
              level: 2
            }, {
              id: "2-2",
              name: "采集器",
              icon: "el-icon-lock",
              url: "/2-2",
              level: 2
            }, {
              id: "2-3",
              name: "设备参数",
              icon: "el-icon-lock",
              url: "/2-3",
              level: 2
            }, {
              id: "2-4",
              name: "设备故障",
              icon: "el-icon-lock",
              url: "/2-4",
              level: 2
            }
          ]
        }, {
          id: "3",
          name: "抄表管理",
          icon: "el-icon-s-platform",
          url: "333",
          level: 3,
          pids: [],
          children: [
            {
              id: "3-1",
              name: "档案管理",
              icon: "el-icon-lock",
              url: "/3-1",
              level: 3
            }, {
              id: "3-2",
              name: "换表信息管理",
              icon: "el-icon-lock",
              url: "/3-2",
              level: 3
            }, {
              id: "3-3",
              name: "户表批量导入",
              icon: "el-icon-lock",
              url: "/3-3",
              level: 3
            }, {
              id: "3-4",
              name: "户表批量删除",
              icon: "el-icon-lock",
              url: "/3-4",
              level: 3
            }
          ]
        }, {
          id: "4",
          name: "数据分析",
          icon: "el-icon-s-platform",
          url: "444",
          level: 4,
          pids: [],
          children: [
            {
              id: "4-1",
              name: "抄表分析曲线",
              icon: "el-icon-lock",
              url: "/4-1",
              level: 4
            }, {
              id: "4-2",
              name: "电池电压曲线",
              icon: "el-icon-lock",
              url: "/4-2",
              level: 4
            }, {
              id: "4-3",
              name: "大表流量曲线",
              icon: "el-icon-lock",
              url: "/4-3",
              level: 4
            }, {
              id: "4-4",
              name: "设备故障统计",
              icon: "el-icon-lock",
              url: "/4-4",
              level: 4
            }
          ]
        }
      ]
    }
  }
}
