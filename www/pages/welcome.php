<?php
include_once '../PHP_www/Auth.php';

if(User_logged_in())
{
	if (logged_get_type()=='staff') 
	{
		$p=file_get_contents("./staff_welcome.html");
	}
	else
	{
		$p=file_get_contents("./tables.html");
	}
}
else
{
	$p=file_get_contents("./w_nologin.html");
}
echo $p;
?>
