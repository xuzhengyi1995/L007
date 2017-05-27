<?php
include_once '../../../PHP_www/Auth.php';
include_once '../../../PHP_www/c_reCAPTCHA.php';

if (!get_magic_quotes_gpc()) 
{
	$username=addslashes($_POST['username']);
	$role=addslashes($_POST['type']);
	$email=addslashes($_POST['email']);
	$password=addslashes($_POST['password']);
	$g_c=addslashes($_POST['g-recaptcha-response']);
}
else
{
	$username=$_POST['username'];
	$role=$_POST['type'];
	$email=$_POST['email'];
	$password=$_POST['password'];
	$g_c=$_POST['g-recaptcha-response'];
}

$role='student';

if(check_reCAPTCHA($g_c))
{
	$login=new auth($password,$email,true,NULL,$username,$role);
	if($login->is_error())
	{
		$r_info=array('is_error'=>$login->is_error(),'error_info'=>$login->get_error_info());
	}
	else
	{
		$login->Creat_user();
		$r_info=array('is_error'=>$login->is_error(),'error_info'=>$login->get_error_info(),'uid'=>$login->get_uid(),'username'=>$login->get_username());
	}
}
else
{
	$r_info=array('is_error'=>true,'error_info'=>'ERROR_CHECK_BOOT');
}

header('Content-type: application/json');
echo json_encode($r_info);
?>