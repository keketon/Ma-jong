document.getElementById("hello_text").textContent = "ma-jong";

/*牌に使用するID。
wan: 1-9
pin: 11-19
sou: 21-29
ji: 31-37
unused: 0, 10, 20, 30
*/
var Tiles = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,          //wanz
  11, 12, 13, 14, 15, 16, 17, 18, 19, //pinz
  21, 22, 23, 24, 25, 26, 27, 28, 29, //souz
  31, 32, 33, 34, 35, 36, 37          //jihai
];

//＝＝＝＝＝以下関数記述＝＝＝＝＝

//＝＝＝＝＝汎用関数＝＝＝＝＝
//0以上x未満の整数の乱数を返す。
function rand(x){
  return Math.floor(Math.random() * x);
}

function outHand(hand){
  console.log("現在の手牌：\n");
  for(let i = 0; i < 38; i++){
    console.log(hand[i] + " ");
  }
  console.log("\n");
}

//＝＝＝＝＝変数＝＝＝＝＝
var heleTile; //上がり牌
var head; //雀頭
var koutsu = new Array(4);  //刻子を格納
var shuntsu = new Array(4); //順子を格納
var koutsuNum = 0;  //刻子の数
var shuntsuNum = 0; //順子の数

/*
//ランダムに手牌を14枚構築
//配列初期化
var Hand = new Array(38);
for(let i = 0; i < 38; i++){
  Hand[i] = 0;
}

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
//牌を使い切ったかどうかの判定関数
function checkUseOut(hand){
  for(let i = 0; i < 38; i++){
    if(hand[i] > 0) {return false}
  }
  return true;
}

//刻子の抜き出し
function checkKoutsu(hand, num){
  for(let i = 0; i < 38; i++){
    if(hand[i] >= 3) {
      hand[i] -= 3;
      koutsu[koutsuNum++] = i;
      if (num > 0 && koutsuNum == num) {return;}
    }
  }
}

function checkShuntsu(hand){
  //字牌と8,9牌は関係ないので28
  for(let i = 0; i < 28; i++){
    if(i % 10 > 7) {continue;}
    while(hand[i] > 0 && hand[i+1] > 0 && hand[i+2] > 0){
      hand[i]--;  hand[i+1]--;  hand[i+2]--;
      shuntsu[shuntsuNum++] = i;
    }
  }
}

/*
//フリテンチェック
function checkFriten(hand){
  if hele == 捨牌
  return true;
  else
  return false;
}
*/

function checkKokushi(hand){
  var tmpHand = hand.slice(0, hand.length);
  var findHead = false;
  for(let i = 0; i < 38; i++){
    if(i % 10 == 1 || i % 10 == 9 || i > 30) {
      if (!findHead && tmpHand[i] == 2) {
        tmpHand[i] -= 2;
        findHead == true;
      }else if(tmpHand[i] == 1){
        tmpHand[i]--;
      }
    }
  }
  return checkUseOut(tmpHand);
}

function checkNormalHele(hand){

  for(let h = 0; h < 38; h++){
    var tmpHand = hand.slice(0, hand.length); resetVals();  //変数をリセットする
    
    if(tmpHand[h] >= 2) {
      //雀頭抜き出し
      tmpHand[h] -= 2; head = h;

      //刻子->順子とチェック
      checkKoutsu(tmpHand, 0);
      outHand(tmpHand);
      checkShuntsu(tmpHand);
      outHand(tmpHand);
      //上がりの場合
      if(checkUseOut(tmpHand)) {return true;}

      //順子->刻子とチェック
      var tmpHand = hand.slice(0, hand.length); resetVals();  //変数をリセットする
      tmpHand[h] -= 2; head = h;
      checkShuntsu(tmpHand);
      checkKoutsu(tmpHand, 0);
      //上がりの場合
      if(checkUseOut(tmpHand)) {return true;}

      //刻子1つ取り出し->順子->刻子とチェック
      var tmpHand = hand.slice(0, hand.length); resetVals();  //変数をリセットする
      tmpHand[h] -= 2; head = h;
      checkKoutsu(tmpHand, 1);
      checkShuntsu(tmpHand);
      checkKoutsu(tmpHand);
      //上がりの場合
      if(checkUseOut(tmpHand)) {return true;}
    }
  }
}

function resetVals(){
  for(let i = 0; i < 4; i++){
    koutsu[i] = 0;
    shuntsu[i] = 0;
  }
  head = koutsuNum = shuntsuNum = 0;
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
  var kokushi = [
    1, 9,
    11, 19,
    21, 29,
    31, 32, 33, 34,
    35, 36, 37, 37
  ];
  var A = new Array(38);
  for(let i = 0; i < 38; i++){
    A[i] = 0;
  }
  for(let i = 0; i < 14; i++){
    A[input[i]]++;
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
  }
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