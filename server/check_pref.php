<?php

require_once './includes/DBOperations.php';

//rescode 1 : 아이디와 비밀번호가 맞지 않습니다
//rescode 2 : 아이디와 비밀번호를 모두 적어주세요

$refGen=array();
  if ($_SERVER['REQUEST_METHOD']=='POST')//POST 방식으로 접근했을 경우
  {
    if (isset($_POST['userID']))
    {
      $db=new DBOperations();
      $userID=trim($_POST['userID']);
      $result=$db->checkPrefGenre($userID);
      echo json_encode($result);
    }//isset end
  }//REQUEST_METHOD end
?>
