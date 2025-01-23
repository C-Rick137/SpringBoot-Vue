<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12" style="margin-bottom: 10px">
        <div id="bar" class="card" style="padding: 20px;height: 400px"></div>
      </el-col>
      <el-col :span="12" style="margin-bottom: 10px">
        <div id="line" class="card" style="padding: 20px;height: 400px"></div>
      </el-col>
      <el-col :span="12" style="margin-bottom: 10px">
        <div id="pie" class="card" style="padding: 20px;height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, reactive} from 'vue'
import *as echarts from 'echarts'
import request from "@/utils/request.js";

const data = reactive({})

const barOption = {
  title: {
    text: '各部门员工数量',
    left: 'center',
    textStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'top'
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    type: 'bar',
    data: [],
    itemStyle: {
      normal: {
        color: function (params) {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
          return colors[params.dataIndex % colors.length];
        }
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    label: {
      show: true,
      position: 'top'
    }
  }],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  }
};
const lineOption = {
  title: {
    text: '近7天发布文章数量',
    left: 'left',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  legend: {
    data: ['发布数量'],
    left: 'right',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
    nameLocation: 'middle',
  },
  series: [{
    name: '发布数量',
    type: 'line',
    data: [],
    smooth: true,
    lineStyle: {
      color: '#5470C6',
      width: 2,
    },
    areaStyle: {
      color: 'rgba(84, 112, 198, 0.2)',
    },
  }],
};

const pieOption = {
  title: {
    text: '各部门员工数量比例图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: '员工数量',
    type: 'pie',
    radius: '50%',
    data: [],
    label: {
      formatter: '{b}: {@2012}人 ({d}%)',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}
onMounted(() => {
  const barChart = echarts.init(document.getElementById('bar'))
  request.get('/barData').then(res => {
    barOption.xAxis.data = res.data.department
    barOption.series[0].data = res.data.count
    barChart.setOption(barOption)
  })
  const lineChart = echarts.init(document.getElementById('line'))
  request.get('/lineData').then(res => {
    lineOption.xAxis.data = res.data.date
    lineOption.series[0].data = res.data.count
    lineChart.setOption(lineOption)
  })
  const pieChart = echarts.init(document.getElementById('pie'))
  request.get('/pieData').then(res => {
    pieOption.series[0].data = res.data
    pieChart.setOption(pieOption)
  })
})
</script>

<style scoped>

</style>