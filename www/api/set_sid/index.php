<?php
function set_sid($data)
{
	include_once '../PHP_www/Auth.php';
	include_once '../PHP_www/person.php';
	
	$uid=logged_get_uid();
	$c_st=new c_student($data['sid']);
	if(!$c_st->is_have())
	{
		if(!isset($data['nom'])||!isset($data['prenom'])||$data['nom']==''||$data['prenom']=='')
		{
			throw new Exception("ERROR_NO_STUDENT_INFORMATION", 1);
		}
	  $c_st->insert_new_student($data['nom'],$data['prenom'],$data['admission'],$data['filiere']);
	}
	
	$auth=new auth(NULL,NULL,false,$uid);
	$auth->modify_sid($data['sid']);
	session_start();
	$_SESSION['sid']=$data['sid'];
	return true;
}
?>