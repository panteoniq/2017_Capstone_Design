//1. 매일 동일한 시간에 실행하기 위해서 원래는 node-cron 모듈을 사용했으나 에러 발생 시
//스크립트 파일 자체가 종료되어 일일이 다시 실행해야 하는 번거로움이 있어 삭제하고 리눅스 기본 명령어인 crontab을 사용하였습니다

var http = require( "http" );
var mysql = require('mysql');

var connection;


//날짜 계산
function CalDate()
{
  var maxday=[31,28,31,30,31,30,31,31,30,31,30,31];
  var today = new Date();
  var dd = today.getDate()-1; //하루 전 날짜
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd==0)//오늘이 1일이면 전 달 마지막 날짜로
  {
    if ((mm--)==0)//1월 1일이었을 경우에는 12월로 돌아가야 하니까
    {
       mm=12;
    }
    dd=maxday[mm];
  }

  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  return yyyy+mm+dd;
}

//DB 연결
function DBCon()
{
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    port     : 3306,
    database : 'moona'
  });

  //영화 목록을 MySQL에 저장하기 위해 커넥션 생성
  connection.connect(function(err) {
      if (err) {
          console.error('mysql connection error');
          console.error(err);
          throw err;
      }
      else {
        console.log("DB접속 완료");
      }
  });
}

function DBClose()
{
  connection.end();
}

var key="8d90e1d7cc68d0c50a028641ddb6279d";
var movieGenUrl='';
var date;
var movieCodeUrl;
var parsed_movieGen;
var movieCodeArr=["","","","","","","","","",""];
var movieGenObj=[Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object()];
var movieGenInsertData;
var i;

function DeleteMovieList(){
  var devQuery = connection.query('delete from movie_list', function(err, rows, fields) {
    if (err)//실패할 시 에러 메시지 전송
    {
      console.log('Error while performing Query(Deleting Movie Data). : ', err.code);
    }
    else
    {
      console.log('info', '1일 전 영화 정보 삭제가 완료되었습니다 : ');
    }
  });
}

function GetMovieGen()
{
  movieGenObj=[Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object(),Object()];
    for (i=0; i<10; i++)
    {
      movieGenUrl='http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key='+key+'&movieCd='+movieCodeArr[i];
      http.get(movieGenUrl, function(res){
          var body = '';

          res.on('data', function(chunk){
              body += chunk;
          });

          res.on('end', function(){
              parsed_movieGen = JSON.parse(body);

              switch(parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm)
              {
                case "액션":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "action"
                    }
                  break;
                case "어드벤쳐":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "adventure"
                    }
                  break;
                case "다큐멘터리":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "documentary"
                    }
                  break;
                case "드라마":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "drama"
                    }
                  break;
                case "성인물(에로)":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "adult"
                    }
                  break;
                case "코미디":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "comedy"
                    }
                  break;
                case "사극":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "history"
                    }
                  break;
                case "미스터리":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "mystery"
                    }
                  break;
                case "멜로/로맨스":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "melo_remance"
                    }
                  break;
                case "범죄":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "crime"
                    }
                  break;
                case "애니메이션":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "animation"
                    }
                  break;
                case "기타":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "etc"
                    }
                  break;
                case "스릴러":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "thriller"
                    }
                  break;
                case "가족":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "family"
                    }
                  break;
                case "공포(호러)":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "horror"
                    }
                  break;
                case "전쟁":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "war"
                    }
                  break;
                case "SF":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "SF"
                    }
                  break;
                case "판타지":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "fantasy"
                    }
                  break;
                case "뮤지컬":
                movieGenObj[i] = {
                      MovieName : parsed_movieGen.movieInfoResult.movieInfo.movieNm,
                      MovieGenre : parsed_movieGen.movieInfoResult.movieInfo.genres[0].genreNm,
                      MovieEnGenre : "musical"
                    }
                  break;

              }
              movieGenInsertData=[movieGenObj[i].MovieName, movieGenObj[i].MovieGenre, movieGenObj[i].MovieEnGenre];
              var devQuery = connection.query('insert into movie_list values(NOW(),?,?,?)',movieGenInsertData, function(err, rows, fields) {
                if (err)//실패할 시 에러 메시지 전송
                {
                  console.log('Error while performing Query(Movie Data Inserting). : ', err.code);
                }
                else
                {
                  console.log('영화 정보 저장이 완료되었습니다! : ' + new Date());
                }
              });
          });

      }).on('error', function(e){
            console.log("Got an Error : ", e);
      });
    }
    setTimeout(DBClose, 3000);
    console.log("");
}

DBCon();
date=CalDate();
movieCodeUrl='http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key='+key+'&targetDt=' + date;
console.log("영화 장르 추출 시작...");
DeleteMovieList();
console.log("DB의 기존 데이터 삭제 완료");
http.get(movieCodeUrl, function(res){
    var body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        parsed_data = JSON.parse(body);
        for (i=0; i<10; i++)
        {
          movieCodeArr[i]=parsed_data.boxOfficeResult.dailyBoxOfficeList[i].movieCd;
          console.log(movieCodeArr[i]);
        }
        GetMovieGen();
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
