/**
 * @file generate-list-data.js
 * @author DavidingPlus (davidingplus@qq.com)
 * @brief 生成榜单页面的主程序入口文件。
 * 
 * Copyright (c) 2025 DavidingPlus
 * 
 */
import { generateJsonSingle, generateJsonTotal, generateRankingList } from "./util.js"
import fs from 'fs'


console.log("now running command: npm/pnpm run " + process.env.npm_lifecycle_event)
if ("dev" === process.env.npm_lifecycle_event || "generate-list" === process.env.npm_lifecycle_event) {
    const filePath = 'data/黑猴九禁速通榜(新).xlsx'
    const stats = fs.statSync(filePath)
    const lastUpdatedTime = stats.mtime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

    fs.writeFileSync('data/last-updated-time', `${lastUpdatedTime}`, 'utf-8')

    fs.writeFileSync("data/new-list-single.json", JSON.stringify(generateJsonSingle("data/黑猴九禁速通榜(新).xlsx", 1), null, 4), "utf-8")

    fs.writeFileSync("data/new-list-total.json", JSON.stringify(generateJsonTotal("data/黑猴九禁速通榜(新).xlsx", 2), null, 4), "utf-8")
}


const lastUpdatedTime = fs.readFileSync('data/last-updated-time', 'utf-8').trim()

generateRankingList(
    'data/new-list-single.json',
    'data/new-list-total.json',
    'docs/ranking-list/new-list.md',
    `# 新榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容。若更新不及时请优先参考[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。\n\n> 榜单最后更新于：${lastUpdatedTime}\n\n`
)

generateRankingList(
    'data/old-list-single.json',
    'data/old-list-total.json',
    'docs/ranking-list/old-list.md',
    '# 旧榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容。由于已停更，仅展示前十名，[原文档](https://docs.qq.com/sheet/DTXNnc09DRGZWVGxt)。\n\n'
)
