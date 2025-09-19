const fs = require('fs')
const json2md = require('json2md')


/**
 * 转换 Table 表格数据。将 JSON 表格数据转换成 Markdown 格式的数据并写入到指定文件中。
 * @param {string} inputJsonPath - 原始 JSON 文件路径,
 * @param {string} outputMdPath - 输出的 Markdown 文件路径,
 * @param {string} headerText - 页面开头显示的标题和说明文字,
 */
function generateMarkdownFromJson(inputJsonPath, outputMdPath, headerText = '') {
    // 读取原始 JSON 文件。
    const originJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'))

    // 转换每张表。
    const tableJson = originJson.flatMap(table => {
        if (!table.data || table.data.length === 0) return []

        // 给每行加行号。
        const numberedData = table.data.map((item, idx) => ({ 排名: idx + 1, ...item }))

        // 表头和行数据。
        const headers = Object.keys(numberedData[0])
        const rows = numberedData.map(item => headers.map(h => item[h]))

        return [
            { h2: table.title },
            { table: { headers, rows } }
        ]
    })

    // 生成 Markdown。
    const outputMd = `${headerText}\n\n` + json2md(tableJson)

    // 写入文件。
    fs.writeFileSync(outputMdPath, outputMd, 'utf-8')
}


if (module === require.main) {
    generateMarkdownFromJson(
        'scripts/old-list.json',
        'docs/guide/ranking-list/old-list.md',
        '# 旧榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，若更新不及时请优先参考[原文档](https://docs.qq.com/sheet/DTXNnc09DRGZWVGxt)。'
    )

    generateMarkdownFromJson(
        'scripts/new-list.json',
        'docs/guide/ranking-list/new-list.md',
        '# 新榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，若更新不及时请优先参考[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。'
    )
}
