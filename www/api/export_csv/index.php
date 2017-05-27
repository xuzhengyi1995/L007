<?php


function get_os()
{
	$data=$_SERVER['HTTP_USER_AGENT'];
	if(preg_match('/win/i',$data))
	{
		return 'win';
	}
	if(preg_match('/linux/i',$data)||preg_match('/unix/i',$data)||preg_match('/sun/i',$data)||preg_match('/ibm/i',$data)||preg_match('/BSD/i',$data))
	{
		return 'linux';
	}
	if(preg_match('/Mac/i',$data))
	{
		return 'mac';
	}
	return 'win';
}


function export_csv($cid)
{
	include_once "../PHP_www/Auth.php";
	include_once "../PHP_www/csv.php";
	$uid=logged_get_uid();
	
	$c_csv=new csv(false,$cid,$uid,NULL,get_os());
	$c_csv->get_csv();

	return false;
}
?>