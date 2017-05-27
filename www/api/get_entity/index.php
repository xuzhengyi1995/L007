<?php
include_once '../../PHP_www/entity_link.php';
include_once '../../PHP_www/api_auth.php';

$auth=new api_auth();
try
{
	$auth->login_check();
	$data=json_decode(file_get_contents("php://input"),true);
	ini_set("allow_url_fopen", true);
	
	$t=new entity_link();
	
	$r_data=array("data"=>$t->mark_the_text($data['data'],'<abbr title=\"attribute\">','</abbr>'));
}
catch(Exception $e)
{
	$r_data=array('is_error'=>true,'error_info'=>$e->getMessage());
}

header('Content-type: application/json');
echo json_encode($r_data);	
?>