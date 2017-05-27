<?php

function get_sid_info($sid)
{
	include_once '../../PHP_www/person.php';
	$p=new c_student($sid);
	if($p->is_have())
	{
		return array('info'=>$p->get_info_array());
	}
	else
	{
		return array('info'=>NULL);
	}
}
?>