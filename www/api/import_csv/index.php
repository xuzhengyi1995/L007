<?php
include_once "../../PHP_www/Auth.php";
include_once "../../PHP_www/csv.php";

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

$err=false;
$err_info='';
$csv=$_FILES['csv'];

if (User_logged_in()) 
{
	$uid=logged_get_uid();
	
	if($csv['type']!="application/csv"&&$csv['type']!='application/vnd.ms-excel'&&$csv['type']!="text/csv")
	{
		$err=true;
		$err_info='ERROR_FILE_TYPE_ERROR';
	}
	else
	{
		if($csv['error']>0)
		{
			$err=true;
			$err_info='ERROR_UPLOAD_FILE';
		}
		else
		{
			if(!is_uploaded_file($csv['tmp_name']))
			{
				$err=true;
				$err_info='ERROR_FILE_UPLOAD_ATTACK';
			}
			else
			{
				$s_csv=file_get_contents($csv['tmp_name']);
				$s_csv=addslashes($s_csv);
				try
				{
					$c_csv=new csv(true,NULL,$uid,$s_csv,get_os());
					$r_info=$c_csv->import_csv();
				}
				catch(Exception $e)
				{
					$err=true;
					$err_info=$e->getMessage();
				}
			}
		}
	}
} 
else 
{
	$err=true;
	$err_info='ERROR_NOT_LOGIN';
}

$r_info=array('is_error'=>$err,'error_info'=>$err_info,'cid'=>$r_info['cid'],'num_eles'=>$r_info['num_eles']);

header('Content-type: application/json');
echo json_encode($r_info);
?>