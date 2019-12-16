/*牌に使用する「牌ID」。
wan: 1-9
pin: 11-19
sou: 21-29
ji: 31-37
unused: 0, 10, 20, 30
計34ID
*/
var Tiles = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,          //wanz
  11, 12, 13, 14, 15, 16, 17, 18, 19, //pinz
  21, 22, 23, 24, 25, 26, 27, 28, 29, //souz
  31, 32, 33, 34, 35, 36, 37          //jihai
];

//牌IDに対する文字表記の対応表
var TilesStr = [
  "func", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", //wanz
  "dummy1", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", //pinz
  "dummy2", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", //souz
  "dummy3", "t", "n", "x", "b", "w", "g", "r"                     //jihai
];

//牌IDと画像ファイルの対応表
var imageFiles = [
  "", "./img/haiga-m/man1.gif", "./img/haiga-m/man2.gif", "./img/haiga-m/man3.gif", "./img/haiga-m/man4.gif",
  "./img/haiga-m/man5.gif", "./img/haiga-m/man6.gif", "./img/haiga-m/man7.gif", "./img/haiga-m/man8.gif",  "./img/haiga-m/man9.gif",
  "", "./img/haiga-m/pin1.gif", "./img/haiga-m/pin2.gif", "./img/haiga-m/pin3.gif", "./img/haiga-m/pin4.gif",
  "./img/haiga-m/pin5.gif", "./img/haiga-m/pin6.gif", "./img/haiga-m/pin7.gif", "./img/haiga-m/pin8.gif",  "./img/haiga-m/pin9.gif",
  "", "./img/haiga-m/sou1.gif", "./img/haiga-m/sou2.gif", "./img/haiga-m/sou3.gif", "./img/haiga-m/sou4.gif",
  "./img/haiga-m/sou5.gif", "./img/haiga-m/sou6.gif", "./img/haiga-m/sou7.gif", "./img/haiga-m/sou8.gif",  "./img/haiga-m/sou9.gif",
  "", "./img/haiga-m/ji1-ton.gif", "./img/haiga-m/ji2-nan.gif", "./img/haiga-m/ji3-sha.gif", "./img/haiga-m/ji4-pei.gif",
  "./img/haiga-m/ji5-haku.gif", "./img/haiga-m/ji6-hatsu.gif", "./img/haiga-m/ji7-chun.gif"
];

//＝＝＝＝＝以下関数記述＝＝＝＝＝

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
}

//＝＝＝＝＝判定系処理＝＝＝＝＝
//変数宣言
{
var Hand = new Array(38); //手牌
for(let i = 0; i < 38; i++){
  Hand[i] = 0;
}
var handNum = 0;  //手牌の枚数
var head; //雀頭
var koutsu = new Array(4);  //刻子を格納
var shuntsu = new Array(4); //順子を格納
var koutsuNum = 0;  //刻子の数
var shuntsuNum = 0; //順子の数
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

//＝＝＝＝＝UI系処理＝＝＝＝＝
//クラス宣言

//handImage: 手牌画像
var hi = document.getElementsByClassName("hi");

//addTileImage: 手牌に牌を加える画像付きボタン
var ati = document.getElementsByClassName("ati");

//仮
var exe = document.getElementsByClassName("exeButtons");


//ダミーボタンの不可視化
{
document.getElementById("dummy1").style.display = "none";
document.getElementById("dummy2").style.display = "none";
document.getElementById("dummy3").style.display = "none";
}

//func button
document.getElementById("func").onclick = function(){
  outHand(Hand);
  displayHand(Hand);
};


//hiの動作
for(let i = 0; i < 14; i++){
  hi[i].addEventListener("click",() => {
    let cnt = 0;
    for(let j = 1; j < 38; j++){
      cnt += Hand[j];
      if(cnt > i) {
        Hand[j]--;
        handNum--;
        break;
      }
    }

    updateDisplay();
  }, false);
}

//atiの動作
for(let i = 1; i < 38; i++){
  ati[i].addEventListener("click",() => {
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
  }, false);
}


//resetの動作
document.getElementById("reset").onclick = function(){
  resetHand();
  document.getElementById("displayHele").textContent = "";
  displayHand();
};

//手牌表示の動作
function displayHand(){
  let num = 1;  //画像表示している数
  for(let i = 1; i < 38; i++){
    for(let j = 0; j < Hand[i]; j++){
      document.getElementById("hand" + num).src = imageFiles[i];
      num++;
    }
  }
  for(; num <= 14; num++){
    document.getElementById("hand" + num).src = "";
  }
}

//表示系の更新
function updateDisplay(){
  displayHand();
    if(checkHele()){
      document.getElementById("displayHele").textContent = "アガリです";
    }else{
      document.getElementById("displayHele").textContent = "";
    }
}


//＝＝＝＝テスト用関数＝＝＝＝＝

//test();

function test(){
  var input = [
    1, 1, 1,
    4, 5, 6,
    17, 18, 19,
    31, 31, 31,
    36, 36
  ];
  var input2 = [
    1, 2, 3,
    4, 5, 6,
    17, 18, 19,
    24, 25, 26,
    36, 36
  ];
  var input3 = [//kokushi
    1, 9,
    11, 19,
    21, 29,
    31, 32, 33, 34,
    35, 36, 37, 37
  ];
  var input4 = [//7pair
    1, 1, 4, 4,
    6, 6, 22, 22,
    17, 17, 25, 25,
    36, 36
  ];
  var A = new Array(38);
  for(let i = 0; i < 38; i++){
    A[i] = 0;
  }
  for(let i = 0; i < 14; i++){
    A[input4[i]]++;
  }
  for(let i = 0; i < 38; i++){
    console.log(A[i] + " ");
  }
  console.log("\n");

  if(checkKokushi(A)){
    console.log("KokushiAgari\n");
  }

  for(let i = 0; i < 38; i++){
    console.log(A[i] + " ");
  }
  console.log("\n");

  if(checkNormalHele(A)){
    console.log("TsuujouAgari\n");
  
    console.log("koutsu数：" + koutsuNum + "\n");
    console.log("koutsu：" + "\n");
    koutsu.forEach(function(k){
      console.log(k + "\n");
    })
    console.log("shuntsu数：" + shuntsuNum + "\n");
    console.log("shuntsu：" + "\n");
    shuntsu.forEach(function(s){
      console.log(s + "\n");
    })

  }

  if(checkSevenpairs(A)){
    console.log("7PairsAgari\n");
  }
}