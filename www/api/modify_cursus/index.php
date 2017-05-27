<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

/*
****Add/Copy a ele/cursus:
method:POST
{
	"key":key,//get from /api/get_key/
	"method":"add"/"copy",//Will be ignore if the res is ele.
	////////////////////////////////////////////////////////////////"res":"ele"/"cursus",
	"cid":1,//use in add ele/copy cursus
	data://Just use in add
	{
		's_seq','s_label','sigle','categorie','affectation','utt','profil','credit','resultat'//element
		'sid','nom','prenom','admission','filiere','type'//cursus
	}
}

****Delete a ele/cursus:
method:DELETE
{
	"key":key,//get from /api/get_key/
	"res":"ele"/"cursus",
	"cid":1/Array(1),
	"eid":Array(1)
}

****Modify a ele:
method:PUT
{
	"key":key,//get from /api/get_key/
	"cid":1,
	data:
	{
		'eid','s_seq','s_label','sigle','categorie','affectation','utt','profil','credit','resultat'//element
	}
}
*/
class modify
{
	private $http_method;
	private $data=array();
	private $uid;

	private $cursus;
	private static $attri=array('s_seq','s_label','sigle','categorie','affectation','utt','profil','credit','resultat');

	function __construct($_s_data)
	{
		include_once '../PHP_www/cursus.php';
		include_once '../PHP_www/Auth.php';
		include_once '../PHP_www/person.php';
		$this->data=$_s_data;
		$this->uid=logged_get_uid();
	}

	//New a cursus
	public function check_uid()
	{
		$this->cursus=new cursus(false,$this->data['cid']);
		$this->cursus->do_can_write();
	}

	//Add a cursus
	public function add_cursus()
	{
		if(!isset($this->data['data']))
		{
			throw new Exception('ERROR_NO_ENOUGH_INFO');
		}
		$data=$this->data['data'];

		$c_st=new c_student($data['sid']);
		if(!$c_st->is_have())
		{
			if(!isset($data['nom'])||!isset($data['prenom'])||$data['nom']==''||$data['prenom']=='')
			{
				throw new Exception("ERROR_NO_STUDENT_INFORMATION", 1);
			}
		  $c_st->insert_new_student($data['nom'],$data['prenom'],$data['admission'],$data['filiere']);
		}
		$this->cursus=new cursus(true);
		$this->cursus->add_cursus($this->uid,$c_st->get_p_sid(),$data['type']);
		return true;
	}

	//Add a element
	public function add_ele()
	{
		$this->check_uid();
		if(!isset($this->data['data']))
		{
			throw new Exception('ERROR_NO_ENOUGH_INFO');
		}
		$data=$this->data['data'];

		for($i=0;$i<count(self::$attri);$i++)
		{
		  $atb=self::$attri[$i];
		  $ele_data["$atb"]=$data["$atb"];
		}
		$this->cursus->write_one_element($ele_data);
		return true;
	}

	//Copy a cursus
	public function copy_cursus()
	{
		$this->check_uid();
		$this->cursus->copy_cursus();
		return true;
	}

	//Delete a element
	public function delete_ele()
	{
		$this->check_uid();
		for($i=0;$i<count($this->data['eid']);$i++)
		{
			$this->cursus->delete_element($this->data['eid'][$i]);
		}
		return true;
	}

	//Delete a cursus
	public function delete_cursus()
	{
		$this->check_uid();
		$this->cursus->delete_cursus();
		return true;

	}

	//Modify a element
	public function update_ele()
	{
		$this->check_uid();
		if(!isset($this->data['data']))
		{
			throw new Exception('ERROR_NO_ENOUGH_INFO');
		}
		$data=$this->data['data'];
		
		for($i=0;$i<count(self::$attri);$i++)
		{
		  $atb=self::$attri[$i];
		  $ele_data["$atb"]=$data["$atb"];
		}
		$ele_data['eid']=$data['eid'];
		$this->cursus->modify_cursus($ele_data);
		return true;
	}

	//Router
	/*private function router()
	{
		if($this->http_method=='POST')
		{
			if($this->data['method']=='add')
			{
				if($this->data['res']=='ele')
				{
					$this->add_ele();
				}
				else
				{
					if($this->data['res']=='cursus')
					{
						$this->add_cursus();
					}
					else
					{
						$this->err=true;
						$this->err_info='ERROR_UNKNOW_RES';
					}
				}
			}
			else
			{
				if($this->data['method']=='copy')
				{
					if($this->data['res']=='cursus')
					{
						$this->copy_cursus();
					}
					else
					{
						$this->err=true;
						$this->err_info='ERROR_UNKNOW_RES';
					}
				}
				else
				{
					$this->err=true;
					$this->err_info='ERROR_UNKNOW_METHOD';
				}
			}
		}
		else
		{
			if($this->http_method=='DELETE')
			{
				if($this->data['res']=='cursus')
				{
					$this->delete_cursus();
				}
				else
				{
					if($this->data['res']=='ele')
					{
						$this->delete_ele();
					}
					else
					{
						$this->err=true;
						$this->err_info='ERROR_UNKNOW_RES';
					}
				}
			}
			else
			{
				if($this->http_method=='PUT')
				{
					$this->update_ele();
				}
				else
				{
					$this->err=true;
					$this->err_info='ERROR_UNKNOW_HTTP_METHOD';
				}
			}
		}
	}*/
}
?>
