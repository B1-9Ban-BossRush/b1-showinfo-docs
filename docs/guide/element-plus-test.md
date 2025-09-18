# Element Plus 测试

## 按钮

<el-button type="primary">主要按钮</el-button>

<el-button type="success">成功按钮</el-button>

## 表格

<el-table :data="[{date:'2025-09-18', name:'张三', address:'上海'}]" border>
  <el-table-column prop="date" label="日期" />
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="address" label="地址" />
</el-table>

