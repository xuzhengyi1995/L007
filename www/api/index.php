<?php
include_once 'request.php';
include_once '../PHP_www/api_auth.php';
include_once './get_cursus_list/index.php';
include_once './modify_cursus/index.php';
include_once './get_one_cursus_detail/index.php';
include_once './get_statistic/index.php';
include_once './export_csv/index.php';
include_once './get_ele/index.php';
include_once './get_sid_info/index.php';
include_once './set_sid/index.php';
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

class api
{
	private $req;
	private $auth;
	private $r_data;
	
	function __construct()
	{
		$this->req=new request();
		$this->auth=new api_auth();
	}
	
	private function check_content_type()
	{
		if($this->req->get_type()!='application/json')
		{
			throw new Exception("ERROR_ONLY_ACCEPT_JSON_FORMAT");
		}
	}
	
	private function router()
	{
		$f=$this->req->get_url_array();
		$m=$this->req->get_method();
		$data=$this->req->get_json_array();
		$l=count($f);

		if($l>4)
		{
			throw new Exception('ERROR_TOO_MANY_PARAMS',1);
		}
		if($f[0]=='cursus')
		{
			if($l==1)
			{
				if($m=='GET')
				{
					$param=array("fliter"=>false,"sid"=>NULL,"key"=>NULL,"data"=>NULL);
					$this->r_data=get_cursus_list($param);
				}
				else
				{
					if($m=='POST')
					{
						$this->auth->xss_check($data['key']);
						$this->check_content_type();
						$modify=new modify($data);
						
						if($data['method']=='add')
						{
							$modify->add_cursus();
							$this->r_data=array('is_error'=>false,'error_info'=>NULL);
						}
						else
						{
							if($data['method']=='copy')
							{
								$modify->copy_cursus();
								$this->r_data=array('is_error'=>false,'error_info'=>NULL);
							}
							else
							{
								throw new Exception('ERROR_UNKNOW_METHOD');
							}
						}
					}
					else
					{
						throw new Exception('ERROR_UNKNOW_METHOD');
					}
				}
			}
			//length=1
			
			if($l==2)
			{
				$cid=$f[1];
				$this->auth->cid_check($cid);
				
				if($m=='GET')
				{
					$this->r_data=get_one_cursus_detail($cid);
				}
				else
				{
					$this->auth->xss_check($data['key']);
					$this->check_content_type();
					if($m=='POST')
					{
						$data['cid']=$cid;
						$modify=new modify($data);
						$modify->add_ele($data);
						$this->r_data=array('is_error'=>false,'error_info'=>NULL);
					}
					else
					{
						if($m=='DELETE')
						{
							$data['cid']=$cid;
							$modify=new modify($data);
							$modify->delete_cursus();	
							$this->r_data=array('is_error'=>false,'error_info'=>NULL);	
						}
						else
						{
							throw new Exception('ERROR_UNKNOW_METHOD');
						}
					}
				}
			}
			//length=2
			
			if($l==3)
			{
				if($m=='GET')
				{
					$search=$f[1];
					if($search=='sid'||$search=='nom'||$search=='prenom'||$search=='sid'||$search=='admission'||$search=='filiere')
					{
						if($search=='sid')
						{
							$param=array("fliter"=>true,"sid"=>array(0=>$f[2]),"key"=>NULL,"data"=>NULL);
						}
						else
						{
							$param=array("fliter"=>true,"sid"=>NULL,"key"=>$search,"data"=>$f[2]);
						}
						$this->r_data=get_cursus_list($param);
					}
					else
					{
						$cid=$f[1];
						$this->auth->cid_check($cid);
						if($f[2]=='statistic')
						{
							$this->r_data=get_statistic($cid,"all");
						}
						else
						{
							if($f[2]=='csv')
							{
								export_csv($cid);
								$this->r_data=false;
							}
							else
							{
								$eid=$f[2];
								$data=array('cid'=>$cid,'eid'=>split(',',$eid));
								$this->r_data=get_ele($data);
							}
						}
					}
				}
				//get
				else
				{
					$eid=$f[2];
					$cid=$f[1];
					$this->auth->xss_check($data['key']);
					$this->check_content_type();
					$this->auth->cid_check($cid);
					
					$data['cid']=$cid;
					
					
					if($m=='PUT')
					{
						$data['data']['eid']=$eid;
						$modify=new modify($data);
						$modify->update_ele();
						$this->r_data=array('is_error'=>false,'error_info'=>NULL);
					}
					else
					{
						if($m=='DELETE')
						{
							$data['eid']=split(',',$eid);
							$modify=new modify($data);
							$modify->delete_ele();
							$this->r_data=array('is_error'=>false,'error_info'=>NULL);
						}
						else
						{
							throw new Exception('ERROR_UNKNOW_METHOD');
						}
					}
				}
			}
				//length=3
			if($l==4)
			{
				if($m=='GET')
				{
					$cid=$f[1];
					$this->auth->cid_check($cid);
					if($f[2]=='statistic')
					{
						$this->r_data=get_statistic($cid,$f[3]);
					}
					else
					{
						throw new Exception('ERROR_UNKNOW_METHOD');
					}
				}
			}
			//length=4
		}
		else
		{
			if($f[0]=='student')
			{
				if($l=2)
				{
					$this->r_data=get_sid_info($f[1]);
				}
			}
			else
			{
				if($f[0]=='user')
				{
					if($m=='GET')
					{
						session_start();
						$this->r_data=$_SESSION;
						unset($this->r_data['xss']);
						unset($this->r_data['logged_in']);
					}
					else
					{
						if($m=='PUT')
						{
							$this->auth->xss_check($data['key']);
							set_sid($data);
							$this->r_data=array('is_error'=>false,'error_info'=>NULL);
						}
						else			
						{
							throw new Exception('ERROR_UNKNOW_METHOD');
						}
					}
				}
				else			
				{
					throw new Exception('ERROR_UNKNOW_PARAM');
				}
			}

		}
	}
	
	public function run()
	{
		try
		{
			$this->auth->login_check();
			$this->router();
		}
		catch(Exception $e)
		{
			$this->r_data=array('is_error'=>true,'error_info'=>$e->getMessage());
			//echo $e->getTraceAsString();
		}
		
		if($this->r_data)
		{
			header('Content-type: application/json');
			echo json_encode($this->r_data);
		}
	}
}

$r=new api();
$r->run();

?>