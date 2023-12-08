<template>
  <section>
    <el-dialog title="树形结构" :visible.sync="dialogVisible" :close-on-click-modal="false" top="5vh" width="90%">
      <div style="height: calc(100vh - 160px); overflow-y: auto;" v-if="dialogVisible">
        <div id="chart"></div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import * as echarts from 'echarts'
import { getTree } from '@/api/member'
export default {
  data() {
    return {
      dialogVisible: false,
      id: 0,
      option: {
        series: [
          {
            type: 'tree',
            top: 60,
            left: 10,
            right: 10,
            // 开启缩放和平移
            roam: false,
            // 树图布局
            layout: 'orthogonal',
            // 从右到左 LR, RL, TB, BT
            orient: 'TB',
            // 定义图片
            symbol: 'circle',
            symbolSize: 75,
            // symbolOffset: [0,-30],
            // 展开的节点 -1，null 或者 undefined 表示所有节点都展开
            initialTreeDepth: -1,
            // 开启折叠节点
            expandAndCollapse: true,
            label: {
              show: true,
              offset: [0, 0],
              align: 'center',
              color: '#FFFFFF',
              lineHeight: 12,
              fontSize: 9,
              formatter: (params) => {
                return params.name.replaceAll('|', '\n')
              }
            },
            lineStyle: {
              // 连接线的弧度
              curveness: 0,
              // 线的粗细
              height: 1,
              // 虚线
              type: 'solid'
            },
            itemStyle: { color: '#000000' },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      this.$emit('db-click')
      this.dialogVisible = false
    },
    // 接受父事件
    handleEchartTree(row) {
      this.id = row.id
      this.dialogVisible = true
      getTree({ id: this.id }).then(res => {
        if (res.code === 0) {
          this.option.series[0].data = res.data
          this.drawTree()
        }
      }).catch(() => {})
    },
    drawTree() {
      const canvas = document.getElementById('chart')
      if (this.option.series[0].data[0]) {
        if (this.option.series[0].data[0].deep <= 3) {
          this.option.series[0].data[0].deep += 1.5
        }
        canvas.style.width = 110 * this.option.series[0].data[0].widthNum + 'px'
        canvas.style.height = 90 * this.option.series[0].data[0].deep + 'px'
      } else {
        canvas.style.width = '100%'
        canvas.style.height = '90%'
      }

      const myChart = echarts.init(canvas)
      myChart.setOption(this.option)
    }
  }
}
</script>
<style>
  .el-dialog__body{
    padding: 20px 20px;
  }
</style>
