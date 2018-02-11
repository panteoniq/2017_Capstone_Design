<?php
  function send_push ($token, $message)
  {

    $tokens=array();
    $tokens[]=$token;

    $url='https://fcm.googleapis.com/fcm/send';

    $fields = array (
    'to'=>$token,
    'data' => array ("title" => "오늘의 영화 추천입니다!",
                              "body" => $message)
    );
    echo $fields['notification']['title'];

    //최종 앱
     $headers = array(
        'Authorization:key=AAAAEjr6WwQ:APA91bHtuzzFwdtMu9Vz-uImg02v19aRCKBYoODEAZgP99eYJbdQqZMDSXbHt0D_B6CVwrIkvJy4cTbUXSDZkL5QBTM8ArSvebfGbuVzVN3mHtmNuSvbeuJF7h_wz5Pe_qgGrO4swd2U',
      'Content-Type: application/json'
    );


    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    $result=curl_exec($ch);
    if ($result==FALSE)
      die ('Curl failed :'.curl_error($ch));
    curl_close($ch);
    echo $result;

  }
?>
