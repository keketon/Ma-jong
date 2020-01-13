/*牌に使用する「牌ID」
man: 1-9
pin: 11-19
sou: 21-29
ji: 31-37
unused: 0, 10, 20, 30
計34ID
*/
var Tiles = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,          //manz
  11, 12, 13, 14, 15, 16, 17, 18, 19, //pinz
  21, 22, 23, 24, 25, 26, 27, 28, 29, //souz
  31, 32, 33, 34, 35, 36, 37          //jihai
];

//牌IDに対する文字表記の対応表
var TilesStr = [
  "func", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", //manz
  "dummy1", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", //pinz
  "dummy2", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", //souz
  "dummy3", "e", "s", "w", "n", "w", "g", "r"                     //jihai
];

//牌IDと画像ファイルの対応表
var imageFiles = [
  "", "./img/haiga-m/man1.gif", "./img/haiga-m/man2.gif", "./img/haiga-m/man3.gif", "./img/haiga-m/man4.gif", "./img/haiga-m/man5.gif",
  "./img/haiga-m/man6.gif", "./img/haiga-m/man7.gif", "./img/haiga-m/man8.gif",  "./img/haiga-m/man9.gif", "./img/haiga-m/man-aka5.gif",
  "./img/haiga-m/pin1.gif", "./img/haiga-m/pin2.gif", "./img/haiga-m/pin3.gif", "./img/haiga-m/pin4.gif", "./img/haiga-m/pin5.gif",
  "./img/haiga-m/pin6.gif", "./img/haiga-m/pin7.gif", "./img/haiga-m/pin8.gif",  "./img/haiga-m/pin9.gif", "./img/haiga-m/pin-aka5.gif",
  "./img/haiga-m/sou1.gif", "./img/haiga-m/sou2.gif", "./img/haiga-m/sou3.gif", "./img/haiga-m/sou4.gif", "./img/haiga-m/sou5.gif",
  "./img/haiga-m/sou6.gif", "./img/haiga-m/sou7.gif", "./img/haiga-m/sou8.gif",  "./img/haiga-m/sou9.gif", "./img/haiga-m/sou-aka5.gif",
  "./img/haiga-m/ji1-ton.gif", "./img/haiga-m/ji2-nan.gif", "./img/haiga-m/ji3-sha.gif", "./img/haiga-m/ji4-pei.gif",
  "./img/haiga-m/ji5-haku.gif", "./img/haiga-m/ji6-hatsu.gif", "./img/haiga-m/ji7-chun.gif"
];

//変数宣言
{
  const INF = 1000000000; //1e9

  var Hand = new Array(38); //手牌
  for(let i = 0; i < 38; i++){
    Hand[i] = 0;
  }
  var handNum = 0;  //手牌の枚数
  var head = 0; //雀頭
  var koutsu = new Array(4);  //刻子を格納
  var shuntsu = new Array(4); //順子を格納
  var toitsu = new Array(4); //対子を格納
  var tatsu = new Array(4); //塔子を格納
  var koutsuNum = 0;  //刻子の数
  var shuntsuNum = 0; //順子の数
  var toitsuNum = 0;  //対子の数
  var tatsuNum = 0;   /*塔子の数
  正の数は両面・辺張を表し、負の数は嵌張を表す*/
  var patternStr = [
    "国士無双",
    "通常手",
    "七対子"
  ]; //patternと文字との対応
  var cancelKS = false; //国士と七対子をキャンセルするか
  var redTile = [false, false, false, false];  //左から順にman, pin, souの赤牌の有無
}


//＝＝＝＝＝汎用関数＝＝＝＝＝
//0以上x未満の整数の乱数を返す。
function rand(x){
  return Math.floor(Math.random() * x);
}

//手牌の表示
function outHand(hand){
  console.log("現在の手牌：\n");
  for(let i = 0; i < 38; i++){
    console.log(hand[i] + " ");
  }
  console.log("\n");
}

//手牌のリセット（Hand配列のゼロ化）
function resetHand(){
  for(let i = 0; i < 38; i++){
    Hand[i] = 0;
  }
  handNum = 0;
  for(let i = 0; i < 4; i++){
    redTile[i] = false;
  }

  var disp = "";
  disp += "手牌枚数：" + handNum + "\n";
  $("#displayAlert").text(disp);
}

//変数のリセット
function resetVals(){
  for(let i = 0; i < 4; i++){
    koutsu[i] = 0;
    shuntsu[i] = 0;
  }
  head = koutsuNum = shuntsuNum = tatsu = 0;
}

/*
//ランダムに手牌を14枚構築

for(let i = 0; i < 14; i++){
  let tmpKind = 0;
  do{
    tmpKind = rand(38);
  }while(tmpKind % 10 === 0);

  Hand[tmpKind]++;
}

for(let i = 0; i < 14; i++){
  let j = 0;
  while(!Hand[j]){j++;}
  Hand[j]--;
  console.log(j + "\n");
}
*/


//＝＝＝＝＝UI系処理用関数＝＝＝＝＝

//手牌表示の動作
function displayHand(){
  let num = 1;  //画像表示している数
  for(let i = 1; i < 38; i++){
    let hasRed = 0;
    if(i % 10 === 5 && redTile[(i - 5) / 10]){
      $("#hand" + num).attr("src", imageFiles[i + 5]);
      hasRed++;
      num++;
    }
    for(let j = hasRed; j < Hand[i]; j++){
      $("#hand" + num).attr("src", imageFiles[i]);
      num++;
    }
  }
  for(; num <= 14; num++){
    $("#hand" + num).attr("src", "");
  }
}

//表示系の更新
function updateDisplay(){
  displayHand();

  $("#displayAlert").text("手牌枚数：" + handNum);

  var disp = "";
    if(handNum === 0){
      disp = "ここにシャンテン数が表示されます";
    }else{
      if(checkHele()){
        disp += "アガリです\n";
      }else{
        var {shanten, pattern} = checkShanten();
        var patStr = patternToStr(pattern);
        var shantenStr = (shanten === 1? " テンパイ": (shanten - 1) + " シャンテン");
        
        disp += patStr + " の " + shantenStr + "です\n";
      }
    }
    $("#displayHele").text(disp);
}

//整数であらわされたpatternを受取り、"国士無双、面子手"などの文字列を返す
function patternToStr(pattern){
  var retStr = "";
  for(let i = 0; i < 3; i++){
    if(pattern % 2 === 1){
      retStr += patternStr[i];
      pattern >>= 1;
      if(pattern > 0){
        retStr += "、"
      }
    }else{pattern >>= 1;}
  }

  return retStr;
}


//＝＝＝＝＝ロード後jQuery実行部＝＝＝＝＝

$(function(){

  //ダミーボタンの不可視化
  //$("#func").hide();
  
  //牌ボタンのアニメ化
  $("img.hi").addClass("opacityAnimation");
  $("img.ati").addClass("opacityAnimation");

  var dur = 120;
  $("img.opacityAnimation").hover(function(){  
    $(this).stop().animate({"opacity":"0.6"}, dur);
  },function(){
    $(this).stop().animate({"opacity":"1"}, dur);    
  });

  //有効牌表示の初期化（不可視化）
  $(".vt").hide();

  //＝＝＝＝＝ボタン（画像）動作設定＝＝＝＝＝
  //hiの動作
  for(let i = 0; i < 14; i++){
    $(".hi").eq(i).click(function(){
      let cnt = 0;
      //赤牌チェック
      var isRed = false;
      var src = $(this).attr('src');
      if(src.match(/aka/)){
        isRed = true;
      }
      for(let j = 1; j < 38; j++){
        cnt += Hand[j];
        if(cnt > i) {
          Hand[j]--;
          handNum--;
          if(isRed){
            redTile[(j - 5) / 10] = false;
          }
          break;
        }
      }
      
      updateDisplay();
    });
  }

  //atiの動作
  for(let i = 1; i < 38; i++){
    $(".ati").eq(i).click(function(){
        if(handNum >= 14){
        alert("手牌の数は14枚までです。")
        return;
      }
      if(Hand[i] >= 4){
        alert("1種の牌は4枚までです。")
        return;
      }

      Hand[i]++;
      handNum++;
      updateDisplay();
    });
  }

  //赤牌処理
  for(let i = 10; i <= 30; i += 10){
    $(".ati").eq(i).off();
    $(".ati").eq(i).click(function(){
        if(handNum >= 14){
        alert("手牌の数は14枚までです。")
        return;
      }
      if(Hand[i - 5] >= 4){
        alert("1種の牌は4枚までです。")
        return;
      }
      if(redTile[(i / 10) - 1]){
        alert("各赤牌は1枚までです。")
        return;
      }
      Hand[i - 5]++;
      handNum++;
      redTile[(i / 10) - 1] = true;
      updateDisplay();
    });
  }


  //func button（通常は不可視）
  $("#func").click(function(){
    outHand(Hand);
    displayHand(Hand);
    updateDisplay();
    var src = $("#hand1").attr('src');
    console.log(src);
    if(src.match(/aka/)){
      console.log("red");
    }
  });

  //reset button
  $("#reset").click(function(){
    resetHand();
    displayHand();
    $("#displayHele").html("ここにシャンテン数が表示されます");
    $(".vt").hide();
    $("#validYukou").html("国士・通常手・七対子の中でシャンテン数の最も高いものの有効牌が表示されます<br>通常手のみについて計算したい場合は上のチェックボックスをチェックしてください");
  });

  //有効牌 buttons
  $("#validButton").click(function(){
    if(handNum >= 14){
      alert("手牌枚数が多すぎます");
      return;
    }
    
    var remKind = 0;
    var remNum = 0;
    $(".vt").hide();

    var {valid, pattern} = checkValid();
    valid.forEach(function( val ) {
      $(".vt").eq(val).show();
      remKind++;
      remNum += 4 - Hand[val];
    });

    var disp = patternToStr(pattern) + "の有効牌：" + remKind + "種" + remNum + "枚";
    $("#validYukou").text(disp);

  });

  //cancelKSボックス
  $("input[name = 'config']").change(function() {
    cancelKS = $("#cancelKS").prop("checked");
    updateDisplay();
  });
});