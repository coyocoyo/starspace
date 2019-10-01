
/*-----------------------------------
　　　　グローバルブロックここから
------------------------------------*/

/* グローバル変数・定数コーナー */
/*---------------------------------------
      複数のjsファイルから参照されたり、
      開発中に微調整される変数
---------------------------------------*/

  /*-- 敵機の耐久力 --*/
  const eDefaultLife0 = 2; // (UFO型)
  const eDefaultLife1 = 2; // (UFO型)
  const eDefaultLife2 = 2; // (UFO型)
  const eDefaultLife3 = 4; // (隕石型)
  const eDefaultLife4 = 4; // (隕石型)
  const eDefaultLife5 = 4; // (隕石型)
  const eDefaultLife6 = 4; // (隕石型)
  const eDefaultLife7 = 4; // (隕石型)
  const eDefaultLife8 = 4; // (隕石型)
  const eDefaultLife9 = 4; // (隕石型)

  /*-- 敵機の攻撃力 --*/
  const eAttack0 = 10; // (UFO型)
  const eAttack1 = 10; // (UFO型)
  const eAttack2 = 10; // (UFO型)
  const eAttack3 = 20; // (隕石型)
  const eAttack4 = 20; // (隕石型)
  const eAttack5 = 20; // (隕石型)
  const eAttack6 = 20; // (隕石型)
  const eAttack7 = 20; // (隕石型)
  const eAttack8 = 20; // (隕石型)
  const eAttack9 = 20; // (隕石型)

  /*-- 敵機の得点 --*/
  const eScore0 = 100; // (UFO型)
  const eScore1 = 100; // (UFO型)
  const eScore2 = 100; // (UFO型)
  const eScore3 = 200; // (隕石型)
  const eScore4 = 200; // (隕石型)
  const eScore5 = 200; // (隕石型)
  const eScore6 = 200; // (隕石型)
  const eScore7 = 200; // (隕石型)
  const eScore8 = 200; // (隕石型)
  const eScore9 = 200; // (隕石型)

    // for文で使うので配列に入れておく
/*
  let eDefaultLife = [];

  for (let i = 0 ; i < enemyA_Max ; i++){
    eDefaultLife[i] = 'eDefaultLife' + i;
  }
  console.log(eDefaultLife[0]); // → 「 eDefaultLife0 」...「 2 」が欲しかった・・・。
  console.log(eDefaultLife[2]); // → 「 eDefaultLife2 」
  console.log(eDefaultLife[4]); // → 「 eDefaultLife4 」
*/

  let eDefaultLife = [ // 手動で入れておく。
  eDefaultLife0,
  eDefaultLife1,
  eDefaultLife2,
  eDefaultLife3,
  eDefaultLife4,
  eDefaultLife5,
  eDefaultLife6,
  eDefaultLife7,
  eDefaultLife8,
  eDefaultLife9];

  let eAttack = [
  eAttack0,
  eAttack1,
  eAttack2,
  eAttack3,
  eAttack4,
  eAttack5,
  eAttack6,
  eAttack7,
  eAttack8,
  eAttack9];

  let eScore = [
  eScore0,
  eScore1,
  eScore2,
  eScore3,
  eScore4,
  eScore5,
  eScore6,
  eScore7,
  eScore8,
  eScore9];

  const enemyA_Max = 10;
  // src を書き換えただけなら、耐久力・攻撃力・スコアの書き換えでOK。
  // 敵機の最大数 (htmlに設置した id の数)
  // Bタイプはないです。

  /*-- その他、微調整用変数 --*/

  const frameHeight = 500; //px フレームの縦の長さ
  const frameWidth = 500; //px フレームの横の長さ
  // フレームの縦幅、横幅を自動的に取得するコマンドを知らないので手動で入力する。
  // マウス移動による背景移動の限界値計算に使ってる。
  // 初期のフレームと背景の位置関係にも使ってる。
  // 開発中にフレームの寸法が変わったなら、ここを合わせて変更する。

  let life = 100;// 自機のHP
  
  let enemySpeed = 2;

  let level = 1;
  // ゲームの段階を示す変数
  // ページロード直後 ＝ 0、
  // ゲーム開始直後を10、点数が上がると11,12,13,...
  // ゲームクリア ＝ 30、
  // ゲームオーバー ＝ 40、をイメージ

  const addY = 70;
  // 照準は画面中央よりやや高め。
  // 照準を何ピクセル上にするか調整する変数。

  let scrollrate = 1;
  // 背景画像の移動速度係数。かけ算で処理される。
  // キー操作 「1」 「2」 「3」 でも変更可能

  const interval = 20;
  // マウス移動の計算間隔で使っている。
  // なんとなく 20 。処理が重いなら遅くする可能性あり。

  // 出てくる敵機の種類調整
  let firstE = 0; // 配列の中の何番から何番までの敵を出現させるか、の最初の数。初期値　0
  let lastE = 3; // 配列の中の何番から何番までのてきを出現させるか、の最後の数。初期値 3
  /* (例)
  firstE = 0 、 lastE = 3 の場合、
  配列の中の　0 , 1 , 2 が500x500フレーム内で動く。他は待機場所で待機
  */

  let n = 0; // 背景画像の指定 初期値 0 失敗中

  let score = 0; // 得点

  let enemyA = [];
  // 敵機の要素取得用
  // function.js と mouseMove.js が共用してる。

  let enemySizeA = []; // 各敵の大きさを入れておく。 function.js と mouseMove.js で使ってる。

  //-------  関数の窓口 -----------
let enemySizeup; // keyBoard.js から呼び出されてる
  // keyboard.js から呼び出されるため、
  // グローバルで名前だけ宣言しておく。
  // 本体は下のほう ↓↓
/*---------------------------
　　　　グローバルブロックここまで
---------------------------*/



/*-----------------------------
     ローカルブロックここから
    ここで宣言した変数、関数は
他のscriptファイルからは読み込まれない。
--------------------------------*/

document.addEventListener('DOMContentLoaded',
  function () {
    'use strict';

/*------------------------------------------------
　　　　            敵の拡大、攻撃処理
--------------------------------------------------*/
  let timer2; // 敵機の拡大処理、自機の被ダメージ判定で使用

  //function enemySize(){ // ← これはエラーになる
  //enemySizeup = function(){ // ← これは通る。
  enemySizeup = () => { // アロー関数も通る。アロー関数が最近

    clearTimeout(timer2);
    // これがないと、敵の種類を変えるごとに拡大が加速する。

    for (let i = firstE ; i < lastE ; i++) {
      enemyA[i] = document.querySelector("#enemyA" + i);
      // 敵の拡大部
      //enemyA[i].width = enemySize[i] + "px";
      //enemyA[i].height = enemySize[i] + "px";
      //console.log(enemyA[i].style.width); // この時点での大きさは200
      //console.log(enemyA[i].style.height); // この時点での大きさは200

      // 拡大処理
      if (enemySizeA[i] < 200) {
        enemySizeA[i] += enemySpeed;
        //console.log(enemySize[i]); // 25 「敵の初期配置」のときに一律20にしてあるので。
        enemyA[i].style.width = enemySizeA[i] + "px"; // 拡大はする
        enemyA[i].style.height = enemySizeA[i]/(enemyA[i].naturalWidth/enemyA[i].naturalHeight) + "px"; // 拡大はする
        //console.log(enemyA[i].style.width);
        //console.log(enemyA[i].style.height);
      } // if文の閉じ ここまでは正常に機能してる

      // ダメージ判定部
      if (enemySizeA[i] >= 200) {
        life -= eAttack[i];
       
        
        if (life >= 0) {
          console.log('Life : ' + life);
          document.querySelector('#life').textContent = 'Life：' + life;
          soundDamaged(); // やられた時の音呼び出し
          popEnemyA(i);
          // for文用の i を引数にして敵のリポップ関数を呼び出し。機能してるっぽい。
        } else {
          //document.querySelector('.game__wrapper').style.display = 'none';
          document.querySelector('.game__over').style.display = 'block';
          document.querySelector('#life').style.display = 'none';
          document.querySelector('#cockpit_01').style.display = 'none';
          document.querySelector('#bgimg0').style.display = 'none';
          document.querySelector('#targetScope0').style.display = 'none';
          document.querySelector('#bgm1').pause();
          bgm1.currentTime = 0;
          document.querySelector('#bgm2').play();
          firstE = 0;
          lastE = 0;
          setEnemies();// mouseMove.js の関数

          enemyA[0] = document.querySelector('#enemyA' + 0);
          enemyA[0].style.left = -500 + 'px';
          enemyA[0].style.top = -500 + 'px';
          
          
          //for (let i = 0; i < enemyA_Max; i++) {

          //}

    
        }

        // for文用の i を引数にして敵のリポップ関数を呼び出し。機能してるっぽい。

      } // if文の閉じ
    } // for文の閉じ

 /*--------------------------------------------------------------------------------------
  要調整部分　スコアによる敵機再配置　どれくらいがゲームとしてちょうどいいのか
  --------------------------------------------------------------------------------------*/

    /*---- スコアによる敵機の再配置 ----*/
    if (score >= 1000 && level === 1) {
      level = 2;
      document.getElementById('level').textContent = 'level : ' + level;
      enemySpeed = 4;
      firstE = 0;
      lastE = 4;
      setEnemies(); // 配置
      enemySizeup(); // 拡大開始
    } else if (score >= 2000 && level === 2) {
      level = 3;
      document.getElementById('level').textContent = 'level : ' + level;
      enemySpeed = 6;
      firstE = 1;
      lastE = 5;
      setEnemies(); // 配置
      enemySizeup(); // 拡大開始
    } else if (score >= 3000 && level === 3) {
      level = 4;
      document.getElementById('level').textContent = 'level : ' + level;
      enemySpeed = 8;
      firstE = 2;
      lastE = 6;
      setEnemies(); // 配置
      enemySizeup(); // 拡大開始
    } else if (score >= 4000 && level === 4) {
      level = 5;
      document.getElementById('level').textContent = 'level : ' + level;
      enemySpeed = 10;
      firstE = 4;
      lastE = 10;
      setEnemies(); // 配置
      enemySizeup(); // 拡大開始
    }
 /*--------------------------------------------------------------------------------------
 　　　　　　　　　　　　　　なんとなくここに置いた 
 -----------------------------------------------------------------------------------*/


    timer2 = setTimeout(enemySizeup, 200);
    // console.log('関数enemySizeupが呼び出されました');
    // こいつが元凶だった・・・。
    //setInterval なら繰り返し処理なので、処理の閉じカッコ 「 } 」 の後に配置するべき。
    // setTimeout は１回きりなので、全部の処理が終わる直前に入れる。

  } // enemySizeup の閉じ
  // timer2 = setInterval(enemySizeup, 200);
//-----敵の拡大、攻撃処理 ここまで


  /*------------------
  
    ローカル作業スペース

  --------------------*/
    



    


}, false); // DOMCon... の閉じ
/*------------------------------------------------
　　　　            ローカルブロックここまで
--------------------------------------------------*/

  /*------------------
  
    グローバル作業スペース

  ---------------------*/

    //enemyA = document.querySelector("#enemyA0");
    //console.log(enemyA.naturalWidth);
    //console.log(enemyA.naturalHeight);
    // 縮小表示前の本来の縦幅・横幅の取得成功


    //enemyA.naturalWidth/enemyA.naturalHeight // わり算

    // 例えば、横幅１２、縦幅４の画像があるとする。
    // タテヨコのわり算で３という数字が得られる。

    // 拡大して横幅が３０になった場合、縦幅は１０になればいいので、
    // 横幅を３で割ればいい。

    // enemySizeA[i] に横幅だけを格納し、
    // 縦幅は横幅÷３で求めさせれば、縦・横の寸法の違う画像でも自動で対応できる。

    /*
    for(let i = 0 ; i < enemyA_Max ; i++){
      enemyA[i] = document.querySelector("#enemyA" + i);
      enemyA[i].width = enemySizeA[i] + 'px';
      enemyA[i].height = enemySizeA[i]/(enemyA[i].naturalWidth/enemyA[i].naturalHeight) + 'px';
      console.log(enemyA[i].style.width);
      console.log(enemyA[i].style.height);
    }
    */


  // 当たり判定用の式作成
  //enemyA[i] = new Image();
  //enemyA[i].src = document.getElementById("enemyA" + i).src;
  // console.log(enemyA[i].width); // その敵の横幅取得
  // console.log(enemyA[i].height); // その敵の縦幅取得

  // その敵の縦・横幅(for文処理の中にあるとして)
  // enemyA[i].width
  // enemyA[i].height

  // その敵の左上端の座標(for文処理の中にあるとして)
  // enemyAX[i];
  // enemyAY[i];
  //for (let i = 0; i<enemyA_Max ; i++){
  //console.log(enemyAX[i]);
  //console.log(enemyAY[i]);
  //}

  // 照準の縦・横はすでに取得している。
  // target0.width
  // target0.height

  // 画面の中央の座標
  // frameWidth/2
  // frameHeight/2

  // 照準の左上端の座標
  // frameWidth/2 - target0.width/2
  // frameHeight/2 - target0.height/2 - addY // 真ん中よりやや上にある
  //console.log(frameWidth/2 - target0.width/2);
  //console.log(frameHeight/2 - target0.height/2 - addY);

  //( ( frameWidth/2 + target0.width/2 ) >= enemyAX[i] ) // x座標当たり
  //( enemyAX[i] + enemyA[i].width ) >=   frameWidth/2 - target0.width/2 // x座標当たり

  //( frameHeight/2 - target0.height/2 - addY + target0.height ) >= enemyAY[i] // y座標当たり
  //( enemyAY[i] + enemyA[i].height ) >= (frameHeight/2 - target0.height/2 - addY) // y座標当たり

  // この段階では敵機の拡大を無視した式。







