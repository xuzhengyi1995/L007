<?php
include_once '../../PHP_www/g_translation.php';
include_once '../../PHP_www/api_auth.php';
$auth=new api_auth();
try
{
	$auth->login_check();

	$data=json_decode(file_get_contents("php://input"),true);
	ini_set("allow_url_fopen", true);
	
	$tra=new g_translate();
	$r_data=array("data"=>$tra->translate_text($data['data'],$data['to']));
}
catch(Exception $e)
{
	$r_data=array('is_error'=>true,'error_info'=>$e->getMessage());
}

header('Content-type: application/json');
echo json_encode($r_data);	
?>


