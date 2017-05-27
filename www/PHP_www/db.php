<?php
class db
{
  private $_host='192.168.1.29';
  private $_user='root';
  private $_password='123456';
  private $_db_name='LO07';
  private $_con;
  private $_debug;
  private $_result;
  private $_last_id;

  //debug or not.
  function __consturuct($debug=false)
  {
    $this->_debug=$debug;
  }

  //Connect the database and set the character set to utf8.
  private function connect()
  {
    $this->_con=mysql_connect($this->_host,$this->_user,$this->_password);
    if ((!$this->_con)&&($this->_debug))
    {
      die('Error with connect database:'.mysql_error());
    }
    mysql_query("set character set 'utf8'",$this->_con);
    mysql_query("set names 'utf8'",$this->_con);
    mysql_select_db($this->_db_name,$this->_con);
  }

  //Run a sql query
  private function _run_sql($sql)
  {
    $this->connect();
    if($sql!=NULL)
    {
      $this->_result=mysql_query($sql,$this->_con);
      if(!$this->_result)
      {
        throw new Exception("ERROR_SQL", 1);
      }
      $id=mysql_fetch_array(mysql_query('SELECT LAST_INSERT_ID()',$this->_con));
      $this->_last_id=$id['LAST_INSERT_ID()'];
      return true;
    }
    else
    {
      return false;
    }
  }

  public function get_last_id()
  {
    return $this->_last_id;
  }

  //Get array of a result of a sql query.
  public function get_array_sql($sql=NULL)
  {
    if($sql!=NULL)
    {
      $this->_run_sql($sql);
    }
    return $this->_result;
  }

  //Get the number of result of a sql query.
  public function get_num_sql($sql=NULL)
  {
    if($sql!=NULL)
    {
      $this->_run_sql($sql);
    }
    return mysql_num_rows($this->_result);
  }

  //Get one line of the result.
  public function get_one_arry($sql=NULL)
  {
    if($sql!=NULL)
    {
      $this->_run_sql($sql);
    }
    return mysql_fetch_array($this->_result);
  }

  //Get the only one thing from the result.
  public function get_one($attri,$sql=NULL)
  {
    $arr=$this->get_one_arry($sql);
    return $arr["$attri"];
  }

  //Insert or update
  public function insert_update_sql($sql)
  {
    if($this->_run_sql($sql))
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
?>
