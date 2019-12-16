
//国士無双の判定
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
  
  //国士無双と七対子以外の判定
  function checkNormalHele(hand){
  
    for(let h = 0; h < 38; h++){
      var tmpHand = hand.slice(0, hand.length); resetVals();  //変数をリセットする
  
      if(tmpHand[h] >= 2) {
  
        tmpHand = hand.slice(0, hand.length); resetVals();  //変数をリセットする
        tmpHand[h] -= 2; head = h;  //雀頭抜き出し
  
        //刻子->順子とチェック
        checkKoutsu(tmpHand);
        checkShuntsu(tmpHand);
        //上がりの場合
        if(checkUseOut(tmpHand)) {return true; //calcScore();
        }
  
        //順子->刻子とチェック
        tmpHand = hand.slice(0, hand.length); resetVals();
        tmpHand[h] -= 2; head = h;
        checkShuntsu(tmpHand);
        checkKoutsu(tmpHand);
        //上がりの場合
        if(checkUseOut(tmpHand)) {return true;}
  
        //刻子1つ取り出し->順子->刻子とチェック
        tmpHand = hand.slice(0, hand.length); resetVals();
        tmpHand[h] -= 2; head = h;
        checkKoutsu(tmpHand, 1);
        checkShuntsu(tmpHand);
        checkKoutsu(tmpHand);
        //上がりの場合
        if(checkUseOut(tmpHand)) {return true;}
      }
    }
  }
  
  //七対子の判定。槓子含みは考慮しない
  function checkSevenpairs(hand){
  
    var tmpHand = hand.slice(0, hand.length);
    for(let h = 0; h < 38; h++){
      if(tmpHand[h] === 2){
        tmpHand[h] -= 2;
      }
    }
    if(checkUseOut(tmpHand)) {return true;}
  }
  
  //総合的なアガリ判定
  function checkHele(){
    if(handNum !== 14) return false;
    if(checkKokushi(Hand)) return true;
    if(checkNormalHele(Hand)) return true;
    if(checkSevenpairs(Hand)) return true;
    
    return false;
  }