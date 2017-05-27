<?php
//csv class
include_once 'cursus.php';
include_once 'db.php';
include_once 'Auth.php';
class csv
{
  private static $attri=array('s_seq','s_label','sigle','categorie','affectation','utt','profil','credit','resultat');
  private $_enter=array('mac'=>"\r",'linux'=>"\n",'win'=>"\r\n");
  private $_delimiter=';';
  private $_os;

  private $_cid;
  private $_uid;
  private $_sid;
  private $_type;
  private $_import_csv;
  private $_csv;
  private $_cursus;
  private $_error=false;
  private $_error_info;

  //PARAM:import_csv:Boolean;true,import into the database;false,get a csv by cid
  //PARAM:cid:Int;cursus id
  //PARAM:file_csv:String;csv file
  function __construct($import_csv=false,$cid=NULL,$uid,$string_csv=NULL,$os='mac',$delimiter=';')
  {
    $this->_os=$os;
    $this->_delimiter=$delimiter;
    $this->_uid=$uid;

    if(!$import_csv)
    {
      if($cid==NULL)
      {
        throw new Exception("ERROR_NO_CID", 1);
      }
      $this->_cid=$cid;
      $this->_import_csv=false;
      $this->get_info();
      if(!$this->check_auth())
      {
        throw new Exception("ERROR_CANT_GET_THIS_CID", 1);
      }
    }
    else
    {
      $this->_import_csv=true;
      $this->_csv=$string_csv;
      $this->_cursus=new cursus(true);
    }
  }

  //Check auth.
  private function check_auth()
  {
	  if(logged_get_type()=='staff'||logged_get_type()=='admin')
	  {
		  return true;
	  }
	  if($this->_uid!=$this->_cursus->get_uid())
	  {
		  return false;
	  }
	  return true;
  }

  private function get_info()
  {
    $this->_cursus=new cursus(false,$this->_cid);
  }

  //csv student infomation.
  private function get_csv_student()
  {
    $student=$this->_cursus->get_student();
    $data='';

    $data.='ID;'.$student->get_p_sid().";;;;;;;;\r";
    $data.='NO;'.$student->get_p_nom().";;;;;;;;\r";
    $data.='PR;'.$student->get_p_prenom().";;;;;;;;\r";
    $data.='AD;'.$student->get_p_admission().";;;;;;;;\r";
    $data.='FI;'.$student->get_p_filiere().";;;;;;;;\r";
    return $data;
  }

  //csv all element.
  private function get_csv_all_ele()
  {
    $arr=$this->_cursus->get_element();
    $data='';
    for($i=0;$i<count($arr);$i++)
    {
      $data.='EL';
      for($j=0;$j<count(self::$attri);$j++)
      {
        $att=self::$attri[$j];
        $str=$arr[$i]["$att"];
        $data.=";$str";
      }
      $data.="\r";
    }
    return $data;
  }

  //write a csv to client
  public function get_csv()
  {
    $csv_data='';
    $csv_data.=$this->get_csv_student();
    $csv_data.="===;s_seq;s_label;sigle;categorie;affectation;utt;profil;credit;resultat\r";
    $csv_data.=$this->get_csv_all_ele();
    $csv_data.="END;;;;;;;;;";

    if($this->_os!='mac')
    {
      $enter=$this->_enter["$this->_os"];
      $csv_data=str_replace("\r","$enter",$csv_data);
    }
    if($this->_delimiter!=';')
    {
      $csv_data=str_replace(";","$this->_delimiter",$csv_data);
    }

    header('Content-type: application/csv');
    header("Content-Disposition: attachment; filename=\"csv_$this->_cid.csv\"");
    echo $csv_data;
  }

  //import a csv
  //RETURN:array('cid'=>"$this->_cid",'num_eles'=>"$num")
  public function import_csv()
  {
    if(!$this->_import_csv) {throw new Exception("ERROR_CANT_WRITE", 1);}

    $preg="/[\r,\n,\r\n,$this->_delimiter]+/";
    $data=preg_split("$preg",$this->_csv);

    $i=0;
    $j=0;
    $student=array();
    $eles=array();
    while($data[$i]!='END'&&$i<=count($data))
    {
      switch ($data[$i])
      {
        case 'ID':
          $student['sid']=$data[++$i];
          break;
        case 'NO':
          $student['nom']=$data[++$i];
          break;
        case 'PR':
          $student['prenom']=$data[++$i];
          break;
        case 'AD':
          $student['admission']=$data[++$i];
          break;
        case 'FI':
          $student['filiere']=$data[++$i];
          break;
        case 'EL':
          for($k=0;$k<count(self::$attri);$k++)
          {
            $att=self::$attri[$k];
            $eles[$j]["$att"]=$data[++$i];
          }
          $j++;
          break;
      }
      $i++;
    }

    if($data[$i]!='END'||$j==0)
    {
      throw new Exception("ERROR_CSV_FORMAT_ERROR", 1);
    }

    $c_st=new c_student($student['sid']);
    if(!$c_st->is_have())
    {
      $c_st->insert_new_student($student['nom'],$student['prenom'],$student['admission'],$student['filiere']);
    }

    $this->_cid=$this->_cursus->add_cursus($this->_uid,$student['sid'],$student['admission']);
    $num=$this->_cursus->write_many_elements($eles);

    $result=array('cid'=>"$this->_cid",'num_eles'=>"$num");
    return $result;
  }
}
?>
