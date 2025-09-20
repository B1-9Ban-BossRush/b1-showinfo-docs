/**
 * @file util.js
 * @author DavidingPlus (davidingplus@qq.com)
 * @brief 将榜单单项和总榜的 JSON 数据转化为 MarkDown 文档。
 * @details 整个执行流程是读取原始 json 数据，然后将成绩转化为 parse-duration 需要的格式，对成绩进行排序，将其转化为 json2md 需要的格式，进行转化，最后输出到 Markdown 文件中。注意输出的是整个文件，包括 h 标题和表格以及其他文字。
 * 
 * Copyright (c) 2025 DavidingPlus
 * 
 */
import fs from 'fs'
import json2md from 'json2md'
import parse from "parse-duration"


/**
 * 将竞速成绩规范化为 parse-duration 可识别的格式。
 * 给几个例子：
 * 51''45 -> 51.45s
 * 1'17''75 -> 1m17.75s
 * 1'29'' -> 1m29s
 * 3'16''? -> 3m16s
 * @param {string} timeStr - 输入时间字符串。
 * @returns {string}
 */
export function normalizeTime(timeStr) {
    timeStr = String(timeStr).trim()

    // 去掉末尾可能的 ? 号（毫秒位不知道成绩的情况，默认视为 0。
    if (timeStr.endsWith('?')) {
        timeStr = timeStr.slice(0, -1)
    }

    // 处理类似 51''45 格式的成绩。
    let match = timeStr.match(/^(\d+)''(\d+)$/)
    if (match) {
        const [, s, cs] = match
        return `${s}.${cs}s`
    }

    // 处理类似 1'17''75 格式的成绩。
    match = timeStr.match(/^(\d+)'(\d+)''(\d+)$/)
    if (match) {
        const [, m, s, cs] = match
        return `${m}m${s}.${cs}s`
    }

    // 处理类似 1'29'' 或者去掉 ? 的 3'16'' 格式的成绩。
    match = timeStr.match(/^(\d+)'(\d+)''$/)
    if (match) {
        const [, m, s] = match
        return `${m}m${s}s`
    }


    // 匹配不到，返回原串。（目前给的数据走不到这个分支）
    return timeStr
}

/**
 * 转换单项的数据，按成绩进行排序。
 * @param {string} inputJsonPath - 原始 JSON 文件路径。
 * @returns {string}
 */
export function convertSingleList(inputJsonPath) {
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
            // 按成绩排序，快的在前。
            const sortedTable = [...section.table].sort((a, b) => {
                return parse(normalizeTime(a['成绩'])) - parse(normalizeTime(b['成绩']))
            })

            // 给每行加行号
            const tableRows = sortedTable.map((entry, index) => ({
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
 * 转换总榜的数据，按总成绩排序。
 * @param {string} inputJsonPath - 原始 JSON 文件路径。
 * @returns {string}
 */
export function convertTotalList(inputJsonPath) {
    const rawJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf-8'))

    // 生成标题：总榜。
    const markdownElements = [
        { h2: '总榜' }
    ]

    // 处理每一行。
    if (rawJson.length > 0) {
        // 按照“总成绩”进行排序。
        const sortedTable = [...rawJson].sort((a, b) => {
            return parse(normalizeTime(a['总成绩'])) - parse(normalizeTime(b['总成绩']))
        })

        // 获取列名（JSON 对象的字段名）。
        const columnNames = Object.keys(sortedTable[0])

        // 每行的数据数组。
        const tableContent = sortedTable.map(row => columnNames.map(col => row[col]))

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
export function generateRankingList(singleJsonPath, totalJsonPath, outputMdPath, pageHeader = '') {
    let content = pageHeader
    content += convertSingleList(singleJsonPath)
    content += convertTotalList(totalJsonPath)
    fs.writeFileSync(outputMdPath, content, 'utf-8')
}
