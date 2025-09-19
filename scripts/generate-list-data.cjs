const fs = require('fs')
const json2md = require('json2md')


/**
 * 将 JSON 文件数据（包括表格和标题）转换成 Markdown 格式并写入到指定文件。
 * @param {string} inputJsonPath - 原始 JSON 文件路径。
 * @param {string} outputMdPath - 输出的 Markdown 文件路径。
 * @param {string} pageHeader - 页面开头显示的标题和说明文字。
 */
function generateMarkdownFromJson(inputJsonPath, outputMdPath, pageHeader = '') {
    // 读取原始 JSON 文件。
    const rawJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'))

    // 转换每张表。
    const mdElements = rawJson.flatMap(section => {
        if (!section.data || section.data.length === 0) return []

        // 给每行加行号。
        const tableRows = section.data.map((entry, index) => ({
            排名: 1 + index,
            ...entry
        }))

        // 获取列名（表头）。
        const columnNames = Object.keys(tableRows[0])

        // 每行的数据数组。
        const tableContent = tableRows.map(row => columnNames.map(col => row[col]))

        return [
            // 表格标题。
            { h2: section.title },
            // 表格内容。         
            { table: { headers: columnNames, rows: tableContent } }
        ]
    })

    // 生成 Markdown 文本。
    const outputMdText = `${pageHeader}\n\n` + json2md(mdElements)

    // 写入文件。
    fs.writeFileSync(outputMdPath, outputMdText, 'utf-8')
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
