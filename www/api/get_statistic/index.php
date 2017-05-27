<?php


function get_statistic($cid,$type)
{
	include_once '../PHP_www/cursus.php';
	include_once '../PHP_www/Auth.php';
	$point=array('A'=>5,'B'=>4,'C'=>3,'D'=>2,'E'=>1);
	
	$cursus=new cursus(false,$cid);

	$ele=$cursus->get_element(false);
	$s=count($ele);
	$p=array();
	$sum=array();
	$sum_avg=array();
	for($i=0;$i<$s;$i++)
	{
		if(array_key_exists($ele[$i]['resultat'],$point))
		{
			$p[$ele[$i]['s_seq']-1]+=$point[$ele[$i]['resultat']]*$ele[$i]['credit'];
			$sum_avg[$ele[$i]['s_seq']-1]+=$ele[$i]['credit'];
		}
		else
		{
			$p[$ele[$i]['s_seq']-1]+=0;
		}
		$sum[$ele[$i]['s_seq']-1]+=$ele[$i]['credit'];
	}
	$r_data=array();
	$sum_data=array();
	for($i=0;$i<count($p);$i++)
	{
		$lab=$i+1;
		$r_data[$i]=array("x"=>"ISI".$lab,"y"=>number_format($p[$i]/$sum_avg[$i],2));
		$sum_data[$i]=array("x"=>"ISI".$lab,"y"=>$sum[$i]);
	}
	
	if($type=="all")
	{
		return array('is_error'=>false,'error_info'=>NULL,'cid'=>$cid,'avg'=>$r_data,'sum'=>$sum_data);
	}
	if($type=="avg")
	{
		return array('is_error'=>false,'error_info'=>NULL,'cid'=>$cid,'avg'=>$r_data);
	}
	if($type=="sum")
	{
		return array('is_error'=>false,'error_info'=>NULL,'cid'=>$cid,'sum'=>$sum_data);
	}
	throw new Exception('ERROR_UNKNOW_PARAM');
}