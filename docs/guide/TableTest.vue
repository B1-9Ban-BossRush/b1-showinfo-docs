<script setup>
import { ref } from 'vue'

const tableData = ref([
    { date: '2025-09-18', name: '张三', address: '上海' },
    { date: '2025-09-19', name: '李四', address: '北京' }
])
</script>

<template>
    <div>
        <h2>表格（Vue 组件）</h2>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="日期" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="address" label="地址" />
        </el-table>
    </div>
</template>
