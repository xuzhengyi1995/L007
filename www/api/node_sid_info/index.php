<?php
function get_session_info($sid)
{
	if(session_id())
	{
		session_destroy();
	}
	
	session_id($sid);
	session_start();
	
	return json_encode($_SESSION);
}

if($_GET['key']=='95aaf2c69f504de629bbdca0235bf881e9e4f3c7f6f2f343cef6142e2e671310c5c9e98c28c35dbd6252986efcd360d18e50989f8fcefcb83f05c544d3a06724')
{
	header('Content-Type:application/json');
	echo get_session_info($_GET['sid']);
}
else
{
	header('Content-Type:application/json');
	echo json_encode(array("is_error"=>true,"error_info"=>"ERROR_NO_AUTH"));
}
?>