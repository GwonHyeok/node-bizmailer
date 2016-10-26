**BIZMAILER Node.js Library**
======================================================================

소개
---
[BIZMAILER](http://web.bizmailer.co.kr) 의 기능을 Node.js 에서 사용할 수 있도록 만든 라이브러리입니다.

지원기능
1. SMS 전송 기능

라이브러리 사용 조건
-----------
* ES6

빠른 시작
-----

#### 설치 방법
```javascript
npm install bizmailer
```

#### 문자 전송
 
##### 비즈 메일러 설정
문자를 보내기 위해서는 비즈메일러에서 자동발송 메시지를 추가하여야 사용하실 수 있습니다.
비즈메일러에서 자동발송 -> 새 자동발송 추가 -> 자동 SMS/MMS 만들기 순으로 접속한 후
템플릿 이름, 발신자 번호, SMS 제목을 입력 후 내용 입력 부분에 {{c1}}{{c2}}{{c3}}{{c4}}{{c5}}{{c6}} 를 넣어줍니다

메시지를 전송할때 245바이트 이상 문자를 적게 되면, 245바이트 까지는 비즈메일러 데이터베이스에 저장이 되지만 그 이상의 텍스트는
문자 메시지 내용에 포함되어 전송이 되나 비즈메일러 데이터 베이스에 저장이 되지 않습니다.

##### 코드
```javascript
const BizMailer = require('bizmailer');

const bizMailer = new BizMailer('비즈 메일러 아이디');
bizMailer.sendSMS('문자 자동발송 아이디', {mobile: '01000000000', message: '안녕하세요 사람 입니다 지금은 문자 테스트 중 입니다!'});
```

##### 결과 확인
성공의 경우 어떻게 비즈메일러에 요청하였는지(params) 성공(success)가 반환되며 실패의 경우 에러가 throw 됩니다
```javascript
const result = bizMailer.sendSMS();

// 성공 예
result == {
    success: true,
    params: {
        auth_key: 'AUTH_KEY',
        biz_id: 'BIZ_ID',
        memo_1: '안녕하세요 사람 입니다 지금은 문자 테스트 중 입니다!',
        m_mobile: '01000000000'
    }
}
```

비즈메일러에서 확인하기 위해서는 결과 확인 메뉴에서 결과를 확인하실 수 있습니다.