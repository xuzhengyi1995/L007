<?php
include_once 'db.php';
include_once 'Auth.php';
include_once 'person.php';
include_once 'cursus.php';

class list_cursus
{
  private $_uid;
  private $_db;
  private $_sid_list=array();
  private $_list=array();
  private $_num=0;
  private $where='';

  //We can search by user's 'nom','prenom','admission','filiere'/sid=array(1,2,3...)
  function __construct($uid,$sid=NULL,$by=NULL,$by_data=NULL)
  {
    $this->_uid=$uid;
    if(!User_logged_in())
    {
      throw new Exception("ERROR_NOT_LOGIN", 1);
    }
    if((logged_get_uid()!=$this->_uid))
    {
      throw new Exception("ERROR_UID_NOT_MATCH", 1);
    }
    if(logged_get_type()=='student')
    {
      $this->where='WHERE ';
      $this->where.="(`uid`=$this->_uid) ";
    }
    else
    {
      $this->where='';
    }

    if(($sid==NULL)&&($by!=NULL)&&($by_data!=NULL))
    {
      $s=new c_student();
      $this->_sid_list=$s->search_by_X($by,$by_data);
      $this->add_sid();
    }
    else
    {
      if($sid!=NULL)
      {
        $this->_sid_list=$sid;
        $this->add_sid();
      }
    }

    $this->_db=new db();
    $this->read_list();
  }

  private function add_sid()
  {
    if($this->where=='')
    {
      $this->where='WHERE (';
    }
    else
    {
      $this->where.='AND (';
    }
    $sum=count($this->_sid_list);
    if($sum<=0)
    {
      throw new Exception("ERROR_WRONG_PARAM", 1);
    }
    $l=$this->_sid_list;
    for($i=0;$i<$sum;$i++)
    {
      $this->where.="(`sid`='$l[$i]') ";
      if($i!=$sum-1)
      {
        $this->where.='OR ';
      }
    }
    $this->where.=')';
  }

  private function read_list()
  {
    $sql="SELECT `cid`,`type` FROM `cursus` $this->where";
    $result=$this->_db->get_array_sql($sql);
    while($data=mysql_fetch_array($result))
    {
      $this->_list[$this->_num++]=array('cid'=>$data['cid'],'type'=>$data['type']);
    }
  }

  public function get_list()
  {
    return $this->_list;
  }

  public function get_all_info()
  {
    $r_info=array();
    $sum=count($this->_list);
    for($i=0;$i<$sum;$i++)
    {
      $cursus=new cursus(false,$this->_list[$i]['cid']);
      $r_info["$i"]['cid']=$this->_list[$i]['cid'];
      $r_info["$i"]['student']=$cursus->get_student()->get_info_array();
      $r_info["$i"]['eles_cursus']=$cursus->get_element();
    }
    return $r_info;
  }

  public function get_basic_info()
  {
    $r_info=array();
    $sum=count($this->_list);
    for($i=0;$i<$sum;$i++)
    {
      $cursus=new cursus(false,$this->_list[$i]['cid']);
      $r_info["$i"]['cid']=$this->_list[$i]['cid'];
      $r_info["$i"]['type']=$this->_list[$i]['type'];
      $r_info["$i"]['student']=$cursus->get_student()->get_info_array();
    }
    return $r_info;
  }
}
?>
