## Summary
이 폴더는 Movie Now 애플리케이션 Server-side 코드가 있는 곳입니다. 제가 작성한 코드들만 존재하며,<br>그 리스트는 다음과 같습니다. 이 중 1번의 내용은 보안상의 이유로 일부가 수정되어 게재되었습니다.<br><br><참고>박스오피스 순위 수집 및 가공 스크립트는 최초 1회 실행 시 에러가 발생합니다.<br>Open API 문제이며 다시 실행한다면 문제 없이 동작합니다.

```
1. 상수(./includes/Constants.php)
2. 데이터베이스 연결 정보(./includes/DBConnect.php)
3. 데이터베이스 입출력 함수(./includes/DBOperations.php)
4. 박스오피스 순위 수집 및 가공(./auto_get_genre.js) (./auto_get_genre.php)
5. 비밀번호 변경(./change_password.php)
6. 선호 장르 변경(./change_pref.php)
7. 비밀번호 확인(./check_password.php)
8. 선호 장르 로드(./check_pref.php)
9. 아이디 중복 확인(./idcheck.php)
10. 로그인(./new_login.php)
11. 로그아웃(./new_logout.php)
12. 회원가입(./new_signup.php)
13. 영화 추천 알고리즘(./recommend.php)
14. 푸시 알람 전송 스크립트(./send_push.php)
```
