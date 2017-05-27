<?php
include_once './Auth.php';
include_once 'cursus.php';

class api_auth
{
	private $session;
	
	function __construct()
	{
		session_start();
		$this->session=$_SESSION;
	}
	
	public function login_check()
	{
		if ($this->session['logged_in']!="yes") 
		{
			throw new Exception('ERROR_NOT_LOGIN',1);
		}
	}
	
	public function xss_check($key)
	{
		$key_s=$this->session['xss'];
		if($key==$key_s)
		{
			return true;
		}
		else
		{
			throw new Exception("ERROR_XSS_ATTACK", 1);
		}
	}
	
	public function cid_check($cid)
	{
		$uid=$this->session['uid'];
		$cursus=new cursus(false,$cid);
		$c_uid=$cursus->get_uid();
			
		if(($this->session['type']!='staff')&&($c_uid!=$uid))
		{
			throw new Exception("ERROR_NO_AUTH",1);
		}
	}
	
}