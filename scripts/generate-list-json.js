import XLSX from "xlsx";
import fs from "fs";


const workbook = XLSX.readFile("./data/黑猴九禁速通榜(新).xlsx");
const sheetName = workbook.SheetNames[2];
const sheet = workbook.Sheets[sheetName];

// 解析范围。
const range = XLSX.utils.decode_range(sheet["!ref"]);

// 提取表头。
const headers = [];
for (let c = range.s.c; c <= range.e.c; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c });
    const cell = sheet[cellAddress];
    if (cell && cell.v) headers.push({ name: cell.v, col: c }); // 只保留有标题的列
}

// 逐行读取数据。
const result = [];
for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const rowObj = {};
    let hasName = false;

    for (const { name: header, col: c } of headers) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = sheet[cellAddress];

        if ("选手" === header) {
            if (!cell || !cell.v) break; // 选手为空直接跳过整行
            hasName = true;
            rowObj["选手"] = cell.v;
            continue;
        }

        if ("总成绩" === header) {
            if (cell && cell.v) {
                rowObj[header] = cell.v;
            } else {
                rowObj[header] = [];
            }
            continue;
        }

        if (cell && cell.v) {
            if (cell.l && cell.l.Target) {
                rowObj[header] = [cell.v, cell.l.Target]; // 有链接加上链接。
            } else {
                rowObj[header] = [cell.v]; // 没有链接直接存成绩即可。
            }
        } else {
            rowObj[header] = []; // 没成绩的保留空数组。
        }
    }

    if (hasName) result.push(rowObj); // 只保留有姓名的行。
}


fs.writeFileSync("data/new-list-total.json", JSON.stringify(result, null, 4), "utf-8");


export function parseSingleList(filePath, sheetIndex = 0) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[sheetIndex];
    const sheet = workbook.Sheets[sheetName];

    const range = XLSX.utils.decode_range(sheet["!ref"]);

    const titles = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r: range.s.r, c })];
        if (cell && cell.v && String(cell.v).trim()) {
            titles.push({ title: String(cell.v).trim(), startCol: c });
        }
    }

    const battles = [];

    for (const { title, startCol } of titles) {
        if (title === "备注" || title === "总次数") continue;

        const arr = [];

        for (let r = 2; r <= range.e.r; r++) {
            const nameCell = sheet[XLSX.utils.encode_cell({ r, c: startCol })];
            const scoreCell = sheet[XLSX.utils.encode_cell({ r, c: startCol + 1 })];
            const dateCell = sheet[XLSX.utils.encode_cell({ r, c: startCol + 2 })];

            if (!nameCell || nameCell.v == null) continue;

            const name = String(nameCell.v).trim();
            if (name === "破纪录次数(含旧榜)↓") break;
            if (name === "前十玩家↑") continue;

            const score = scoreCell ? String(scoreCell.v) : "";
            const link = scoreCell?.l?.Target || "";
            const date = dateCell ? String(dateCell.w || dateCell.v) : "";

            arr.push({
                选手: name,
                成绩: link ? [score, link] : [score],
                日期: date
            });
        }

        if (arr.length > 0) {
            battles.push({ [title]: arr }); // key 为 title
        }
    }

    return battles;
}


// 调用示例
const data = parseSingleList("./data/黑猴九禁速通榜(新).xlsx", 1);

fs.writeFileSync("data/new-list-single.json", JSON.stringify(data, null, 4), "utf-8");
