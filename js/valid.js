
//国士無双の有効牌の計算
function validKokushi(){
  var valid = [];
  var hasPair = false;
  for(let i = 1; i < 38; i++){
    if(i % 10 === 1 || i % 10 === 9 || i > 30) {
      if(Hand[i] >= 2) hasPair = true;
    }
  }

  for(let i = 1; i < 38; i++){
    if(i % 10 === 1 || i % 10 === 9 || i > 30) {
      if(Hand[i] === 0 || (!hasPair && Hand[i] === 1)){
          valid.push(i);
      }
    }
  }
  return valid;
}

/*
国士無双と七対子以外の判定
手牌に1枚追加し、シャンテン数が上がったかどうかを調べる。
*/
function validNormalHele(){
  
  if(handNum >= 14){
    alert("手牌枚数が多すぎます");
    return;
  }

  var valid = [];
  var nowShanten = shantenNormalHele();
  var nextShanten;

  for(let i = 1; i < 38; i++){
    if(Hand[i] === 4 || i % 10 === 0){continue;}

    Hand[i]++;
    nextShanten = shantenNormalHele();
    Hand[i]--;
    if(nextShanten < nowShanten){
      valid.push(i);
    }
  }

  return valid;
}


//七対子の有効牌の計算
function validSevenpairs(){
  var valid = [];
  var kindNum = 0;
  for(let i = 1; i < 38; i++){
    if(Hand[i] >= 1) kindNum++;
  }

  for(let i = 1; i < 38; i++){
    if( (Hand[i] === 0 && kindNum < 7)
      || (Hand[i]=== 1 && kindNum >= 7) ){
        valid.push(i);
    }
  }
  return valid;
}

/*
2つの配列を受け取り、和集合を返す
受け取る配列は＿昇順＿である必要がある
返り値も昇順
*/
function calcUnion(one, two){
  if(one.length === 0) return two;
  if(two.length === 0) return one;

  var cone = 0;
  var ctwo = 0;
  var uni = [];

  while(cone < one.length && ctwo < two.length){
    if(one[cone] < two[ctwo]){
      uni.push(one[cone]); cone++;
    }else if(one[cone] > two[ctwo]){
      uni.push(two[ctwo]); ctwo++;
    }else{
      uni.push(one[cone]); cone++; ctwo++
    }
  }
  
  for(; cone < one.length; cone++){
    uni.push(one[cone]);
  }
  for(; ctwo < two.length; ctwo++){
    uni.push(two[ctwo]);
  }

  return uni;
}

function checkValid(){
  var valid = [];
  var tmpValid1 = [];
  var tmpValid2 = [];
  var tmpValid4 = [];

  var pattern = 2;
  tmpvalid1 = validKokushi();
  tmpvalid2 = validNormalHele();
  tmpvalid4 = validSevenpairs();
  
  if(cancelKS) {
    valid = tmpvalid2;
  }else{
    var {shanten, pattern} = checkShanten();
    tmpPattern = pattern;
    

    if(tmpPattern % 2 === 1){
        valid = calcUnion(valid, tmpvalid1);
    }
    tmpPattern >>= 1;

    if(tmpPattern % 2 === 1){
        valid = calcUnion(valid, tmpvalid2);
    }
    tmpPattern >>= 1;

    if(tmpPattern % 2 === 1){
        valid = calcUnion(valid, tmpvalid4);
    }
  }
  return {valid, pattern};
}

function countValid(vld){
  var remKind = 0;
  var remNum = 0;

  vld.forEach(function( val ) {
    remKind++;
    remNum += 4 - Hand[val];
  });

  return {remKind, remNum};
}