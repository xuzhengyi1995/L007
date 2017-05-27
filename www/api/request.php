<?php
class request
{
	private $request_url;
	private $request_method;
	private $post;
	private $get;
	private $accept;
	private $type;
	
	function __construct()
	{
		ini_set("allow_url_fopen", true);
		$this->request_url=split('/',$_GET['request']);
		$this->request_method=$_SERVER['REQUEST_METHOD'];
		$this->get=$_GET;
		$this->post=json_decode(file_get_contents("php://input"),true);
		
		$this->accept=$_SERVER['HTTP_ACCEPT'];
		$this->type=$_SERVER['CONTENT_TYPE'];
	}
	
	function get_url_array()
	{
		return $this->request_url;
	}
	
	function get_method()
	{
		return $this->request_method;
	}
	
	function get_get_info()
	{
		return $this->get;
	}
	
	function get_json_array()
	{
		return $this->post;
	}
	
	function get_type()
	{
		return $this->type;
	}
	
	function get_accept()
	{
		return $this->accept;
	}
}
?>