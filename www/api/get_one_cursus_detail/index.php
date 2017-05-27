<?php

//error_reporting(E_ALL);
//ini_set('display_errors', '1');


/*
{
	"cid":1
}
*/

function get_one_cursus_detail($cid)
{
	include_once '../PHP_www/cursus.php';
	include_once '../PHP_www/Auth.php';
	$uid=logged_get_uid();
	$cursus=new cursus(false,$cid);
		
	$r_data=array("student"=>$cursus->get_student()->get_info_array(),"elems"=>$cursus->get_element(true));
	return array('is_error'=>false,'error_info'=>NULL,'cid'=>$cid,'data'=>$r_data);
}

?>