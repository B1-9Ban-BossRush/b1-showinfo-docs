/**
 * @file generate-list-data.js
 * @author DavidingPlus (davidingplus@qq.com)
 * @brief 生成榜单页面的主程序入口文件。
 * 
 * Copyright (c) 2025 DavidingPlus
 * 
 */
import { generateRankingList } from "./util.js"


generateRankingList(
    'data/new-list-single.json',
    'data/new-list-total.json',
    'docs/guide/ranking-list/new-list.md',
    '# 新榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，若更新不及时请优先参考[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。\n\n'
)

generateRankingList(
    'data/old-list-single.json',
    'data/old-list-total.json',
    'docs/guide/ranking-list/old-list.md',
    '# 旧榜单\n\n本页面展示的榜单完全来源于原腾讯文档中的内容，由于已停更，仅展示前十名，[原文档](https://docs.qq.com/sheet/DTUhETnNCQ0RoRm9v)。\n\n'
)
