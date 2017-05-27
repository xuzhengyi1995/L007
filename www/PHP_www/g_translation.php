<?php
/******************************
*Google translation API
*------------------------------
*Http request
*------------------------------
*url:https://translation.googleapis.com/language/translate/v2
*method:post
*body:
*     q:{text}
*     target:{language code}
      format:html/text;
*     key:AIzaSyAsF0AKTDvKLpNa8n-GGp1HaaT4OXU-dTY
*------------------------------
*Response
*------------------------------
*{
*	"data": {
*		"translations": [
*			{
*				"translatedText": "我恨你。",
*				"detectedSourceLanguage": "en"
*			}
*		]
*	}
*}
*******************************
*Get language code and name
*------------------------------
*Http request
*------------------------------
*url:https://translation.googleapis.com/language/translate/v2/languages
*method:get
*parameter:
*         target:response which language of name {language code}
*         key:AIzaSyAsF0AKTDvKLpNa8n-GGp1HaaT4OXU-dTY
*------------------------------
*Response
*------------------------------
*{
*	"data": {
*		"languages": [
*			{
*				"language": "sq",
*				"name": "阿尔巴尼亚语"
*			}
*    ]
*  }
*}
******************************/

class g_translate
{
  private static $url_g='https://translation.googleapis.com/language/translate/v2/languages';
  private static $url_t='https://translation.googleapis.com/language/translate/v2/';
  private static $key='AIzaSyAsF0AKTDvKLpNa8n-GGp1HaaT4OXU-dTY';

  /*PARAM:$target,the language of the name of this language, use language code.
  *RETURN:array([0]=>array([language]=>zh,[name]=Chinese(Simplified)),[1]=>...)*/
  public function get_all_languages($target)
  {
    $url=self::$url_g.'?target='.$target.'&key='.self::$key;
    $arr=file_get_contents($url);
    $data=json_decode($arr,true);
    return $data['data']['languages'];
  }

  /*PARAM:$text,$target:target language,$format:default html, can also be text;
   *RETURN:array(['translatedText']=>'我爱你',['detectedSourceLanguage']=>'en');*/
  public function translate_text($text,$target,$format='html')
  {
    $text=urlencode($text);
    $post_data="q=$text&target=$target&format=$format&key=".self::$key;
    $header[]='Content-Type: application/x-www-form-urlencoded';

    $p_curl=curl_init();
    curl_setopt($p_curl, CURLOPT_RETURNTRANSFER, true);
  	curl_setopt($p_curl, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($p_curl,CURLOPT_URL,self::$url_t);
    curl_setopt($p_curl,CURLOPT_HTTPHEADER,$header);
    curl_setopt($p_curl,CURLOPT_POSTFIELDS,$post_data);
    $get_post=curl_exec($p_curl);
    curl_close($p_curl);

    $get_post_json=json_decode($get_post,true);
    return $get_post_json['data']['translations'][0];
  }
}
?>
