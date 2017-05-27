<?php

//error_reporting(E_ALL);
//ini_set('display_errors', '1');


/*
{
	"cid":1,
	"eid":2
}
*/

function get_ele($data)
{
	include_once '../PHP_www/cursus.php';
	include_once '../PHP_www/Auth.php';
	$cursus=new cursus(false,$data['cid']);

	$eles=$cursus->get_element(true);
	if(is_array($data['eid']))
	{
		$s=0;
		for($i=0;$i<count($eles);$i++)
		{
			for($j=0;$j<count($data['eid']);$j++)
			{
				if($eles[$i]['eid']==$data['eid'][$j])
				{
					$r[$s++]=$eles[$i];
					break;
				}
			}
		}	
	}
	else
	{
		for($i=0;$i<count($eles);$i++)
		{
			if($eles[$i]['eid']==$data['eid'])
			{
				$r=$eles[$i];
				break;
			}
		}	
	}
	
	$r_data=$r;
	return array('is_error'=>false,'error_info'=>NULL,"elem"=>$r_data);
}



?>