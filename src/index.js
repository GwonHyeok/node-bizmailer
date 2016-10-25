/**
 * Created by GwonHyeok on 2016. 10. 25..
 */
const co = require('co');
const rp = require('request-promise');

const smsError = require('./errors/smsError');

const util = require('util');

class BizMailer {

    /**
     * @param biz_id 비즈 메일러 아이디
     */
    constructor(biz_id) {

        // 비즈 메일러 SMS url
        this.SMS_URL = 'http://www.bizmailer.co.kr/bizsmart/action/auto.do';

        // BizMailer 아이디
        this.bizId = biz_id;

        if (!this.bizId) throw new Error('비즈메일러 라이브러리를 사용하기 위해서 biz_id가 필요합니다');
    }

    /**
     * 문자 메세지 전송
     *
     * @param auth_key 자동 메세지 아이디
     * @param options 문자 전송을 하기 위한 옵션 데이터
     * @param callback 문자 전송 후 결과를 받을 callback
     *
     * options : 데이터 안에는 아래의 데이터들이 들어갑니다. 아래의 값들은 필수는 아니며 사용할 값만 넣으면 됩니다
     *
     * m_nm = 수신자 이름( 치환코드 {{cn}} )
     * m_email = 수신자 이메일 ( 치환코드 {{ce}} )
     * m_mobile = 수신자 핸드폰번호 ( 치환코드 {{cs}} )
     * m_memo1  ~ m_memo20 = 메모1 ~ 20 ( 치환코드 {{c1}} ~ {{c20}} )
     *
     * callback : Callback 함수가 있으면 Callback 으로 결과를 넘겨주고 그렇지 않다면 Promise 형태로 결과를 넘겨줍니다
     */
    sendSMS(auth_key, options, callback) {
        if (!auth_key) throw new Error('문자 메세지를 보내기 위해서는 auth_key(자동 메세지 아이디)가 필수로 필요합니다');

        const params = Object.assign({}, {auth_key, biz_id: this.bizId}, options);

        // Callback 을 사용하면 콜백으로 값을 넘겨준다
        if (util.isFunction(callback)) {
            return this._sendSMS(params).then(result => callback(null, result)).catch(err => callback(err));
        }

        return this._sendSMS(params);
    }

    _sendSMS(params) {
        const self = this;

        return co(function*() {

            const result = yield rp({
                method: 'POST',
                uri: self.SMS_URL,
                form: params
            });

            // 에러 확인 후 현재 결과가 에러라면 에러 throw
            if (smsError.isError(result)) throw new Error(result);


            if (result === 'OK') return true;

        })
    }
}

module.exports = BizMailer;