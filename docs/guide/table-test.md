# 表格测试

## MarkDown 原生表格

| Markdown                                                | 输出的 HTML                               | 被解析的标题 |
| ------------------------------------------------------- | ----------------------------------------- | ------------- |
| <pre v-pre><code> # text &lt;Tag/&gt; </code></pre>     | `<h1>text <Tag/></h1>`                    | `text`        |
| <pre v-pre><code> # text \`&lt;Tag/&gt;\` </code></pre> | `<h1>text <code>&lt;Tag/&gt;</code></h1>` | `text <Tag/>` |

## element-plus 表格组件

<script setup>
import TableTest from './TableTest.vue'
</script>

<TableTest />

