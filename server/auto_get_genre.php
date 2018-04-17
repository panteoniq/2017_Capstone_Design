<?php

//전날 박스오피스 영화 이름과 한/영 장르를 추출하여 데이터베이스에 저장합니다.
//auto_get_genre.js와 동일하게 작동하며 php로 작성한 스크립트라는 점만 차이점입니다.

//참고 문헌
//OPEN API 호출 관련 : http://airpage.org/xe/language_data/22385
//php 날짜 추출 관련 : https://www.w3schools.com/php/func_date_date.asp
//php timezone 관련 : http://php.net/manual/kr/function.date-default-timezone-set.php
//php -> mysql UTF-8 한글 깨짐 관련 : http://luckyyowu.tistory.com/279

    //DB 접속정보 설정
    $con;
    require_once 'C:\Apache24\htdocs\moona\includes/DBConnect.php';
    $db= new DBConnect();
    $con=$db->connect();
    $query=$con->prepare("set names utf8");
    $query->execute();
    $query=$con->prepare("delete from movie_list");
    $query->execute();

    $boxoffice_resultArr=array(); //박스오피스 정보가 담길 배열
    $movieNameArr=array();
    $movieGenArr=array(); //장르 정보가 담길 배열
    $MovieEnGenArr = array();

    //이 시간은 UTC 기준이며 대한민국 시간을 얻기 위해선 timezone을 설정해야 합니다,
    date_default_timezone_set('Asia/Seoul');

    $date=date(Ymd,time())-1;
    $key="8d90e1d7cc68d0c50a028641ddb6279d";
    $boxoffice_url="http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=".$key."&targetDt=".$date;

    $boxoffice_ch = curl_init();
    curl_setopt($boxoffice_ch, CURLOPT_URL, $boxoffice_url);
    //CURLOPT_RETURNTRANSFER : 	TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly.
    curl_setopt($boxoffice_ch, CURLOPT_RETURNTRANSFER, true);
    //CURLOPT_TIMEOUT : 	The maximum number of seconds to allow cURL functions to execute.
    curl_setopt($boxoffice_ch, CURLOPT_TIMEOUT, 10);

    $boxoffice_result = curl_exec($boxoffice_ch);
    $boxoffice_result = json_decode($boxoffice_result,true);
    if (!$boxoffice_result)
    {
      echo "[Error] 박스오피스 OPEN API 호출이 정상적으로 이루어지지 않음\n";
    }//if (!$result) end
    else
    {
      //박스오피스 영화코드 추출 완료
      for ($x=0; $x<10; $x++)
      {
        $boxoffice_resultArr[$x]=$boxoffice_result['boxOfficeResult']['dailyBoxOfficeList'][$x]['movieCd'];
        echo $boxoffice_resultArr[$x]."\n";
      }

      //영화 코드로 영화의 상세 정보 추출 시작
      for ($x=0; $x<10; $x++)
      {
          $movieInfo_url="http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=".$key."&movieCd=".$boxoffice_resultArr[$x];
          $movieInfo_ch=curl_init();
          curl_setopt($movieInfo_ch, CURLOPT_URL, $movieInfo_url);
          //CURLOPT_RETURNTRANSFER : 	TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly.
          curl_setopt($movieInfo_ch, CURLOPT_RETURNTRANSFER, true);
          //CURLOPT_TIMEOUT : 	The maximum number of seconds to allow cURL functions to execute.
          curl_setopt($movieInfo_ch, CURLOPT_TIMEOUT, 10);

          $movieInfo=curl_exec($movieInfo_ch);
          $movieInfo=json_decode($movieInfo,true);
          if (!$movieInfo)
          {
            echo "[ERROR] 영화 상세정보 API 호출이 정상적으로 이루어지지 않음\n";
          }
          else {
            $movieNameArr[$x]=$movieInfo['movieInfoResult']['movieInfo']['movieNm'];
            $movieGenArr[$x]=$movieInfo['movieInfoResult']['movieInfo']['genres'][0]['genreNm'];
          }
          curl_close($movieInfo_ch);

          switch($movieGenArr[$x])
          {
            case "액션":
              $MovieEnGenArr[$x] = "action";
              break;
            case "어드벤처":
              $MovieEnGenArr[$x] = "adventure";
              break;
            case "다큐멘터리":
              $MovieEnGenArr[$x] = "documentary";
              break;
            case "드라마":
              $MovieEnGenArr[$x] = "drama";
              break;
            case "성인물(에로)":
              $MovieEnGenArr[$x] = "adult";
              break;
            case "코미디":
              $MovieEnGenArr[$x] =  "comedy";
              break;
            case "사극":
              $MovieEnGenArr[$x] = "history";
              break;
            case "미스터리":
              $MovieEnGenArr[$x] = "mystery";
              break;
            case "멜로/로맨스":
              $MovieEnGenArr[$x] = "melo_remance";
              break;
            case "범죄":
              $MovieEnGenArr[$x] = "crime";
              break;
            case "애니메이션":
              $MovieEnGenArr[$x] = "animation";
              break;
            case "기타":
              $MovieEnGenArr[$x] = "etc";
              break;
            case "스릴러":
              $MovieEnGenArr[$x] = "thriller";
              break;
            case "가족":
              $MovieEnGenArr[$x] = "family";
              break;
            case "공포(호러)":
              $MovieEnGenArr[$x] = "horror";
              break;
            case "전쟁":
              $MovieEnGenArr[$x] = "war";
              break;
            case "SF":
              $MovieEnGenArr[$x] = "SF";
              break;
            case "판타지":
              $MovieEnGenArr[$x] = "fantasy";
              break;;
            case "뮤지컬":
              $MovieEnGenArr[$x] = "musical";
              break;
          }//switch end

          //echo

          $query=$con->prepare("Insert into movie_list values(NOW(),?,?,?)");
          $query->bind_param("sss", $movieNameArr[$x], $movieGenArr[$x], $MovieEnGenArr[$x]);//변수 바인딩
          if (!$query->execute())
          {
            echo "[Error] 영화 리스트 저장 오류 발생: ".$movieNameArr[$x]. "  " .$movieGenArr[$x]. "   ".  $MovieEnGenArr[$x]."\n";
          }
          else {
            echo $movieNameArr[$x]. "  " .$movieGenArr[$x]. "   ".  $MovieEnGenArr[$x]." 저장 완료\n";
          }
      }// 영화 상세정보 저장을 위한 for ($x=0; $x<10; $x++) end
    }// if (!$result) else end

    curl_close($boxoffice_ch);

?>
