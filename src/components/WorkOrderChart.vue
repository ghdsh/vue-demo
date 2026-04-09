<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { WorkOrder } from '../types/workOrder'
import { useThemeStore } from '../stores/theme'

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{ workOrders: WorkOrder[] }>()
const theme = useThemeStore()
const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildOption(orders: WorkOrder[]) {
  const axisColor   = cssVar('--chart-axis')
  const gridColor   = cssVar('--chart-grid')
  const axisLine    = cssVar('--chart-axisline')
  const barColor    = cssVar('--chart-bar')
  const overtimeClr = cssVar('--overtime')
  const tooltipBg   = cssVar('--chart-tooltip-bg')
  const tooltipBdr  = cssVar('--chart-tooltip-border')
  const tooltipTxt  = cssVar('--chart-tooltip-text')

  const labels = orders.map(o => o.id)

  // Two parallel series: one for overtime=false (No), one for overtime=true (Yes)
  // Each bar slot shows only the relevant series value, the other is 0 (stack sum = hours)
  const noData  = orders.map(o => o.overtime ? 0 : o.hours)
  const yesData = orders.map(o => o.overtime ? o.hours : 0)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: tooltipBg,
      borderColor: tooltipBdr,
      textStyle: { color: tooltipTxt, fontSize: 12 },
      formatter(params: { dataIndex: number; value: number; seriesName: string }[]) {
        const idx = params[0]?.dataIndex ?? 0
        const order = orders[idx]
        if (!order) return ''
        const overtime = order.overtime ? '<b style="color:' + overtimeClr + '">Yes</b>' : '<b>No</b>'
        return `#${order.id} ${order.project}<br/>工时：<b>${order.hours} h</b><br/>加班：${overtime}`
      },
    },
    legend: {
      data: ['No', 'Yes'],
      bottom: 0,
      textStyle: { color: axisColor, fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: { left: 8, right: 8, bottom: 36, top: 12, containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { fontSize: 10, color: axisColor, interval: 0, rotate: labels.length > 12 ? 45 : 0 },
      axisLine: { lineStyle: { color: axisLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: 'h',
      nameTextStyle: { color: axisColor, fontSize: 11 },
      axisLabel: { color: axisColor, fontSize: 11 },
      splitLine: { lineStyle: { color: gridColor } },
    },
    series: [
      {
        name: 'No',
        type: 'bar',
        stack: 'hours',
        data: noData,
        itemStyle: { color: barColor, borderRadius: [0, 0, 0, 0] },
        barMaxWidth: 32,
        emphasis: { itemStyle: { opacity: 0.8 } },
      },
      {
        name: 'Yes',
        type: 'bar',
        stack: 'hours',
        data: yesData,
        itemStyle: { color: overtimeClr, borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 32,
        emphasis: { itemStyle: { opacity: 0.8 } },
      },
    ],
  }
}

onMounted(() => {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  chart.setOption(buildOption(props.workOrders))

  const ro = new ResizeObserver(() => chart?.resize())
  ro.observe(chartEl.value)
  onUnmounted(() => {
    ro.disconnect()
    chart?.dispose()
  })
})

watch(() => props.workOrders, orders => {
  chart?.setOption(buildOption(orders), { replaceMerge: ['series'] })
}, { deep: true })

watch(() => theme.isDark, () => {
  setTimeout(() => chart?.setOption(buildOption(props.workOrders), { replaceMerge: ['series'] }), 0)
})
</script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <h2 class="chart-title">工时分布</h2>
      <div class="chart-legend">
        <span class="legend-dot" style="background:var(--chart-bar)"></span>正常 (No)
        <span class="legend-dot overtime"></span>加班 (Yes)
      </div>
    </div>
    <div ref="chartEl" class="chart-body"></div>
  </div>
</template>

<style lang="scss" scoped>
.chart-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  padding: 16px 16px 12px;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.374px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.overtime {
    background: var(--overtime);
    margin-left: 8px;
  }
}

.chart-body {
  width: 100%;
  height: 300px;
}
</style>
