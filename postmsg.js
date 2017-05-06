var num_date = new Date();
var num_yobi = num_date.getDay();

var trg_time = "19:00";
var trg_yobi = 3;
//var trg_time_mm = "13:00";
//var trg_yobi_mm = 2;

var arr_yobi = new Array("日","月","火","水","木","金","土"); 

function postmsg() {
  var prop = PropertiesService.getScriptProperties().getProperties();

  //slackApp インスタンスの取得
  var slackApp = SlackApp.create(prop.token);

  //channel idを取得
  //general
  var channelId = "";

  var bot_line="";

  if(num_yobi==trg_yobi){
    bot_line = "" + getAttendance(sh_str,0,"line_sch");
    bot_line = bot_line.replace("=BR=", '\n').trim();
    //var bot_line = new Array("進捗の方はいかがですか？","進捗の方はいかがですか？\n…進捗がない？まだ見捨てないのかって？　”Never!”","本日のご予定はお決まりですか？","一度休憩なさった方がよろしいかと。","もちろん万事順調に進んでいることでしょう。");
    //var num_line = bot_line.length;
    //var rnd_line = Math.floor( Math.random() * (num_line++) ) ;
  
   //投稿
    //slackApp.postMessage(channelId, arr_yobi[trg_yobi] + "曜、" + trg_time + "頃をお知らせに参りました。\n" + bot_line[rnd_line], {
    slackApp.postMessage(channelId, arr_yobi[num_yobi] + "曜、" + trg_time + "頃をお知らせに参りました。\n" + bot_line, {
        username: bot_name,
        icon_url: bot_icon
    });

  //}else{
  //  bot_line = "" + getAttendance(sh_str,1,"line_mm");
  //  bot_line = bot_line.replace("=BR=", '\n').trim();
  
   //投稿
  //  slackApp.postMessage(channelId, "今日は、" + arr_yobi[num_yobi] + "曜です。ハグの日です！\n" + bot_line, {
  //      username: "森山みくり",
  //      icon_url: "http://kokonosuke.info/wp-content/uploads/2016/09/2958_original-e1473397729904.jpg"
  //  });

  }
}


//トリガーを設置しなおすルーチン
function settingAllTrigger(){

　//設置済みトリガーの数を計測する
  var Triggers = ScriptApp.getProjectTriggers();
  var TriLength = Triggers.length;

  //設置済みトリガーの数によって作業を分岐
  if(TriLength != ""){
    //トリガーがある場合
    var deleteman = deleteTrigger();
  }
  
  if(num_yobi==trg_yobi){//||(num_yobi==trg_yobi_mm)){
  
    var set_time; 
    if(num_yobi==trg_yobi){
      set_time = trg_time;
    //}else{
    //  set_time = trg_time_mm;
    }
  
    //トリガー用の日付の作成
    var trigger1 = new Date(Utilities.formatDate(new Date() , 'JST' , getDate(set_time)));
    
    //時間指定
    var onChangeTrigger = ScriptApp.newTrigger("postmsg")
    .timeBased()
    .at(trigger1)
    .create();
  }

  //トリガーセットファンクション
  var onChangeTrigger = ScriptApp.newTrigger("settingAllTrigger")
      .timeBased()
      .atHour(1)
      .everyDays(1)
      .create();
}

//今日の日付と指定された時刻で整形して返す関数
function getDate(clockman){
 var date = new Date();
 var year = date.getFullYear();
 var month = date.getMonth() + 1;
 var date = date.getDate();
 if (month < 10) {
 month = "0" + month;
 }
 if (date < 10) {
 date = "0" + date;
 }
  var strDate = year + "/" + month + "/" +date + " " + clockman;
 return strDate;
}

function deleteTrigger() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < allTriggers.length; i++) {
      ScriptApp.deleteTrigger(allTriggers[i]);
  }
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

function init() {
//  var msg = getAttendance(sh_str,1,"line_mm2");
//  Logger.log(msg);
    var trigger1 = new Date(Utilities.formatDate(new Date() , 'JST' , getDate(trg_time)));
    //var fnc_name = "postmsg(1)";
    var onChangeTrigger = ScriptApp.newTrigger("postmsg")
      .timeBased()
      .at(trigger1)
      .create();

}
