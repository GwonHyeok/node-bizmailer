/**
 * Created by GwonHyeok on 2016. 10. 25..
 */
class SmsError {

  /**
   * 요청 결과과 OK 이면 성공으로 보며 그 외의 경우는 전부 실패로 간주한다
   *
   * @param result 문자 전송 후 비즈메일러 서버에서 받은 응답
   *
   * @returns {boolean} 에러 리스트에 존재 여부
   */
  isError(result) {
    return result !== 'OK';
  }
}

module.exports = new SmsError();
