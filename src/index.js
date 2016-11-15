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
     * mobile = 수신자 핸드폰번호
     * message = 문자 메시지 내용
     *
     * callback : Callback 함수가 있으면 Callback 으로 결과를 넘겨주고 그렇지 않다면 Promise 형태로 결과를 넘겨줍니다
     */
    sendSMS(auth_key, options, callback) {
        const memoParams = {}, hasCallback = util.isFunction(callback);
        if (!auth_key) {
            const error = new Error('문자 메세지를 보내기 위해서는 auth_key(자동 메세지 아이디)가 필수로 필요합니다');
            if (hasCallback) return callback(error);
            return Promise.reject(error);
        }

        // TODO memo_(n) 에 나눠서 보내는 기능은 추후에 적용
        // 문자 메세지를 Split 하여 m_memo 에 집어 넣는다
        // 1 ~ 5 번 까지는 데이터 베이스에 기록이 가능 하며
        // 6번은 자릿수 제한이 없고 데이터베이스에 기록이 되지 않는다.
        // const messages = this._splitText(options['message'] || '');
        // for (let i = 1; i <= 6; i++) {
        //     memoParams[`m_memo${i}`] = i != 6 ? messages[i-1] : messages.slice(6, messages.length).join('');
        // }

        // 글자 수 제한이 없는 m_memo6에 넣어서 보내준다
        memoParams['m_memo6'] = options['message'];

        // 비즈 메일러 서버에 요청할 파라미터 정보
        const params = Object.assign({}, {auth_key, biz_id: this.bizId}, memoParams, {m_mobile: options['mobile']});

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

            return {success: true, params}
        })
    }

    _splitText(message) {
        const splitText = [], splitCharacter = [...message];
        let startPos = 0;

        splitCharacter
            .map(character => {
                const c = character.charCodeAt(0);
                return c >> 11 ? 3 : c >> 7 ? 2 : 1
            })
            .reduce((prev, curr, index, array = []) => {
                const sumBytes = prev + curr + (index + 1 >= array.length ? 0 : array[index + 1]);

                // prev + curr + array[index + 1] 의 바이트가 더했을때 50 바이트 이상이면 자름
                if (sumBytes >= 50) {
                    splitText.push(splitCharacter.slice(startPos, index).join(''));
                    startPos = index;
                    return curr;
                } else if (index === array.length - 1) {
                    // 현재 index 가 문자열의 마지막 길이와 같을때 자름
                    splitText.push(splitCharacter.slice(startPos, index + 1).join(''));
                    return 0;
                }

                return prev + curr;
            }, 0);

        return splitText;
    }
}

module.exports = BizMailer;