<?php
/*******************************
*Check the reCAPTCHA from google
*
*<script src='https://www.google.com/recaptcha/api.js'></script>
*<div class="g-recaptcha" data-sitekey="6Lc8VB8UAAAAALdtNz2WMR9K2crxaq-UXrNaHm4V"></div>
*
*Get from POST:g-recaptcha-response
*METHOD:POST
*API REQUEST:https://www.google.com/recaptcha/api/siteverify
*|POST Parameter  |Description                                              |
-----------------------------------------------------------------------------
*|secret          |Required. The shared key between your site and reCAPTCHA.|
*|response  	    |Required. The user response token provided by reCAPTCHA, |
*                  verifying the user on your site.                         |
*|remoteip 	      |Optional. The user's IP address.                         |
-----------------------------------------------------------------------------
secret:6Lc8VB8UAAAAAGIfvvnpRWu-79DRcE1LSFVdWfQo
response:g-recaptcha-response
********************************/
function check_reCAPTCHA($g_r_r,$ip=NULL)
{
  $secret='6Lc8VB8UAAAAAGIfvvnpRWu-79DRcE1LSFVdWfQo';
  $url='https://www.google.com/recaptcha/api/siteverify';
  $post_c="secret=$secret&response=$g_r_r";
  if($ip!=NULL)
  {
    $post_c.="&remoteip=$ip";
  }

  $header[]='Content-Type: application/x-www-form-urlencoded';

  $p_curl=curl_init();
  curl_setopt($p_curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($p_curl, CURLOPT_BINARYTRANSFER, true);
  curl_setopt($p_curl,CURLOPT_URL,$url);
  curl_setopt($p_curl,CURLOPT_HTTPHEADER,$header);
  curl_setopt($p_curl,CURLOPT_POSTFIELDS,$post_c);
  $get_post=curl_exec($p_curl);
  curl_close($p_curl);

  $get_post_json=json_decode($get_post,true);
  if($get_post_json['success'])
  {
    return true;
  }
  else
  {
    return false;
  }
}
?>
