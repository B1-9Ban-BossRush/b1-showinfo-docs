import parse from 'parse-duration';
import { normalizeTime } from '../scripts/util.js';
import moment from 'moment';
import 'moment-duration-format';


describe('Calculate Total Score', () => {
    it("计算新榜总成绩", () => {
        // const scores = ["53''79", "1'26''75", "1'54''15", "2'31''50", "2'14''44", "2'46''08", "1'21''98", "3'03''56", "5'05''88"];

        // const scores = ["54''52", "1'28''78", "1'53''64", "2'35''04", "2'12''11", "2'40''50", "1'19''93", "3'23''94", "5'03''94"];

        const scores = ["55''92", "1'29''72", "1'56''82", "2'53''17", "2'15''26", "2'35''49", "1'22''82", "3'08''95", "5'18''64"];

        let totalScore = 0

        for (let i = 0; i < scores.length; ++i) {
            const e = scores[i];

            totalScore += parse(normalizeTime(e))
        }

        const formattedTotalScore = moment.duration(totalScore, 'milliseconds').format("mm:ss.SSS", { trim: false });

        console.log(formattedTotalScore);
    });
})
