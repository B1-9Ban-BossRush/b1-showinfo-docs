import { expect } from 'chai';
import fs from 'fs';
import parse from 'parse-duration';
import { normalizeTime, convertSingleList, convertTotalList, generateRankingList } from '../scripts/util.js';


describe('normalizeTime', () => {
    it("51''45 -> 51.45s", () => {
        expect(normalizeTime("51''45")).to.equal('51.45s');
    });

    it("1'01''56 -> 1m01.56s", () => {
        expect(normalizeTime("1'01''56")).to.equal('1m01.56s');
    });

    it("1'17''75 -> 1m17.75s", () => {
        expect(normalizeTime("1'17''75")).to.equal('1m17.75s');
    });

    it("1'29'' -> 1m29s", () => {
        expect(normalizeTime("1'29''")).to.equal('1m29s');
    });

    it("3'16''? -> 3m16s", () => {
        expect(normalizeTime("3'16''?")).to.equal('3m16s');
    });

    it('空字符串 -> 空', () => {
        expect(normalizeTime("")).to.equal('');
    });

    it('非法字符串 -> 原值', () => {
        expect(normalizeTime("abc")).to.equal('abc');
    });
});

describe('parse normalizeTime', () => {
    it("51''45 -> 51.45", () => {
        expect(parse(normalizeTime("51''45"), 's')).to.equal(51.45);
    });

    it("1'01''56 -> 61.56", () => {
        expect(parse(normalizeTime("1'01''56"), 's')).to.equal(61.56);
    });

    it("1'17''75 -> 77.75", () => {
        expect(parse(normalizeTime("1'17''75"), 's')).to.equal(77.75);
    });

    it("1'29'' -> 89", () => {
        expect(parse(normalizeTime("1'29''"), 's')).to.equal(89);
    });

    it("3'16''? -> 196", () => {
        expect(parse(normalizeTime("3'16''?"), 's')).to.equal(196);
    });
});

describe('convertSingleList', () => {
    const testJsonPath = './test-single.json';
    const testData = [
        {
            title: "三虎",
            table: [
                {
                    "选手": "张三",
                    "成绩": "50''99",
                    "日期": "2025/8/12"
                },
                {
                    "选手": "李四",
                    "成绩": "50''86",
                    "日期": "2025/6/25"
                }]
        }
    ];

    before(() => {
        fs.writeFileSync(testJsonPath, JSON.stringify(testData), 'utf-8');
    });

    after(() => {
        fs.unlinkSync(testJsonPath);
    });

    it('包含表头', () => {
        const md = convertSingleList(testJsonPath);

        expect(md).to.include('单项');
        expect(md).to.include('三虎');
        expect(md).to.include('选手');
        expect(md).to.include('成绩');
    });

    it('成绩排序正确', () => {
        const md = convertSingleList(testJsonPath);

        expect(md.indexOf('张三')).to.be.greaterThan(md.indexOf('李四'));
    });
});

describe('convertTotalList', () => {
    const testJsonPath = './test-total.json';
    const testData = [
        {
            "选手": "张三",
            "三虎": "54''52",
            "四僧": "1'28''78",
            "四龙": "1'53''64",
            "六将": "2'35''04",
            "六虫": "2'20''49",
            "万凶": "2'40''50",
            "心猿": "1'19''93",
            "梅山": "3'23''94",
            "六根": "5'03''94",
            "总成绩": "21'40''78"
        },
        {
            "选手": "李四",
            "三虎": "53''79",
            "四僧": "1'26''75",
            "四龙": "1'54''15",
            "六将": "2'31''50",
            "六虫": "2'14''44",
            "万凶": "2'46''08",
            "心猿": "1'21''98",
            "梅山": "3'03''56",
            "六根": "5'05''88",
            "总成绩": "21'18''13"
        }
    ];

    before(() => {
        fs.writeFileSync(testJsonPath, JSON.stringify(testData), 'utf-8');
    });

    after(() => {
        fs.unlinkSync(testJsonPath);
    });

    it('总成绩排序正确', () => {
        const md = convertTotalList(testJsonPath);

        expect(md).to.include('总榜');
        expect(md.indexOf('李四')).to.be.lessThan(md.indexOf('张三'));
    });
});
