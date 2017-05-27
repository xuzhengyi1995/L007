<?php
include_once '../../PHP_www/Auth.php';
User_log_out();
$r_info=array('ok'=>'true');
header('Content-type: application/json');
echo json_encode($r_info);
?>