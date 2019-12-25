/* それぞれの"shantenXxx"はシャンテン数+1を返す */

//const INF = 1000000000; //1e9

//手牌配列からidx_xのインデックスを返す
//kは1: man, 2: pin, 3: sou, 4: ji
function calcHandIdx(hand, k){
  var ret = 0;
  let bgn = (k - 1) * 10 + 1
  let end = bgn + (k === 4? 7: 9);
  
  for(let i = bgn; i < end; i++){
    ret = 5 * ret + hand[i];
  }
  return ret;
}

//国士無双の判定
function shantenKokushi(){
  if(handNum < 13) {return INF;}

  var shanten = 14;
  var hasPair = false;
  
  for(let i = 1; i < 38; i++){
    if(i % 10 == 1 || i % 10 == 9 || i > 30) {
      if(Hand[i] >= 1) shanten--;
      if(Hand[i] >= 2) hasPair = true;
    }
  }

  if(hasPair) shanten--;

  return shanten;
}

/*
国士無双と七対子以外の判定
色毎の部分シャンテン数をdp的に足し合わせる
*/
function shantenNormalHele(){
  var dp = new Array(10);
  var ref = new Array(10);
  var shanten;
  //構成可能面子数に都合上5を足したもの
  var b = Math.floor(handNum / 3) + 5;

  //man
  dp = idx_s[calcHandIdx(Hand, 1)].slice(0, 10);
  
  //pin
  ref = idx_s[calcHandIdx(Hand, 2)].slice(0, 10);
  shantenOne(dp, ref);

  //sou
  ref = idx_s[calcHandIdx(Hand, 3)].slice(0, 10);
  shantenOne(dp, ref);
  
  //ji
  ref = idx_h[calcHandIdx(Hand, 4)].slice(0, 10);
  

  shanten = Math.min(dp[b] + ref[0], dp[0] + ref[b]);
  for(let i = 5; i < b; i++){
    shanten = Math.min(shanten, dp[i] + ref[b - i], dp[b - i] + ref[i]);
  }
  
  return shanten;
}

/*
一色分のデータ（数牌なら大きさ9、字牌なら大きさ7の配列）と、
現在のdpを受け取り、
シャンテン数dpを更新する
*/
function shantenOne(now, one){
  
  for(let i = 9; i >= 5; i--){

    var shanten = Math.min(now[i] + one[0], now[0] + one[i]);

    for(let j = 5; j < i; j++){
      shanten = Math.min(shanten, now[j] + one[i - j], now[i - j] + one[j]);
    }

    now[i] = shanten;
  }

  for(let i = 4; i >= 0; i--){

    shanten = now[i] + one[0];

    for(let j = 0; j < i; j++){
      shanten = Math.min(shanten, now[j] + one[i - j]);
    }

    now[i] = shanten;
  }
}
  
//七対子の判定。槓子含みは考慮しない
function shantenSevenpairs(){
  if(handNum < 13) {return INF;}

  var shanten = 7;
  var kind = 0;

  for(let i = 1; i < 38; i++){
    if(Hand[i] >= 1){
      kind++;
    }
    if(Hand[i] >= 2){
     shanten--;
    }
  }

  shanten += Math.max(0, 7 - kind);

  return shanten;
}
  
/*
総合的なアガリ判定
返り値はシャンテン数とアガリパターンを持つオブジェクト
*/
function checkShanten(){
  
  /* 
  聴牌形のパターンを保持。
  国士が1、通常形が2、七対子が4で、
  異なるパターンで最小シャンテン数が同じ場合、
  それらの論理和を返す。
  */

  var pattern = 1;
  var shanten = shantenKokushi();
  
  var tmpShanten = shantenNormalHele();
  if(tmpShanten < shanten){
    shanten = tmpShanten;
    pattern = 2;
  }else if(tmpShanten === shanten){
    pattern += 2;
  }

  tmpShanten = shantenSevenpairs();
  if(tmpShanten < shanten){
    shanten = tmpShanten;
    pattern = 4;
  }else if(tmpShanten === shanten){
    pattern += 4;
  }

  return {shanten, pattern};
}