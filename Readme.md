울창한 대나무 숲
================

삼육대학교 커뮤니티 사이트 *대나무 숲* 뿐만 아니라	삼육대와 관련한 모든 커뮤니티 정보들을 가져와서,	학생들에게 **뉴스 피드** 처럼 한 눈에 보여주는 서비스를 제공한다.

사이트 주소
-----------------
https://kkodu.herokuapp.com/ (모바일 환경으로 개발)

## 개발 환경
```
OS: Ubuntu 16.04 LTS

Client: HTML5, CSS3, JavaScript

Server Side: Node.js

DB: MongoDB
```

## 결과 사진
```
1. 메인 렌더링 페이지

2. 부가 정보 제공 페이지

3. 추천(랭킹) 페이지

4. 관리, 설정 페이지
```  

## 데이터 수집(크롤링)
```
###페이스북 커뮤니티 피드
  - Facebook API 사용
  - 페이지 게시물 수집 모듈
    > SYUP_crawling/routes/community/facebook/syu-bamboo.js
    > SYUP_crawling/modules/fb-modules/get-access-token.js [접근 권한 토큰 요청]
    > SYUP_crawling/modules/fb-modules/get-wall-feeds.js [커뮤니티 페이지 접근 후 피드 요청]
    > SYUP_crawling/modules/fb-moudles/save-message.js [피드 저장]
    > SYUP_crawling/modules/fb-modules/update-react.js [피드 댓글 및 좋아요 저장 및 업데이트]
  - 수집 데이터 요소
    ID, 커뮤니티페이지명, 내용, 포스팅날짜, 사진, 사진_링크, 동영상, 좋아요 수, 댓글 수
  - 동작
    Crontab 스케줄링을 이용하여 20초 간격으로 데이터베이스에 페이지 포스트와 댓글을 저장
    
###디시인사이드 피드
  - CasperJS Framework (가상브라우저를 이용한 페이지 접근을 통해 데이터 수집)
  - 페이지 게시물 수집 모듈
    > SYUP_crawling/casper/dcinside-crawling.js [페이지 접근, 데이터를 수집하여 JSON파일 형태로 저장]
    > SYUP_crawling/routers/community/dcinside/dc-syugall.js [data폴더에 저장 된 JSON파일을 가져와 데이터베이스에 저장]
  - 수집 데이터 요소
    페이스북 데이터와 동일
  - 동작
    Crontab 스케줄링을 이용하여 최초로 casperjs 명령어를 사용해 JSON파일 생성 후, 
    페이스북 데이터 크롤링 스케줄링시, 디시인사이드 데이터를 저장
    
###학사 정보 데이터
  - CasperJS Framework 사용
  
###날씨 데이터
  - request-httpcli 사용, RSS데이터 수집
```

## 페이지 렌더링
```
XMLHttpRequest 객체를 사용한 AJAX 비동기 통신을 통한 렌더링

메인페이지 렌더링은 세 가지로 구분
 ###초기 렌더링
  - 렌더링 시, 데이터 최신 순으로 요청
  - 업데이트 기준 변수인 PrimaryFeed 생성
  
 ###추가 요청시 렌더링
 
 ###업데이트 시 렌더링
  - 업데이트는 setInterval를 이용하여 2분 간격으로 데이터베이스 상태를 체크
  - 기준은 created_time 요소로 비교
  
```

## 데이터베이스 컬렉션
```

```

## 이슈 해결
```

```

## 개선 방향
```
```
