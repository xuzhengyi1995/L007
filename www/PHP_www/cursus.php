<?php
//class cursus
include_once 'db.php';
include_once 'person.php';
class cursus
{
  private static $attri=array('s_seq','s_label','sigle','categorie','affectation','utt','profil','credit','resultat');
  private $_cid;
  private $_uid;
  private $_sid;
  private $_type;
  private $_student;
  private $_all_ele=NULL;
  private $_new_c;
  private $_db;

  function __construct($new_c=false,$cid=NULL)
  {
    $this->_db=new db();
    if(!$new_c)
    {
      $this->_cid=$cid;
      $this->get_info();
    }
    else
    {
      $this->_new_c=true;
    }
  }

  private function get_info()
  {
    if($this->_cid!=NULL)
    {
      $sql="SELECT * FROM `cursus` WHERE cid='$this->_cid' LIMIT 1";
      $arr=$this->_db->get_one_arry($sql);
      if($this->_db->get_num_sql()!=0)
      {
        $this->_uid=$arr['uid'];
        $this->_sid=$arr['sid'];
        $this->_type=$arr['type'];
        $this->_student=new c_student($this->_sid);
      }
      else
      {
        throw new Exception("ERROR_CANT_FIND_CID", 1);
      }
    }
  }

  //get cursus uid
  public function get_uid()
  {
    return $this->_uid;
  }

  //get the student information
  public function get_student()
  {
    return $this->_student;
  }

  //Make this cursus can be write
  public function do_can_write()
  {
    $this->_new_c=true;
  }

  //get all the element of this cursus,RETURN:array[n]['...']
  public function get_element($g_eid=false)
  {
    if($this->_all_ele==NULL)
    {
      $all_ele=array();
      $sql="SELECT * FROM `elm_cursus` WHERE `cid`='$this->_cid'";
      $res=$this->_db->get_array_sql($sql);
      $sum=0;
      while($line=mysql_fetch_array($res))
      {
        if($g_eid)
        {
          $all_ele[$sum]['eid']=$line['eid'];
        }

        for($i=0;$i<count(self::$attri);$i++)
        {
          $atb=self::$attri[$i];
          $all_ele[$sum]["$atb"]=$line["$atb"];
        }
        $sum++;
      }
      $this->_all_ele=$all_ele;
    }
    return $this->_all_ele;
  }

  //write a element in to the database, PARAM:array['']
  public function write_one_element($arr)
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}
    $sql="INSERT INTO `elm_cursus` (`cid`,`s_seq`,`s_label`,`sigle`,`categorie`,`affectation`,`utt`,`profil`,`credit`,`resultat`) VALUES ('$this->_cid'";
    for($i=0;$i<count(self::$attri);$i++)
    {
      $atb=self::$attri[$i];
      $sql.=",'".$arr["$atb"]."'";
    }
    $sql.=')';
    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_ADD_ELEMENT", 1);
    }
  }

  //write many element, PARAM:array[n]['...']
  public function write_many_elements($arr)
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}
    for($i=0;$i<count($arr);$i++)
    {
      $this->write_one_element($arr[$i]);
    }
    return $i;
  }

  //Check is a $eid is beyond to this cursus
  private function check_ele($eid)
  {
    $sql="SELECT `cid` FROM `elm_cursus` WHERE `eid`='$eid'";
    $e_cid=$this->_db->get_one('cid',$sql);
    if($e_cid=='')
    {
      throw new Exception("ERROR_CANT_FIND_EID", 1);
    }
    if($e_cid!=$this->_cid)
    {
      throw new Exception("ERROR_EID_CANT_DELETE", 1);
    }

    return true;
  }

  //Delete a element in the cursus, PARAM:$eid
  public function delete_element($eid)
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}

    $this->check_ele($eid);

    $sql="DELETE FROM `elm_cursus` WHERE `eid`='$eid'";
    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_DATA_BASE_ERROR", 1);
    }
    return true;
  }

  //Delete a cursus
  public function delete_cursus()
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}

    $this->get_element(true);
    for($i=0;$i<count($this->_all_ele);$i++)
    {
      $temp=$this->_all_ele[$i];
      $this->delete_element($temp['eid']);
    }
    $cid=$this->_cid;
    $sql="DELETE FROM `cursus` WHERE `cid`='$cid'";
    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_DATA_BASE_ERROR", 1);
    }
    return true;
  }

  //Copy a cursus
  public function copy_cursus()
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}
    $this->get_element(false);
    $this->add_cursus($this->_uid,$this->_sid,$this->_type);
    $this->write_many_elements($this->_all_ele);
    return true;
  }

  //Modify a element, PARAM:array['']
  public function modify_cursus($modify)
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}

    $this->check_ele($modify['eid']);

    $sql="UPDATE `elm_cursus` SET ";
    for($i=0;$i<count(self::$attri);$i++)
    {
      $atb=self::$attri[$i];
      $sql.="`$atb`="."'".$modify["$atb"]."'";
      if($i<count(self::$attri)-1)
      {
        $sql.=",";
      }
    }
    $sql.=" WHERE `eid`=".$modify['eid'];

    if(!$this->_db->insert_update_sql($sql))
    {
      throw new Exception("ERROR_DATA_BASE_ERROR", 1);
    }
    return true;
  }

  //add a new cursus into the database
  public function add_cursus($uid,$sid,$type)
  {
    if(!$this->_new_c) {throw new Exception("ERROR_CANT_WRITE", 1);}
    $sql="INSERT INTO `cursus` (`uid`,`sid`,`type`) VALUES ('$uid','$sid','$type')";
    if(!$this->_db->insert_update_sql($sql))
    {
        throw new Exception("ERROR_ADD_CURSUS", 1);
    }
    $this->_cid=$this->_db->get_last_id();
    $this->get_info();
    return $this->_cid;
  }
}
?>
