import { expect } from 'chai';
import parse from 'parse-duration';
import { normalizeTime } from '../scripts/util.js';


describe('normalizeTime', () => {
    it(`51''45 -> 51.45s`, () => {
        expect(normalizeTime("51''45")).to.equal('51.45s');
    });

    it(`1'01''56 -> 1m01.56s`, () => {
        expect(normalizeTime("1'01''56")).to.equal('1m01.56s');
    });

    it(`1'17''75 -> 1m17.75s`, () => {
        expect(normalizeTime("1'17''75")).to.equal('1m17.75s');
    });

    it(`1'29'' -> 1m29s`, () => {
        expect(normalizeTime("1'29''")).to.equal('1m29s');
    });

    it(`3'16''? -> 3m16s`, () => {
        expect(normalizeTime("3'16''?")).to.equal('3m16s');
    });
});

describe('parse normalizeTime', () => {
    it(`51.45s -> 51.45`, () => {
        expect(parse(normalizeTime("51''45"), 's')).to.equal(51.45);
    });

    it(`1m01.56s -> 61.56`, () => {
        expect(parse(normalizeTime("1'01''56"), 's')).to.equal(61.56);
    });

    it(`1m17.75s -> 77.75`, () => {
        expect(parse(normalizeTime("1'17''75"), 's')).to.equal(77.75);
    });

    it(`1m29s -> 89`, () => {
        expect(parse(normalizeTime("1'29''"), 's')).to.equal(89);
    });

    it(`3m16s -> 196`, () => {
        expect(parse(normalizeTime("3'16''?"), 's')).to.equal(196);
    });
});
