
/*---------------------------------------
        マウス移動、初期配置、再配置、
        自機からの攻撃当たり判定
          (座標が関係してくるもの)
-----------------------------------------*/

/*---------------------------
　　　　グローバルブロックここから
---------------------------*/
let popEnemyA; // functions.js からの呼び出しあり。
let setEnemies; // keyBoard.jsからの呼び出しあり。
let setTarget; // functions.js からの呼び出しあり。
let setBgimg; // keyBoard.jsからのテスト呼び出し → 停止中
let shoot; // keyBoard.js からの呼び出しあり。
let removeEnemy; // function.js から呼び出されてる。
// 他のjsファイルからの関数呼び出しリクエストを受け止めるために
// ローカルにある関数の'名前だけ'グローバルで宣言しておく。

/*---------------------------
　グローバルブロックここまで
---------------------------*/



/*------------------------------------------------
　　　　            ローカルブロックここから
 ここで宣言した変数は、他のjs.ファイルからは読み込まれない。
 変数の命名が自由だとも言える。
--------------------------------------------------*/
document.addEventListener('DOMContentLoaded',
  function () {
    'use strict';

    //-------  ローカル変数  -------------

    let bgimgX; // 背景の x 座標を格納する。
    let bgimgY; // 背景の y 座標を格納する。
    let bgimg;  // 背景用 width , height を取得するときに使ってる。

    // マウス移動による各画像の移動に使ってる。

    let target0X;　// 照準の x 座標 
    let target0Y; // 照準の y 座標
    let target0;  // 照準の width , height を取得するときに使ってる。
    // 初期配置時に照準画像の寸法に合わせて自動的に真ん中やや上の座標に調整する。

    let enemyAX = []; // Aタイプの敵機の各x座標
    let enemyAY = []; // Aタイプの敵機の各y座標
    // let enemyA = []; // Aタイプの敵機の要素取得用。
    // functions.jsも使ってるのでグローバルに置いてみたが、別個に同名の変数を宣言しても問題ない。

    let eRealLife = [];
    // 動いてる敵機の実際の残り耐久力を入れておく。

    let Xrate, Yrate;// 敵機の初期配置、再配置のときのランダム計算で使ってる

    let Hit; // 要素取得用
    let HitX = -500; // 爆発画像の x 座標　初期値-500
    let HitY = -500; // 爆発画像の y 座標 初期値-500
    let stopper2 = 0; // 命中画像の動き制御。 初期値 0
    let timer2; // マウスクリックの当たり判定処理で使ってる。 200ミリ秒後に爆発を消す。

    let explosion; // 要素取得用
    let explosionX = -500; // 爆発画像の x 座標　初期値-500
    let explosionY = -500; // 爆発画像の y 座標 初期値-500
    let stopper1 = 0;
    // 爆発画像の動き制御。 初期値 0
    // 0 なら爆発は動かない。1なら動く。
    // マウス移動で常時使ってるが、当たり判定からも操作される。
    let timer1; // マウスクリックの当たり判定処理で使ってる。 1000ミリ秒後に爆発を消す。

    let beforeX, beforeY, afterX, afterY, diffX, diffY; // マウス移動計算用変数
    let posX, posY;

    let s; // 画面表示のscore要素取得用。

    /*--------------------------
             当たり判定
    --------------------------*/
    // グローバルで名前だけ宣言してある関数の本定義
    //function = shoot(){ // ← エラーになる。
    //shoot = function(){ // ← この形は通る。
    shoot = () => { // アロー関数も通る。関数の呼び合いが前提なら、アロー関数が主流になるのは分かる気がする。

      soundShoot(); // audio.js の関数呼び出し

      for (let i = firstE; i < lastE; i++) {
        target0 = document.querySelector('#targetScope' + 0); // ページロード時のsetTarget();がなくなったので。
        enemyA[i] = document.querySelector("#enemyA" + i);
        //console.log(enemyA[i].style.width); // 機能してる
        //console.log(enemyA[i].style.height); // 機能してる
        // 元サイズではなく、その時点での縮小サイズ
        // 小数を含む値だと比べるのに都合が悪いんだろうか？
        // ログをよく見ると単位'px'がついてる。 ＝ 数値ではなく文字列なので、数値との大小比較はできない。

        if ( // x座標の判定
          ((frameWidth / 2 + target0.width / 2) >= enemyAX[i])
          &&
          (enemyAX[i] + enemySizeA[i]) >= (frameWidth / 2 - target0.width / 2)) {
          // x座標で当たっているなら下の処理に行く。外れているならif文を抜ける。
          if ( //y座標の判定
            (frameHeight / 2 + target0.height / 2 - addY) >= enemyAY[i]
            &&
            (enemyAY[i] + enemySizeA[i] / (enemyA[i].naturalWidth / enemyA[i].naturalHeight)) >= (frameHeight / 2 - target0.height / 2 - addY)
          ) {
            // console.log('座標 ' + enemyAX[i] +',' + enemyAY[i] +' にて enemyA' +i +' に当たり判定');

            soundHit(); // audio.jsの関数呼び出し
            // 命中エフェクト画像を持ってくる
            HitX = (enemyAX[i] + enemySizeA[i] / 4); // その時の敵機の座標 - ザックリ調整
            HitY = (enemyAY[i] + enemySizeA[i] / 4); // その時の敵機の座標 - ザックリ調整
            Hit = document.querySelector('#Hit');
            Hit.style.left = HitX + 'px';
            Hit.style.top = HitY + 'px';
            stopper2 = 1; // この時だけ命中エフェクトも動く
            timer2 = setTimeout(remove2, 200); // 0.2秒後に remove() へ
            eRealLife[i]--; // i番の敵機の耐久力－１

            if (eRealLife[i] === 0) { // もし、i番の敵機の耐久力が0ならば

              // 爆発
              soundDestroy(); // audio.jsの呼び出し
              score += eScore[i];
              // 敵毎にもらえる点数を個別に設定してる。
              // enemySizeA[i]がスコープ的にまだ有効なので
              // eScore[i] - enemySizeA[i] にすると
              // 「 敵が小さいうちに倒すと高得点 」 にできる。

              //s = document.getElementById('score');
              //s.textContent = 'Score : ' + score + ''点;
              //console.log(score);
              s = document.querySelector('#score');
              s.textContent = 'Score：' + score + '点';
              // 爆発画像を持ってくる
              explosionX = (enemyAX[i] - enemySizeA[i] / 2); // その時の敵機の座標 - ザックリ調整
              explosionY = (enemyAY[i] - enemySizeA[i] / 2); // その時の敵機の座標 - ザックリ調整
              popEnemyA(i); // i の値をそのまま引数にしてpopEnemy呼び出し
              explosion = document.querySelector('#explosion');
              explosion.style.left = explosionX + 'px';
              explosion.style.top = explosionY + 'px';
              stopper1 = 1; // この時だけ爆発も動く
              timer1 = setTimeout(remove1, 1000); // 1秒後に remove() へ

            } // if文の閉じ

          } // y座標の当たり処理の閉じ。 yで外れてるならここにくる
        } // x座標の当たり処理の閉じ。 xで外れてるならここにくる
      } // for文の閉じ


    } // shoot() の閉じ

    /*--------------------------
          当たり判定ここまで
   --------------------------*/


    /*---------------------------
    使わない敵機を待機位置に移す
     ---------------------------*/
    removeEnemy = (i) => { // アロー関数
      enemyA[i] = document.querySelector('#enemyA' + i);
      enemyA[i].style.left = -500 + 'px';
      enemyA[i].style.top = -500 + 'px';
    }


    /*-------------------------------------
      popEnemy(i) 敵画像の500x500フレーム内配置
    --------------------------------------*/
    popEnemyA = (i) => {

      // console.log(i); // 呼び出し元の i はスコープが切れてるが、1とか2とか正しく出る。

      do {
        Xrate = Math.floor(Math.random() * 100);
      } while (Xrate <= 30 || Xrate >= 70);

      posX = Math.floor(bgimg.width / 100 * Xrate) + bgimgX; // // x座標決定
      enemyAX[i] = posX; // 代入 変数 i も有効のはず

      do {
        Yrate = Math.floor(Math.random() * 100);
      } while (Yrate <= 30 || Yrate >= 70);

      posY = Math.floor(bgimg.height / 100 * Yrate) + bgimgY; // y座標決定
      enemyAY[i] = posY; // 代入 変数 i も有効のはず

      enemyA[i] = document.querySelector('#enemyA' + i);
      enemyA[i].style.left = enemyAX[i] + 'px'; // 座標代入 この瞬間に敵機がワープする
      enemyA[i].style.top = enemyAY[i] + 'px'; // 座標代入 この瞬間に敵機がワープする
      //---------------------------------------------------------------------------------
      enemySizeA[i] = 10; // 暫定的な設置なので要注意。 CSSでは10設定だった。
      //---------------------------------------------------------------------------------
      enemyA[i].style.width = enemySizeA[i] + 'px';
      enemyA[i].style.height = enemySizeA[i] / (enemyA[i].naturalWidth / enemyA[i].naturalHeight) + 'px';
      //console.log(enemyA[i].style.width);
      //console.log(enemyA[i].style.height);

      eRealLife[i] = eDefaultLife[i];
      // 残り耐久力に初期値を代入。
      // 値だけが代入される。
      // Real が引き算されても Default は引き算されないらしい。
      // 参照を共有してるわけではないっぽい。

    } // PopEnemyA の閉じ

    /*----------------------------------------------------------
              背景画像の真ん中をframeの真ん中に配置する。
    -----------------------------------------------------------*/
    setBgimg = () => {
      bgimg = new Image();
      bgimg.src = document.getElementById('bgimg' + 0).src;
      //console.log(bgimg.height); // 背景画像の縦幅
      //console.log(bgimg.width); // 背景画像の横幅

      // 背景画像の真ん中とフレームの真ん中を合わせた状態での
      // 背景画像の左上端の座標
      bgimgX = (frameWidth / 2) - (bgimg.width / 2);
      bgimgY = (frameHeight / 2) - (bgimg.height / 2);

      document.querySelector('#bgimg' + 0).style.left = bgimgX + 'px';
      document.querySelector('#bgimg' + 0).style.top = bgimgY + 'px';
      /*-- 真ん中処理ここまで --*/
    }

    /*--------------------------
            照準位置決定
        真ん中のやや上に配置する。
    ----------------------------*/
    setTarget = () => {
      target0 = new Image();
      target0.src = document.getElementById('targetScope' + 0).src;
      //console.log(target0.height); // 照準画像の縦幅
      //console.log(target0.width); // 照準画像の横幅

      target0X = (frameWidth / 2) - (target0.width / 2);
      target0Y = (frameHeight / 2) - (target0.height / 2);

      document.querySelector('#targetScope' + 0).style.left = target0X + 'px';
      document.querySelector('#targetScope' + 0).style.top = (target0Y - addY) + 'px';
      /*------ 照準位置決定ここまで ------*/
    }



    /*-----------------------
     敵機の初期配置、更新配置
     -----------------------*/
    setEnemies = () => {
      for (let i = 0; i < firstE; i++) {
        removeEnemy(i);
      } // for文の閉じ

      for (let i = firstE; i < lastE; i++) {
        popEnemyA(i);
      } // for文の閉じ

      for (let i = lastE; i < enemyA_Max; i++) {
        removeEnemy(i);
      } // for文の閉じ
    } // setEnemies の閉じ


    /*-------------------------------------
                マウス移動イベント
     -------------------------------------*/
    // マウスが1ピクセルでも動いたら呼び出される処理
    // ここより下は１秒間に50回以上の速さで繰り返される。
    document.onmousemove = function (e) {
      if (!e) e = window.event; //　IE互換用

      // マウスイベントが起きた瞬間のカーソルの座標を取得
      beforeX = e.screenX;
      beforeY = e.screenY;

      setTimeout(function () { // 20ミリ秒後に実行

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

        bgimgX += diffX * scrollrate; // 背景画像の仮のx座標
        bgimgY += diffY * scrollrate; // 背景画像の仮のy座標

        // x 座標の代入。 限界値を超えていたら限界値を代入。
        // 1回の処理で10px動くこともある。限界値を超えた値を代入させると面倒なことになる。
        if (bgimgX >= 0) {
          bgimgX = 0;
          document.querySelector('#bgimg' + 0).style.left = bgimgX + 'px';
        } else if ((frameWidth - bgimg.width) >= bgimgX) {
          bgimgX = (frameWidth - bgimg.width);
          document.querySelector('#bgimg' + 0).style.left = bgimgX + 'px';
        } else {
          document.querySelector('#bgimg' + 0).style.left = bgimgX + 'px';
        }

        // y 座標の代入。 限界値を超えていたら限界値を代入。
        if (bgimgY >= 0) {
          bgimgY = 0;
          document.querySelector('#bgimg' + 0).style.top = bgimgY + 'px';
        } else if ((frameHeight - bgimg.height) >= bgimgY) {
          bgimgY = (frameHeight - bgimg.height);
          document.querySelector('#bgimg' + 0).style.top = bgimgY + 'px';
        } else {
          document.querySelector('#bgimg' + 0).style.top = bgimgY + 'px';
        }

        // 敵機も一緒になって動く

        for (let i = firstE; i < lastE; i++) {

          if (bgimgX !== 0 && bgimgX !== (frameWidth - bgimg.width)) { // 背景が限界値なら動かない
            document.querySelector('#enemyA' + i).style.left = (enemyAX[i] += diffX * scrollrate) + 'px';
          }

          //console.log(document.querySelector('#enemyA' +i ).style.left);

          if (bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height)) { // 背景が限界値なら動かない
            document.querySelector('#enemyA' + i).style.top = (enemyAY[i] += diffY * scrollrate) + 'px';
          }

          //console.log(document.querySelector('#enemyA' +i ).style.top);

          // 命中エフェクトも一緒になって動く。が、普段は動かない。
          if (bgimgX !== 0 && bgimgX !== (frameWidth - bgimg.width)) {
            document.querySelector('#Hit').style.left = (HitX += diffX * scrollrate * stopper2) + 'px';
          }

          if (bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height)) {
            document.querySelector('#Hit').style.top = (HitY += diffY * scrollrate * stopper2) + 'px';
          }

          // 爆発も一緒になって動く。が、普段は動かない。
          if (bgimgX !== 0 && bgimgX !== (frameWidth - bgimg.width)) {
            document.querySelector('#explosion').style.left = (explosionX += diffX * scrollrate * stopper1) + 'px';
          }

          if (bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height)) {
            document.querySelector('#explosion').style.top = (explosionY += diffY * scrollrate * stopper1) + 'px';
          }

        } // for文の閉じ

      }, interval); // setTimeout の閉じ
      // intervalミリ秒後のマウスカーソルの座標取得、引き算、座標代入が一連の動作
      // setTimeoutの文に入れるには長すぎる。

    }; // onmousemoveの閉じ 高速で繰り返される処理ここまで


    /*--------------------------------------
           マウスクリック
   ---------------------------------------*/

    document.addEventListener('click', shoot, false);
    // これだけ。　

    /*--------------------------------------
           マウスクリック ここまで
   ---------------------------------------*/

    /*-----------------------
    爆発画像を待機位置に移す
     -----------------------*/
    function remove1() {
      stopper1 = 0; // 爆発を動かなくする
      explosionX = -500; // 画面外に逃がす
      explosionY = -500; // 画面外に逃がす
      explosion = document.querySelector('#explosion');
      explosion.style.left = explosionX + 'px';
      explosion.style.top = explosionY + 'px';
    } // remove1 の閉じ


    /*-----------------------
    命中画像を待機位置に移す
     -----------------------*/
    function remove2() {
      stopper2 = 0; // 命中を動かなくする
      HitX = -500; // 画面外に逃がす
      HitY = -500; // 画面外に逃がす
      Hit = document.querySelector('#Hit');
      Hit.style.left = HitX + 'px';
      Hit.style.top = HitY + 'px';
    } // remove2 の閉じ


    setBgimg(); // 1回のページリロードにつき1回だけの処理 id=bgimg0 の背景画像を呼び出している。

  }, false); // DOMCon... の閉じ

/*-------------------------

    ローカル作業スペース

--------------------------*/

/*----------------------------------------------------
　　　　       ローカルブロックここまで
----------------------------------------------------*/

/*--------------------------

     グローバル作業スペース

---------------------------*/


/*

[ マウスカーソルの座標ではなく、その移動量を取得したい。]

マウスムーブイベント発生(わずかでも動いたらイベント発生)
↓
発生した瞬間のマウスカーソルの座標取得し、変数に格納
document.onmousemove = function (e) {
x格納用変数 = e.screenX; (x座標の数値)
y格納用変数 = e.screenY; (y座標の数値)
}
↓
20ミリ秒後にもう１度座標を取得
setTimeout(function(){
x格納用変数２ = e.screenX;
y格納用変数２ = e.screenY;
},20)
↓
x同士、y同士の引き算を行う。
( x の引き算の答えが正なら、マウスは右に動いたことになる。)
↓
背景image,敵機image,命中エフェクトimage,爆発エフェクトimageの座標に
それぞれ加算(代入ではない)すれば、これらが同期して動き、
自機のほうが旋回しているように見える。

(追記)
背景画像などの座標 ＝ 移動前の座標 ＋ ( マウスの移動量 x 移動速度係数 x ストッパー ) +'px';
みたいな形で使用した。
移動速度係数は動くもの全ての座標に使われており、これを０にすると全部を一斉に止めることができる。
ｚキーでの固定はこれを０にしてる。

ストッパー(変数)は命中エフェクトや爆発エフェクトを止めておくのに使用。背景、敵機には使っていない。
普段は値が０で、命中や爆発を待機場所から動かないようにする。
命中や爆発が画面内に呼ばれたときだけ値が１になって他の画像と同期して動くようになる。
待機場所にもどると同時にまた値が０になる。
便利だな、と思ったので。

*/



/*

[ 画面外で待機する敵 と 画面内で動く敵を切り替える ]

配列の中に敵機の要素が格納されてるとする。 → [e0,e1,e2,e3,e4,e5,e6,e7,e8,e9]
定数 enemyA_Max = 10; (用意した敵機の数。配列に入ってるので、配列の長さで表現してもいい。)
変数 firstE = 2;
変数 lastE = 5; が代入されてるときに
下記の関数 setEnemies が呼ばれると

    setEnemies = function () {

      for (let i = 0 ; i < firstE ; i++) {
                          ( = 2 )

        removeEnemy(i);
        // i番の敵機を待機場所に移す関数

      }  // → 0番、1番 の敵機が待機場所へ


      for (let i = firstE ; i < lastE ; i++) {
                   ( = 2 )     ( = 5 )

        popEnemyA(i);
        // i番の敵機を画面内に移す関数

      } // → 2番、3番、4番 の敵機が画面内へ


      for (let i = lastE ; i < enemyA_Max ; i++) {
                  ( = 5 )        ( = 10 )

        removeEnemy(i);
        // i番の敵機を待機場所に移す関数

      } // → 5番 ～ 9番の敵機が待機場所へ。エラーなし。
    }
    // 用意した敵機を 待機組 と 画面内組 に振り分けできる。
    // ゲーム中にこの処理をやると、目の前の敵機がいきなり消えるという欠点もある。

*/


