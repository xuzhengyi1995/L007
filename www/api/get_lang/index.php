<?php
include_once '../../PHP_www/g_translation.php';
include_once '../../PHP_www/api_auth.php';
$auth=new api_auth();
try
{
	$auth->login_check();
	$lan=$_GET['lang'];
	$tra=new g_translate();
	$r_data=array("data"=>$tra->get_all_languages($lan));
}
catch(Exception $e)
{
	$r_data=array('is_error'=>true,'error_info'=>$e->getMessage());
}

header('Content-type: application/json');
echo json_encode($r_data);	
?>

