<?php
include_once '../../../PHP_www/Auth.php';
include_once '../../../PHP_www/c_reCAPTCHA.php';

if (!get_magic_quotes_gpc()) 
{
	$email=addslashes($_POST['email']);
	$password=addslashes($_POST['password']);
}
else
{
	$email=$_POST['email'];
	$password=$_POST['password'];
}

$login=new auth($password,$email,true);
$r_info=array('is_error'=>$login->is_error(),'error_info'=>$login->get_error_info());
header('Content-type: application/json');
echo json_encode($r_info);
?>