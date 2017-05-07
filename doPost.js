var apikey = "";

var dialogueUrl_ztd = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY='+apikey;
var dialogueUrl_snr = 'https://api.apigw.smt.docomo.ne.jp/scenarioDialogue/v1/dialogue?APIKEY='+apikey;
var dialogueUrl_usr = 'https://api.apigw.smt.docomo.ne.jp/scenarioDialogue/v1/registration?APIKEY='+apikey;

var date = new Date();
var formattedDate = Utilities.formatDate(date, "GMT", "yyyyMMddHHmmss");

var sh_str = "";

//Get properties.
var prop =  PropertiesService.getScriptProperties().getProperties();

function doPost(e) {
  //Create an instance.
  var slackApp = SlackApp.create(prop.token); 

  if (prop.verifyToken != e.parameter.token) {
    throw new Error("invalid token.");
  }

  //My first Message!
  //slackApp.chatPostMessage(e.parameter.channel_id, "Hi " + e.parameter.user_name + ".", {
  ////slackApp.chatPostMessage("C0L1R638B", "Hi test_user.", {
  //  username: bot_name,
  //  icon_url: bot_icon
  //});
  
  var bot_line="";
  var mm2="";
  
  if( e.parameter.user_name == "slackbot" ) {
    bot_line = "Hi slackbot.";
  }else if( getMessage(e.parameter.text).indexOf("grandpa me")!=-1 ) {
    bot_line = getAttendance(sh_str,0,"photo_jii") + "&nmb=" + formattedDate;
  }else if(( getMessage(e.parameter.text).indexOf("進捗ダメ")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗ありません")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗な")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗出な")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗出ませ")!=-1 )) {
    var oyatu = getAttendance(sh_str,0,"line_oyt");
    bot_line = "おやおや。では、このアルフレッド特製" + oyatu + "はおあずけ、ということになりますね。";
  }else if( getMessage(e.parameter.text).indexOf("アップルパイ")!=-1 ) {
    bot_line = e.parameter.user_name + "様たってのご要望とあらば、明日の午後のお茶にはアップルパイをご用意しましょう。特別ですよ。";
  }else if(( getMessage(e.parameter.text).indexOf("進捗出して")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗出したい")!=-1 )){
  }else if(( getMessage(e.parameter.text).indexOf("進捗出")!=-1 )||( getMessage(e.parameter.text).indexOf("進捗あ")!=-1 )) {
    var gj = getAttendance(sh_str,0,"line_gj");
    bot_line = "" + gj;
    //bot_line = e.parameter.user_name + "様、当家にお仕えして随分経ちますが、いつだってこれほど嬉しい瞬間は他にございません。";
  }else if( getMessage(e.parameter.text)=="おじいちゃん" ) {
    var jii = getAttendance(sh_str,0,"line_jii");
    bot_line = "" + jii;
  }else if( getMessage(e.parameter.text).substr(0,8)=="みくりさん呼んで" ) {
    mm2 = "" + getAttendance(sh_str,1,"line_mm2");
    bot_line = "かしこまりました。";
  }
  
  if(bot_line!="") {
    bot_line = bot_line.replace("user_name", e.parameter.user_name).trim();
    bot_line = bot_line.replace("=BR=", '\n').trim();

    slackApp.chatPostMessage(e.parameter.channel_id, bot_line, {
      username: bot_name,
      icon_url: bot_icon
    });
    
    if(mm2!="") {
      mm2 = mm2.replace("user_name", e.parameter.user_name).trim();
      mm2 = mm2.replace("=BR=", '\n').trim();
  
      slackApp.chatPostMessage(e.parameter.channel_id, mm2, {
        username: "森山みくり",
        icon_url: "http://kokonosuke.info/wp-content/uploads/2016/09/2958_original-e1473397729904.jpg"
      });
      
      mm2 = getAttendance(sh_str,1,"photo_mm") + "&nmb=" + formattedDate;
      slackApp.chatPostMessage(e.parameter.channel_id, mm2, {
        username: "森山みくり",
        icon_url: "http://kokonosuke.info/wp-content/uploads/2016/09/2958_original-e1473397729904.jpg"
      });
    }

    return null;
  }

  zatsudanBot(slackApp, e);
}

function getAttendance(str_url,sht,theme){
  var ss = SpreadsheetApp.openByUrl(str_url);
  var sheet = ss.getSheets()[sht];
  
  var clm = 0;
  var val = "start";
  
  while((val != "")&&(val != theme)){
    clm++;
    val = sheet.getSheetValues(1,clm,1,1);
  }

  //画像URLが何行目まであるか保存しているセル
  //getSheetValues(startRow, startColumn, numRows, numColumns)
  var cnt = sheet.getSheetValues(2,clm,1,1);
  
  //乱数1~cnt
  var rand = Math.floor( Math.random() * (cnt++) ) +1 ;
  
  var attendance = sheet.getSheetValues(rand,clm+1,1,1);
  
  return attendance;
}

function zatsudanBot(slackApp, e) {
  var message = getMessage(e.parameter.text);
  var responseMessage = getDialogueMessage_ztd(e.parameter.user_name, message);
  var response = slackApp.postMessage(e.parameter.channel_id, MyLady(responseMessage), {
    username: bot_name,
    icon_url: bot_icon
  });
  return true;
}
 
function scenarioBot(slackApp, e) {
  var message = getMessage(e.parameter.text);
  var responseMessage = getDialogueMessage_snr(e.parameter.user_name, message);
  var response = slackApp.postMessage(e.parameter.channel_id, MyLady(responseMessage), {
    username: bot_name,
    icon_url: bot_icon
  });
  return true;
}
 
function getMessage(mes) {
  mes = mes.replace("@alfred", '').trim();
  if (mes.substr(0,1)==":"){
    mes = mes.substr(1,mes.length);
  }
  return mes;
}
 
function MyLady(mes) {
  mes = mes.replace("お疲れ様です。", 'お茶が入りました、お嬢様。').trim();
  return mes;
}
 
function getDialogueMessage_ztd(userId, mes) {
  var contextId = 'context' + userId;
  var contextId_last = contextId + '_last';
  var dialogue_options = {
    //https://dev.smt.docomo.ne.jp/?p=docs.api.page&api_name=dialogue&p_name=api_1
    //'t'：キャラクター指定　20 : 関西弁キャラ、30 : 赤ちゃんキャラ
    'utt': mes,
    'nickname': userId,
    'mode': "dialog"
    //'t': 30
    };


  var props = PropertiesService.getScriptProperties();
  var context = props.getProperty(contextId);
  var context_last = props.getProperty(contextId_last);
  
  //前回の会話から一定時間経ったらcontext破棄
  var TTL_MINUTES = 20;
  
  if (context_last){
    var diff_minutes = getTimeDiffAsMinutes(context_last);
  }else{
    var diff_minutes = TTL_MINUTES+1;
  }
  
  if (diff_minutes>TTL_MINUTES){
    dialogue_options.context = '';
    context = '';
  }else if (context) {
    dialogue_options.context = context;
  }

  var options = {
    'method': 'POST',
    'contentType': 'text/json',
    'mode': "dialog",
    'payload': JSON.stringify(dialogue_options),    
    'context': context    
  };
  var response = UrlFetchApp.fetch(dialogueUrl_ztd, options);
  var content = JSON.parse(response.getContentText());

  //会話情報を記録しておく
  props.setProperty(contextId, content.context);
  props.setProperty(contextId_last, date);  

  return content.utt;

}

function getAppuserId(userId) {
  var appuserId = 'appuser' + userId;
  var props = PropertiesService.getScriptProperties();
  var appuser = props.getProperty(appuserId);

  if(appuser==null){
    var dialogue_options = {
      'botId' : 'APIBot'
      };
  
    var options = {
      'method': 'POST',
      'contentType': 'application/json;charset=UTF-8',
      'payload': JSON.stringify(dialogue_options)
    };
    var response = UrlFetchApp.fetch(dialogueUrl_usr, options);
    var content = JSON.parse(response.getContentText());

    appuser = content.appUserId;
    props.setProperty(appuserId, content.appUserId);
    
  }
  return appuser;
}

function getDialogueMessage_snr(userId, mes) {
  var appuser = getAppuserId(userId);
  var dialogue_options = {
    'appUserId' : appuser,
    'botId' : 'APIBot',
    'voiceText' : 'init', 
    'initTalkingFlag' : true,  
    'initTopicId' : 'APITOPIC'
    };

  var options = {
    'appUserId' : appuser,
    'method': 'POST',
    'contentType': 'application/json;charset=UTF-8',
    'payload': JSON.stringify(dialogue_options)
    //'muteHttpExceptions' : false
  };
  var response = UrlFetchApp.fetch(dialogueUrl_snr, options);
  var content = JSON.parse(response.getContentText());

  return content.expression;

}
function getTimeDiffAsMinutes(msec) {
  var now = new Date();
  var old = new Date(msec);
  var diff_msec = now.getTime() - old.getTime();
  var diff_minutes = parseInt( diff_msec / (60*1000), 10 );
  return diff_minutes;
}

function init() {
  var msg = getAttendance(sh_str,1,"line_mm2");
  Logger.log(msg);
}
