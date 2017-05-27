<?php
include_once 'db.php';
abstract class Abstract_auth
{
  protected $_uid;
  protected $_username;
  protected $_email;
  protected $_db_password;//password in db
  protected $_password;//sha512($original_password)
  protected $_salt;
  protected $_role;
  protected $_sid;
  protected $_db;
  protected $_is_new_user;
  protected $_error=false;
  protected $_error_info;

  //construct function
  function __construct($password,$email=NULL,$is_new_user=false,$uid=NULL,$username=NULL,$role=NULL,&$db=NULL)
  {
    if ($db==NULL)
    {
      $this->_db = new db(false);
    }
    else
    {
      $this->_db=$db;
    }

    $this->_username=$username;
    $this->_email=$email;
    $this->_is_new_user=$is_new_user;
    $this->_password=$password;
    $this->_role=$role;

    if ($is_new_user)
    {
      //DONE:When we finished the db class, we must find in the database all the infomation of the user like the salt/role, use like $db->Find_salt_by_email($_email)/$db->Find_role_by_email($_email);
      if($this->is_email_already_have())
      {
        $this->_error=true;
        $this->_error_info='ERROR_EMAIL_ALREADY_HAVE';
      }
    }
    else
    {
      if($uid==NULL&&$email==NULL)
      {
        $this->_error=true;
        $this->_error_info='ERROR_NO_ENOUGH_INFO';
      }
      else
      {
        if ($uid!=NULL)
        {
          $this->_uid=$uid;
          if(!$this->is_uid_already_have())
          {
            $this->_error=true;
            $this->_error_info='ERROR_CANT_FIND_USER';
          }
          else
          {
            $this->read_user_info();
          }
        }
        else
        {
          if($this->_email!=NULL)
          {
            if(!$this->is_email_already_have())
            {
              $this->_error=true;
              $this->_error_info='ERROR_CANT_FIND_USER';
            }
            else
            {
              $this->read_user_info();
            }
          }
        }
      }
    }
  }

  //Read user information.
  protected function read_user_info()
  {
    $sql="SELECT * FROM user WHERE uid=$this->_uid";
    $r_array=$this->_db->get_one_arry($sql);
    $this->_email=$r_array['email'];
    $this->_username=$r_array['username'];
    $this->_db_password=$r_array['password'];
    $this->_salt=$r_array['salt'];
    $this->_role=$r_array['type'];
    $this->_sid=$r_array['sid'];
  }

  //Check uid
  protected function is_uid_already_have()
  {
    $sql="SELECT uid FROM user WHERE uid=$this->_uid";
    $num=$this->_db->get_num_sql($sql);
    if($num==0)
    {
      return false;
    }
    else
    {
      $this->_uid=$this->_db->get_one('uid');
      return true;
    }
  }

  //Check is email in our database.
  protected function is_email_already_have()
  {
    $sql="SELECT uid FROM user WHERE email='$this->_email'";
    $num=$this->_db->get_num_sql($sql);
    if($num==0)
    {
      return false;
    }
    else
    {
      $this->_uid=$this->_db->get_one('uid');
      return true;
    }
  }

  //Return:boolean true:there is some error
  public function is_error()
  {
    return $this->_error;
  }

  //Return:String error information
  public function get_error_info()
  {
    return $this->_error_info;
  }

  //Return:uid
  public function get_uid()
  {
    return $this->_uid;
  }

  //Return:sid
  public function get_sid()
  {
    return $this->_sid;
  }

  //Return:username
  public function get_username()
  {
    return $this->_username;
  }



  //Craet user, In:, Out:Boolean Is the user has been created successfully, Error information;
  abstract public function Creat_user();
  //Check log in, In:, Out:Array(Boolean,String) Is user can login, Error information;
  abstract public function Check_log_in();
  //abstract public function User_log_out();
  //abstract public function User_logged_in();
  //TODO:Will we do the Change password and Reset password? NO!
};

//Log out, In:, Out:Boolean Is user has log out;
function User_log_out()
{
  session_start();
  $_SESSION=array();
  return session_destroy();
}

//Logged in, In:, Out:Boolean Is user has logged in;
function User_logged_in()
{
  session_start();
  if($_SESSION['logged_in']=="yes")
  {
    return true;
  }
  else
  {
    return false;
  }

}

//class auth
class auth extends Abstract_auth
{
  //Check password. 128 character
  private function check_pwd()
  {
    $add_salt=hash('sha512',"$this->_password.$this->_salt");
    $is_check_ok=true;
    $fake=false;
    //Prevent timming attack
    for($i=0;$i<128;$i++)
    {
      if($add_salt[$i]==$this->_db_password[$i])
      {
        $fake=true;
      }
      else
      {
        $is_check_ok=false;
      }
    }
    if($fake&&$is_check_ok)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  //Generate a salt(md5(20bytes)) 32 character
  private function generate_salt()
  {
    return md5(mcrypt_create_iv(20,MCRYPT_RAND));
  }

  //Password hash:hash('sha512',"$this->_password.$this->_salt")
  private function hash_pwd()
  {
    $this->_salt=$this->generate_salt();
    return hash('sha512',"$this->_password.$this->_salt");
  }

  //abstract creat a user and write the information in to the database.
  public function Creat_user()
  {
    if($this->_error){return false;}
    $db_pwd=$this->hash_pwd();
    $sql="INSERT INTO user (`username`,`email`,`password`,`salt`,`type`) VALUES ('$this->_username','$this->_email','$db_pwd','$this->_salt','$this->_role')";
    if($this->_db->insert_update_sql($sql))
    {
      $this->is_email_already_have();
      $this->read_user_info();
      return true;
    }
    else
    {
      $this->_error=true;
      $this->_error_info='ERROR_CREAT_USER_FAILED';
      return false;
    }
  }

  //abstract user log in and write the information to session.
  public function Check_log_in()
  {
    if($this->_error){return false;}
    session_start();
    if($this->check_pwd())
    {
      $_SESSION['logged_in']="yes";
      $_SESSION['uid']=$this->_uid;
      $_SESSION['username']=$this->_username;
      $_SESSION['email']=$this->_email;
      $_SESSION['type']=$this->_role;
      $_SESSION['sid']=$this->_sid;
      return true;
    }
    else
    {
      $this->_error=true;
      $this->_error_info='ERROR_WRONG_PASSWORD';
      $_SESSION['logged_in']="no";
      return false;
    }
  }

  public function modify_sid($sid)
  {
    if($this->_error){return false;}
    $sql="UPDATE `user` SET `sid`=$sid WHERE `uid`=$this->_uid";
    if($this->_db->insert_update_sql($sql))
    {
      $this->read_user_info();
      return true;
    }
    else
    {
      throw new Exception("ERROR_UPDATE_SID", 1);
    }
  }
  
}

//logged and get username;
function logged_get_username()
{
  session_start();
  return $_SESSION['username'];
}

//logged and get uid;
function logged_get_uid()
{
  session_start();
  return $_SESSION['uid'];
}

//logged and get email;
function logged_get_email()
{
  session_start();
  return $_SESSION['enail'];
}

//logged and get type;
function logged_get_type()
{
  session_start();
  return $_SESSION['type'];
}

//logged and get sid;
function logged_get_sid()
{
  session_start();
  return $_SESSION['sid'];
}
?>
