<?php
//Person like student or teacher but not user
include_once 'db.php';
abstract class person
{
  protected $_sid;
  protected $_nom;
  protected $_prenom;
  protected $_db;

  //give a sid or insert a new person into the database then keep sid null
  function __construct($sid=NULL)
  {
    $this->_db=new db();
    $this->_sid=$sid;
    if(($sid!=NULL)&&($this->is_have()))
    {
      $this->get_p_info();
    }
  }

  public function get_p_nom()
  {
    return $this->_nom;
  }

  public function get_p_prenom()
  {
    return $this->_prenom;
  }

  public function get_p_sid()
  {
    return $this->_sid;
  }

  protected function set_p_nom($_pnom)
  {
    $this->_nom=$_pnom;
  }

  protected function set_p_prenom($_pprenom)
  {
    $this->_prenom=$_pprenom;
  }

  protected function set_p_sid($_psid)
  {
    $this->_sid=$_psid;
  }

  //get user info
  abstract protected function get_p_info();
  //uid already in database?
  abstract public function is_have();
  //return a array('uid'=>{uid},'nom'=>{nom},'prenom'=>{prenom}...)
  abstract public function get_info_array();

}

class c_student extends person
{
  private $_admission;
  private $_filiere;

  protected function get_p_info()
  {
    $sql="SELECT * FROM `student` WHERE `sid`='$this->_sid'";
    if(!$this->is_have())
    {
      throw new Exception("ERROR_CANT_FIND_STUDENT", 1);
    }

    $arr=$this->_db->get_one_arry();
    $this->set_p_nom($arr['nom']);
    $this->set_p_prenom($arr['prenom']);
    $this->_admission=$arr['admission'];
    $this->_filiere=$arr['filiere'];
  }

  public function is_have()
  {
    $sql="SELECT * FROM `student` WHERE `sid`='$this->_sid'";
    if($this->_db->get_num_sql($sql)==0)
    {
      return false;
    }
    return true;
  }

  public function search_by_X($by,$nom)
  {
    $sql="SELECT `sid` FROM `student` WHERE `$by` LIKE '%$nom%'";
    if($this->_db->get_num_sql($sql)==0)
    {
      throw new Exception("ERROR_SEARCH_NO_RESULT", 1);
    }
    $result=$this->_db->get_array_sql();
    $r=array();
    $i=0;
    while($data=mysql_fetch_array($result))
    {
      $r[$i++]=$data['sid'];
    }
    return $r;
  }

  public function get_p_admission()
  {
    return $this->_admission;
  }

  public function get_p_filiere()
  {
    return $this->_filiere;
  }

  public function get_info_array()
  {
    return array('sid'=>$this->get_p_sid(),'nom'=>$this->get_p_nom(),'prenom'=>$this->get_p_prenom(),'admission'=>$this->get_p_admission(),'filiere'=>$this->get_p_filiere());
  }

  public function insert_new_student($_nom,$_prenom,$_admission,$_filiere)
  {
    if(($this->_sid!=NULL))
    {
      if($this->is_have()) { throw new Exception("ERROR_SID_ALREADY_HAVE", 1);}
      $sql="INSERT INTO `student` (`sid`,`nom`,`prenom`,`admission`,`filiere`) VALUES ('$this->_sid','$_nom','$_prenom','$_admission','$_filiere')";
    }
    else
    {
      $sql="INSERT INTO `student` (`nom`,`prenom`,`admission`,`filiere`) VALUES ('$_nom','$_prenom','$_admission','$_filiere')";
    }
    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_CREAT_STUDENT_FAILED", 1);
    }
    else
    {
      if($this->_sid==NULL) {$this->set_p_sid($this->_db->get_last_id());}
      $this->get_p_info();
    }
  }
}

class c_staff extends person
{
  private $_appartment;

  protected function get_p_info()
  {
    $sql="SELECT * FROM `staff` WHERE `sid`='$this->_sid'";
    if($this->_db->get_num_sql($sql)==0)
    {
      throw new Exception("ERROR_CANT_FIND_STUDENT", 1);
    }

    $arr=$this->_db->get_one_arry();
    $this->set_p_nom($arr['nom']);
    $this->set_p_prenom($arr['prenom']);
    $this->_appartment=$arr['appartment'];
  }

  public function is_have()
  {
    $sql="SELECT * FROM `staff` WHERE `sid`='$this->_sid'";
    if($this->_db->get_num_sql($sql)==0)
    {
      return false;
    }
    return true;
  }

  public function get_p_appartment()
  {
    return $this->_appartment;
  }

  public function get_info_array()
  {
    return array('uid'=>$this->get_p_sid(),'nom'=>$this->get_p_nom(),'prenom'=>$this->get_p_prenom(),'appartment'=>$this->get_p_appartment());
  }

  public function insert_new_staff($_nom,$_prenom,$_appartment)
  {
    $sql="INSERT INTO `staff` (`nom`,`prenom`,`appartment`) VALUES ('$_nom','$_prenom','$_appartment')";
    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_CREAT_STUDENT_FAILED", 1);
    }
    else
    {
      $this->set_p_sid($this->_db->get_last_id());
      $this->get_p_info();
    }
  }
}
?>
