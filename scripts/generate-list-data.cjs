const fs = require('fs')
const json2md = require('json2md')

const originTableJson = JSON.parse(fs.readFileSync('scripts/old-list.json', 'utf-8'))

const tableJson = originTableJson.flatMap(table => {
    if (!table.data || 0 === table.data.length) return []

    // 生成带行号的数据。
    const numberedData = table.data.map((item, idx) => ({ 序号: idx + 1, ...item }))
    // 表头包括序号。
    const headers = Object.keys(numberedData[0])
    // 转成二维数组。
    const rows = numberedData.map(item => headers.map(h => item[h]))


    return [
        { h2: table.title },
        { table: { headers, rows } }
    ]
})

const tableMd = '# 旧榜单\n\n' + json2md(tableJson)
console.log(tableMd)

fs.writeFileSync('docs/guide/table-test.md', tableMd, 'utf-8')
