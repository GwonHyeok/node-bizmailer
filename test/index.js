/**
 * Created by GwonHyeok on 2016. 10. 25..
 */
const BizMailer = require('../index');

const bizMailer = new BizMailer(process.env.TEST_BIZ_ID);
bizMailer
    .sendSMS(process.env.TEST_AUTH_KEY, {
        mobile: '01000000000',
        message: '안녕하세요 문자 테스트 중 입니다!'
    })
    .then(result => console.log(result))
    .catch(err => console.error(err));
