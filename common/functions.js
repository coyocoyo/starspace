
/*---------------------------
 キー操作割り当て
----------------------------*/
/*

画面が流れる速さ係数
 キー
「 1 」 : 0.2 遅い
「 2 」 : 1 普通
「 3 」 : 5 速い (これぐらいがちょうどいい？)
係数を 0 にすれば移動しなくなる。
初期位置に飛ばすわけではない

画面上のマウスカーソルの可視・不可視切り替え
 キー
「 x 」

*/




/*---------------------------
　　　　グローバルブロックここから
---------------------------*/





/*---------------------------
　　　　グローバルブロックここまで
---------------------------*/



/*------------------------------------------------
　　　　            ローカルブロックここから
ここで宣言した変数、関数は他のscriptファイルからは読み込まれない。
--------------------------------------------------*/
document.addEventListener('DOMContentLoaded',
  function () {
    'use strict';

  const addY = 50;
  // 照準は画面中央よりやや高めだった。
  // 照準を何ピクセル上にするか調整する変数。

  const frameHeight = 500; //px ゲーム画面の縦の長さ
  const frameWidth = 500; //px ゲーム画面の横の長さ
  // フレームの縦幅、横幅を自動的に取得するコマンドを知らないので手動で入力する。

  const enemyA_Max = 3;
    // Aタイプの敵機の最大数 (設置した id の数)
    // for文処理での繰り返し回数のところで使う。
    // ゲーム中に変えないのであれば const

    let n = 0; // 背景画像変更用変数　id='bgimg0' の 「 0 」 の部分

  let scrollrate = 1;
  // 背景画像の移動速度係数。かけ算で処理される。
  // キー操作 「1」 「2」 「3」 で変更可能

  const interval = 20; // 処理全体が重いなら調整する。


  /*-- ここからは自分だけで完結するような雑用の変数 --*/

  let enemyAX = []; // Aタイプの敵機の各x座標
  let enemyAY = []; // Aタイプの敵機の各y座標
  let enemyA = []; // Aタイプの敵機の各縦幅、横幅

  let bgimg; // 背景用 width , height を取得するときに使ってる。
  let bgimgX; // x座標を格納する
  let bgimgY; // y座標を格納する

  let target0; // 照準用
  let target0X; // 慣れてくると雑用に近い変数
  let target0Y;

  let explosion; // 爆発画像用
  let explosionX = -500;
  let explosionY = -500;
  let stopper = 0; // 0 なら爆発は動かない。1なら動く。
  let timer; // 1000ミリ秒後に爆発を消す。
  let num; // キーダウン、キーアップイベント

  // 雑用に使ってる変数 動くのを確認したのでまとめて表記
  let beforeX,beforeY,afterX,afterY,diffX,diffY;
  let Xrate,Yrate,posX,posY;


  /*------------------------------------------------------
    背景画像の真ん中をframeの真ん中に配置する。
    背景変更はこのへんを関数でくくって呼び出すようにすれば対応できる。
  -------------------------------------------------------*/
  bgimg = new Image();
  bgimg.src = document.getElementById('bgimg' + n ).src; // 背景画像は複数枚用意される気配
  //console.log(bgimg.height); // 背景画像の縦幅
  //console.log(bgimg.width); // 背景画像の横幅

  // 背景画像の真ん中とフレームの真ん中を合わせた状態での
  // 背景画像の左上端の座標
  bgimgX = (frameWidth/2)-(bgimg.width/2);
  bgimgY = (frameHeight/2)-(bgimg.height/2);

  document.querySelector('#bgimg' + 0 ).style.left = bgimgX + 'px';
  document.querySelector('#bgimg' + 0 ).style.top = bgimgY + 'px';
  /*-- 真ん中処理ここまで --*/


  /*--------------------
        照準位置決定
    真ん中のやや上に配置する
  ---------------------*/
  target0 = new Image();
  target0.src = document.getElementById('targetScope' +0 ).src;
  //console.log(target0.height); // 照準画像の縦幅
  //console.log(target0.width); // 照準画像の横幅

  target0X = (frameWidth/2)-(target0.width/2);
  target0Y = (frameHeight/2)-(target0.height/2);

  document.querySelector('#targetScope' + 0 ).style.left = target0X + 'px';
  document.querySelector('#targetScope' + 0 ).style.top = ( target0Y - addY ) + 'px'; // 照準の上下微調整。これは手動で。
  /*------ 照準位置決定ここまで ------*/


/*-----------------------------------------
  敵機の初期配置 ページリロードの度に１回しかやらない。
------------------------------------------*/

  for (let i = 0 ; i < enemyA_Max ; i++) {

    // ここを変更する場合は、 当たり判定処理も同じように変えること。
    // 出現位置を決める。　背景画像の上下左右端10％程度を除外したい。
    // 10%では足りなかったが,用意したサンプル背景が小さいからかもしれない。
    // ％ で考えると画像の大きさで事情が変わる・・・
    Xrate = Math.floor(Math.random()*100); // 0~100が得られるはず。　％
    while ( Xrate <= 20 || Xrate >= 80){
      Xrate = Math.floor(Math.random()*100); // やり直し ％
    }
    posX = Math.floor(bgimg.width/100*Xrate) + bgimgX;
    enemyAX[i] = posX;

    Yrate = Math.floor(Math.random()*100); // ％
    while ( Yrate <= 20 || Yrate >= 80){ // 下が狙いにくいのでやや上に出現するように
      Yrate = Math.floor(Math.random()*100); // やり直し ％
    }
    posY = Math.floor(bgimg.height/100*Yrate) + bgimgY;
    enemyAY[i] = posY;

    enemyA[i] = document.querySelector('#enemyA' + i);
    enemyA[i].style.left = enemyAX[i] + 'px';
    enemyA[i].style.top = enemyAY[i] + 'px';

    //console.log(enemyA[i].style.left);
    //console.log(enemyA[i].style.top);

    //console.log(enemyAX[i]);
    //console.log(enemyAY[i]);

  } // for文の閉じ
  /*------ 敵機の初期配置ここまで ------*/


/*-------------------------------------
            マウス移動イベント
--------------------------------------*/
  // マウスが1ピクセルでも動いたら呼び出される処理
  // ここより下は１秒間に50回以上の速さで繰り返される。
  document.onmousemove = function (e) {
    if (!e) e = window.event; //　IE互換用

    // マウスイベントが起きた瞬間のカーソルの座標を取得
    beforeX = e.screenX;
    beforeY = e.screenY;

    setTimeout( function () { // 20ミリ秒に実行

      // マウスイベントが起きた瞬間から20ミリ秒後のカーソルの座標を取得
      afterX = e.screenX;
      afterY = e.screenY;

      // 引き算
      diffX = beforeX - afterX;
      diffY = beforeY - afterY;
      // diffX : マウスを右に動かすと正、左に動かすと負。 速めに動かすと 10~
      // diffY : マウスを下に動かすと正、上に動かすと負。 速めに動かすと 10~
      // マウスが動いた方向とおよその移動量が分かる。
      // 背景と敵機の爆発の３つに適用する。

      bgimgX += diffX*scrollrate; // 背景画像の仮のx座標
      bgimgY += diffY*scrollrate; // 背景画像の仮のy座標

      // x 座標の代入。 限界値を超えていたら限界値を代入。
      // 1回の処理で10px動くこともある。限界値を超えた値を代入させると面倒なことになる。
      if ( bgimgX >= 0 ){
        bgimgX = 0;
        document.querySelector('#bgimg' + 0 ).style.left = bgimgX + 'px';
      } else if ( (frameWidth - bgimg.width) >= bgimgX ){
        bgimgX = (frameWidth - bgimg.width);
        document.querySelector('#bgimg' + 0 ).style.left = bgimgX + 'px';
      } else{
        document.querySelector('#bgimg' + 0 ).style.left = bgimgX + 'px';
      }

      // y 座標の代入。 限界値を超えていたら限界値を代入。
      if ( bgimgY >= 0 ){
        bgimgY = 0;
        document.querySelector('#bgimg' + 0 ).style.top = bgimgY + 'px';
      } else if ( (frameHeight - bgimg.height) >= bgimgY ){
        bgimgY = (frameHeight - bgimg.height);
        document.querySelector('#bgimg' + 0 ).style.top = bgimgY + 'px';
      } else{
        document.querySelector('#bgimg' + 0 ).style.top = bgimgY + 'px';
      }

      // 敵機も一緒になって動く

      for(let i = 0 ; i < enemyA_Max ; i++){

        if ( bgimgX !== 0 && bgimgX !== (frameWidth - bgimg.width) ){ // 背景が限界値なら動かない
        document.querySelector('#enemyA' +i ).style.left = (enemyAX[i] += diffX*scrollrate) +'px';
        }

        //console.log(document.querySelector('#enemyA' +i ).style.left);

        if( bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height) ){ // 背景が限界値なら動かない
        document.querySelector('#enemyA' +i ).style.top = (enemyAY[i] += diffY*scrollrate) +'px';
        }

        //console.log(document.querySelector('#enemyA' +i ).style.top);

      } // for文の閉じ

    // 爆発も一緒になって動く。が、普段は動かない。
      if ( bgimgX !== 0 && bgimgX !== (frameWidth - bgimg.width) ){
        document.querySelector('#explosion').style.left = ( explosionX += diffX*scrollrate*stopper ) + 'px';
      }

      if( bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height) ){
        document.querySelector('#explosion').style.top = ( explosionY  += diffY*scrollrate*stopper ) + 'px';
      }

    } , interval); // setTimeout の閉じ
    // intervalミリ秒後のマウスカーソルの座標取得、引き算、座標代入が一連の動作
    // setTimeoutの文に入れるには長すぎる。

  }; // onmousemoveの閉じ 高速で繰り返される処理ここまで
/*----------------マウス移動イベントここまで--------------*/


/*-------------------------------------
             キーダウンイベント
--------------------------------------*/
  let mouseCursor = 'auto';
  // マウスカーソルの可視・不可視切り替え用。'none' か 'auto'かを格納。初期値:auto
  // ここでしか使わない変数なのでは。
  // 値を持ったままジッと待機していてもらう。

  document.addEventListener('keydown', function (e) {

    if (e.key === 'x' && mouseCursor === 'auto') { // 「x」でマウスカーソルの可視・不可視切り替え
      document.body.style.cursor = 'none';
      mouseCursor = 'none'
    } else if (e.key === 'x' && mouseCursor === 'none') {
      document.body.style.cursor = 'auto';
      mouseCursor = 'auto' // 「x」 の処理ここまで
    } else if (e.key === 'z' && scrollrate !== 0){
      num = scrollrate; // 一旦別の変数に記憶させてから
      scrollrate = 0; // 0 にする。 keyupイベントが起きたら戻す。
    } else if (e.key === '1'){ // scrollrate の操作
      scrollrate = 0.2;
    } else if (e.key === '2'){
      scrollrate = 1;
    } else if (e.key === '3'){
      scrollrate = 5; // scrollrate の処理ここまで
    }

  }, false); // 'keydown'イベントの閉じ。
  // いまのところ押しっぱなしの多い操作はないので、
  // keyupイベント
    
    
    document.addEventListener('keyup', function (e) {
      if (e.key === 'z') {
        scrollorate = num; // もどす。きれいに反応してくれればいいが。
    }
  }, false);
/*--------------------------------------
        マウスクリックイベント
---------------------------------------*/
function　mouseClick(){
  // console.log('マウスがクリックされました。');

  /*-- 敵の種類が Aタイプだった場合の処理 --*/


  for(let i = 0 ; i < enemyA_Max ; i++){
    enemyA[i] = new Image();
    enemyA[i].src = document.getElementById("enemyA" + i).src;
    if( // x座標の判定
      ( ( frameWidth/2 + target0.width/2 ) >= enemyAX[i] )
      &&
      ( enemyAX[i] + enemyA[i].width ) >=   (frameWidth/2 - target0.width/2)  ) {
        // x座標で当たっているなら下の処理に行く。外れているならif文を抜ける。
      if ( //y座標の判定
        ( frameHeight/2 + target0.height/2 - addY) >= enemyAY[i]
        &&
        ( enemyAY[i] + enemyA[i].height ) >= (frameHeight/2 - target0.height/2 - addY)
        ) {
        console.log('座標 ' + enemyAX[i] +',' + enemyAY[i] +' にて enemyA' +i +' に当たり判定');

        // 爆発画像
        explosionX = enemyAX[i]; // その時の座標取得
        explosionY = enemyAY[i]; // その時の座標取得
        explosion = document.querySelector('#explosion');
        explosion.style.left = explosionX + 'px';
        explosion.style.top = explosionY + 'px';
        stopper = 1; // この時だけ爆発も動く
        timer = setTimeout(remove,1000); // 1秒後に
        function remove() {
          stopper = 0; // 爆発を動かなくする
          explosionX = -500;
          explosionY = -500;
          explosion.style.left = explosionX + 'px';
          explosion.style.top = explosionY + 'px';
        }

        // 敵画像の再配置
        Xrate = Math.floor(Math.random()*100);
        while ( Xrate <= 20 || Xrate >= 80){ 
          Xrate = Math.floor(Math.random()*100);
        }
        posX = Math.floor(bgimg.width/100*Xrate) + bgimgX;
        enemyAX[i] = posX;

        Yrate = Math.floor(Math.random()*100);
        while ( Yrate <= 20 || Yrate >= 80){
        Yrate = Math.floor(Math.random()*100);
        }
        posY = Math.floor(bgimg.height/100*Yrate) + bgimgY;
        enemyAY[i] = posY;

        enemyA[i] = document.querySelector('#enemyA' + i);
        enemyA[i].style.left = enemyAX[i] + 'px';
        enemyA[i].style.top = enemyAY[i] + 'px';
        // 再配置処理 ここまで

      } // y座標の当たり処理の閉じ。 yで外れてるならここにくる
    } // x座標の当たり処理の閉じ。 xで外れてるならここにくる

  } // for文の閉じ

} // mouseClick の閉じ

document.addEventListener('click', mouseClick ,false);

}, false); // DOMCon... の閉じ
/*------------------------------------------------
　　　　            ローカルブロックここまで
--------------------------------------------------*/

  /*----------------------------------
  
    作業スペース

  ----------------------------------*/



  // 式作成
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








