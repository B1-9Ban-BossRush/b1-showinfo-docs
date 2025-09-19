/**
 * @file generate-list-data.cjs
 * @author DavidingPlus (davidingplus@qq.com)
 * @brief 将榜单单项和总榜的 JSON 数据转化为 MarkDown 文档。
 * @details 函数的执行过程是读取原始 json 数据，然后将其转化为 json2md 需要的格式，然后进行转化，最后输出到 Markdown 文件中，注意输出的是整个文件，包括 h 标题和表格以及其他文字。
 * 
 * Copyright (c) 2025 DavidingPlus
 * 
 */
const fs = require('fs')
const json2md = require('json2md')


/**
 * 转换单项的数据。
 * @param {string} inputJsonPath - 原始 JSON 文件路径。
 */
function convertSingleList(inputJsonPath) {
    // 读取原始 JSON 文件。
    const rawJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'))

    // 生成标题：单项。
    const markdownElements = [
        { h2: '单项' }
    ]

    // 转换每个 section。
    markdownElements.push(rawJson.flatMap(section => {
        // 生成标题，如三虎、四僧等。
        const elements = [
            { h3: section.title }
        ]

        // 生成表格。
        if (section.table && section.table.length > 0) {
            // 给每行加行号。
            const tableRows = section.table.map((entry, index) => ({
                排名: 1 + index,
                ...entry
            }))

            // 获取列名（表头）。
            const columnNames = Object.keys(tableRows[0])

            // 每行的数据数组。
            const tableContent = tableRows.map(row => columnNames.map(col => row[col]))

            elements.push({
                table: {
                    headers: columnNames,
                    rows: tableContent
                }
            })
        }

        return elements
    }))

    return json2md(markdownElements)
}

/**
 * 转换总榜的数据。
 * @param {string} inputJsonPath - 原始 JSON 文件路径。
 */
function convertTotalList(inputJsonPath) {
    const rawJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'))

    // 生成标题：总榜。
    const markdownElements = [
        { h2: '总榜' }
    ]

    // 处理每一行。
    if (rawJson.length > 0) {
        // 获取列名（JSON 对象的字段名）。
        const columnNames = Object.keys(rawJson[0])

        // 每行的数据数组。
        const tableContent = rawJson.map(row => columnNames.map(col => row[col]))

        markdownElements.push({
            table: {
                headers: columnNames,
                rows: tableContent
            }
        })
    }

    return json2md(markdownElements)
}

/**
 * 生成榜单 Markdown 文件。
 * @param {string} singleJsonPath - 单项 JSON 原文件路径。
 * @param {string} totalJsonPath - 总榜 JSON 原文件路径。
 * @param {string} outputMdPath - 输出的 Markdown 文件路径。
 * @param {string} pageHeader - 页面开头显示的标题和说明文字。
 */
function generateRankingList(singleJsonPath, totalJsonPath, outputMdPath, pageHeader = '') {
    let content = pageHeader
    content += convertSingleList(singleJsonPath)
    content += convertTotalList(totalJsonPath)
    fs.writeFileSync(outputMdPath, content, 'utf-8')
}


if (module === require.main) {
    generateRankingList(
        'scripts/old-list-single.json',
        'scripts/old-list-total.json',
        'docs/guide/ranking-list/old-list.md',
        '# 旧榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，由于已停更，仅展示前十名，[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。\n\n'
    )

    generateRankingList(
        'scripts/new-list-single.json',
        'scripts/new-list-total.json',
        'docs/guide/ranking-list/new-list.md',
        '# 新榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，若更新不及时请优先参考[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。\n\n'
    )
}
