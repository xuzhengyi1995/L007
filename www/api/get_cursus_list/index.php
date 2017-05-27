<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

/*
{
	"fliter":true,
	"sid":null,
	"key":"nom",
	"data":"p"
}
{
	"fliter":true,
	"sid":[1,2,3],
	"key":null,
	"data":null
}
{
	"fliter":false,
	"sid":null,
	"key":null,
	"data":null
}

*/
/*if($in!='application/json')
{
	$err=true;
	$err_info="ERROR_ONLY_ACCEPT_JSON_FORMAT";
}
else
{*/
function get_cursus_list($data)
{
	include '../PHP_www/list_cursus.php';
	include_once '../PHP_www/Auth.php';
	if(!$data['fliter'])
	{
			$list=new list_cursus(logged_get_uid());
			$r_data=$list->get_basic_info();
	}
	else
	{
		if($data['sid']!=NULL||($data['key']!=NULL&&$data['data']!=NULL))
		{
			try
			{
				$list=new list_cursus(logged_get_uid(),$data['sid'],$data['key'],$data['data']);
				$r_data=$list->get_basic_info();
			}
			catch(Exception $e)
			{
				$err=true;
				$err_info=$e->getMessage();
			}
		}
		else
		{
			throw new Exception('ERROR_NO_ENOUGH_INFO',1);
		}
	}
	return array('is_error'=>false,'error_info'=>NULL,'data'=>$r_data);
}
?>