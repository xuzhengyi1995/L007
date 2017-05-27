<?php
/******************************
*Microsoft entity link API
*------------------------------
*Http request
*------------------------------
*url:https://westus.api.cognitive.microsoft.com/entitylinking/v1.0/link
*method:POST
*headers:
*       Content-Type:text/plain
*       Ocp-Apim-Subscription-Key:aef86b5d06c2416eaa65f7c6df9161fc
*Body:text
*Exp:
*API
*Application programming interface
*------------------------------
*Response
*------------------------------
*Content-Type:Json
*Exp:
*{
*	"entities": [
*		{
*			"matches": [
*				{
*					"text": "API",
*					"entries": [
*						{
*							"offset": 0
*						}
*					]
*				},
*				{
*					"text": "Application programming interface",
*					"entries": [
*						{
*							"offset": 5
*						}
*					]
*				}
*			],
*			"name": "Application programming interface",
*			"wikipediaId": "Application programming interface",
*			"score": 0.153
*		}
*	]
*}
*------------------------------
*Link to wikipedia
*------------------------------
*https://en.wikipedia.org/wiki/{wikipediaId}
******************************/

class entity_link
{
  private static $url='https://westus.api.cognitive.microsoft.com/entitylinking/v1.0/link';
  private static $url_wiki='https://en.wikipedia.org/wiki/';
  private static $key='aef86b5d06c2416eaa65f7c6df9161fc';

  public function mark_the_text($text,$style_head='',$style_end='',$a_class='')
  {
      $header[]='Content-Type:text/plain';
      $header[]='Ocp-Apim-Subscription-Key:'.self::$key;
	  
	  $text=json_encode($text);

      $p_curl=curl_init();
      curl_setopt($p_curl, CURLOPT_RETURNTRANSFER, true);
    	curl_setopt($p_curl, CURLOPT_BINARYTRANSFER, true);
      curl_setopt($p_curl,CURLOPT_URL,self::$url);
      curl_setopt($p_curl,CURLOPT_HTTPHEADER,$header);
      curl_setopt($p_curl,CURLOPT_POSTFIELDS,$text);
      $get_post=curl_exec($p_curl);
      curl_close($p_curl);

      $get_post_json=json_decode($get_post,true);
      $data=$get_post_json['entities'];

      $r_text=$text;
      $m_offset=array();
      for($i=0;$i<count($data);$i++)
      {
        $wiki=$data[$i]['wikipediaId'];
        $wiki=str_replace(' ','_',$wiki);
        $matches=$data[$i]['matches'];

        for($j=0;$j<count($matches);$j++)
        {
          $m_text=$matches[$j]['text'];
          $position=$matches[$j]['entries'];

          if($a_class=='')
          {
            $replace_text="$style_head<a target='new' href=".self::$url_wiki.$wiki.'>'.$m_text."</a>$style_end";
          }
          else
          {
            $replace_text="$style_head<a target='new' class=\"$a_class\" href=".self::$url_wiki.$wiki.'>'.$m_text."</a>$style_end";
          }

          for($k=0;$k<count($position);$k++)
          {
            $offset=$position[$k]['offset'];
            $o_orignal=$offset;
            for($l=0;$l<$o_orignal;$l++)
            {
              if(isset($m_offset[$l]))
              {
                $offset+=$m_offset[$l];
              }
            }
            $m_offset[$o_orignal]=strlen($replace_text)-strlen($m_text);
            $r_text=substr_replace($r_text,$replace_text,$offset,strlen($m_text));
          }
        }
      }
      return json_decode($r_text);
  }
}
?>
