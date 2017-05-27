<?php
function set_xss()
{
	$key=md5(mcrypt_create_iv(20,MCRYPT_RAND));
	session_start();
	$_SESSION['xss']=$key;
	return $key;
}
?>