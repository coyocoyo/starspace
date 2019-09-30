
/*---------------------------------------
        マウス移動、初期配置、再配置、
        自機からの攻撃当たり判定
          (座標が関係してくるもの)
-----------------------------------------*/

/*---------------------------
　　　　グローバルブロックここから
---------------------------*/
let popEnemyA;
let setEnemies; // keyBoard.jsからのテスト呼び出し
let setBgimg; // keyBoard.jsからのテスト呼び出し
let shoot;
// 他のjsファイルからの関数呼び出しリクエストを受け止めるために
// ローカルにある関数の'名前だけ'グローバルで宣言しておく。

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

    //-------  ローカル変数  -------------

    let bgimgX; // 背景の x 座標を格納する。
    let bgimgY; // 背景の y 座標を格納する。
    let bgimg;  // 背景用 width , height を取得するときに使ってる。

    // マウス移動による背景移動のときに使ってる。
    // 初期配置の背景、マウス移動で使ってる。

    let target0X;　// 照準の x 座標 
    let target0Y; // 照準の y 座標
    let target0;  // 照準の width , height を取得するときに使ってる。
    // 初期配置時に照準画像の寸法に合わせて自動的に調整座標を計算する。

    let enemyAX = []; // Aタイプの敵機の各x座標
    let enemyAY = []; // Aタイプの敵機の各y座標
    // let enemyA = []; // Aタイプの敵機の要素取得用

    let eRealLife = [];
    // 動いてる敵機の実際の残り耐久力を入れておく。

    let Xrate, Yrate;// 敵機の初期配置、再配置のときのランダム計算で使ってる

    let Hit; // 要素取得用
    let HitX = -500; // 爆発画像の x 座標　初期値-500
    let HitY = -500; // 爆発画像の y 座標 初期値-500
    let stopper2 = 0; // 命中画像の動き制御。 初期値 0
    let timer2; // マウスクリックの当たり判定処理で使ってる。 1000ミリ秒に爆発を消す。

    let explosion = []; // 要素取得用
    let explosionX = -500; // 爆発画像の x 座標　初期値-500
    let explosionY = -500; // 爆発画像の y 座標 初期値-500
    let stopper1 = 0;
    // 爆発画像の動き制御。 初期値 0
    // 0 なら爆発は動かない。1なら動く。
    // マウス移動で常時使ってるが、当たり判定からも操作される。
    let timer1; // マウスクリックの当たり判定処理で使ってる。 1000ミリ秒に爆発を消す。

    let beforeX, beforeY, afterX, afterY, diffX, diffY; // マウス移動計算用変数
    let posX, posY;



    /*-----------------------------------------------
                  関数
    
    
    ------------------------------------------------*/

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

      setTimeout(function () { // 20ミリ秒に実行

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
            document.querySelector('#explosion' + i).style.left = (explosionX += diffX * scrollrate * stopper1) + 'px';
          }

          if (bgimgY !== 0 && bgimgY !== (frameHeight - bgimg.height)) {
            document.querySelector('#explosion' + i).style.top = (explosionY += diffY * scrollrate * stopper1) + 'px';
          }




        } // for文の閉じ



      }, interval); // setTimeout の閉じ
      // intervalミリ秒後のマウスカーソルの座標取得、引き算、座標代入が一連の動作
      // setTimeoutの文に入れるには長すぎる。

    }; // onmousemoveの閉じ 高速で繰り返される処理ここまで

    /*--------------------------
             当たり判定
    --------------------------*/

    shoot = function () {

      soundShoot(); // 弾発射音呼び出し　サンプルはちょっと耳障り

      for (let i = firstE; i < lastE; i++) {
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

            soundHit(); // 自機の攻撃が当たった時の音呼び出し
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
              soundDestroy(); // 爆発音呼び出し
              score += eScore[i];
              console.log(score);
              document.querySelector('#score').textContent = 'Score：' + score + '点';
              // 爆発画像を持ってくる
              explosionX = (enemyAX[i] + enemySizeA[i] / 4); // その時の敵機の座標 - ザックリ調整
              explosionY = (enemyAY[i] + enemySizeA[i] / 4); // その時の敵機の座標 - ザックリ調整
              popEnemyA(i); // i の値をそのまま引数にしてpopEnemy呼び出し
              explosion[i] = document.querySelector('#explosion' + i);
              explosion[i].style.left = explosionX + 'px';
              explosion[i].style.top = explosionY + 'px';
              stopper1 = 1; // この時だけ爆発も動く
              timer1 = setTimeout(remove1(i), 1000); // 1秒後に remove() へ

            } // if文の閉じ

          } // y座標の当たり処理の閉じ。 yで外れてるならここにくる
        } // x座標の当たり処理の閉じ。 xで外れてるならここにくる
      } // for文の閉じ

      function remove1(i) {
        stopper1 = 0; // 爆発を動かなくする
        explosionX = -500; // 画面外に逃がす
        explosionY = -500; // 画面外に逃がす
        explosion[i] = document.querySelector('#explosion' + i);
        explosion[i].style.left = explosionX + 'px';
        explosion[i].style.top = explosionY + 'px';
      } // remove1 の閉じ
    } // shoot() の閉じ

    /*--------------------------
          当たり判定ここまで
   --------------------------*/

    /*--------------------------------------
            マウスクリック
     ---------------------------------------*/

    document.addEventListener('click', shoot, false);
    // これだけ

    /*--------------------------------------
           マウスクリック ここまで
   ---------------------------------------*/

    /*---使わない敵機を待機位置に移す
     ----*/
    function removeEnemy(i) {
      enemyA[i] = document.querySelector('#enemyA' + i);
      enemyA[i].style.left = -500 + 'px';
      enemyA[i].style.top = -500 + 'px';
    }
    /*----
   ------*/

    /*----爆発画像を待機位置に移す
     -------*/

    /*-----
  --------*/

    /*----命中画像を待機位置に移す
     -------*/
    function remove2() {
      stopper2 = 0; // 命中を動かなくする
      HitX = -500; // 画面外に逃がす
      HitY = -500; // 画面外に逃がす
      Hit = document.querySelector('#Hit');
      Hit.style.left = HitX + 'px';
      Hit.style.top = HitY + 'px';
    } // remove2 の閉じ
    /*--------
   --------*/


    /*-------------------------------------
      popEnemy(i) 敵画像の500x500フレーム内配置
    --------------------------------------*/
    popEnemyA = function (i) {

      // console.log(i); // for文の外だが、1とか2とか正しく出る。
      // 関数内のローカル変数になったので(カレント？)、
      // 呼び出し元のfor文用 i の影響は受けないはずだが。

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
      enemySizeA[i] = 20; // 暫定的な設置なので要注意
      //---------------------------------------------------------------------------------
      enemyA[i].style.width = enemySizeA[i] + 'px';
      enemyA[i].style.height = enemySizeA[i] / (enemyA[i].naturalWidth / enemyA[i].naturalHeight) + 'px';
      //console.log(enemyA[i].style.width);
      //console.log(enemyA[i].style.height);

      eRealLife[i] = eDefaultLife[i];
      // 残り耐久力に初期値を代入。
      // 値だけが代入される。
      // Real が引き算されても Default は引き算されない。

      // console.log('popEnemyAが呼び出されました。')
    } // PopEnemyA の閉じ

    /*------------------------------------------------------
        背景画像の真ん中をframeの真ん中に配置する。
        背景変更はこのへんを関数でくくって呼び出すようにすれば対応できる。
    -------------------------------------------------------*/
    setBgimg = function () {
      bgimg = new Image();
      bgimg.src = document.getElementById('bgimg' + 0).src; // 背景画像は複数枚用意される気配
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
        真ん中のやや上に配置する
           １リロードに１回
    ----------------------------*/
    function setTarget() {
      target0 = new Image();
      target0.src = document.getElementById('targetScope' + 0).src;
      //console.log(target0.height); // 照準画像の縦幅
      //console.log(target0.width); // 照準画像の横幅

      target0X = (frameWidth / 2) - (target0.width / 2);
      target0Y = (frameHeight / 2) - (target0.height / 2);

      document.querySelector('#targetScope' + 0).style.left = target0X + 'px';
      document.querySelector('#targetScope' + 0).style.top = (target0Y - addY) + 'px'; // 照準の上下微調整。これは手動で。
      /*------ 照準位置決定ここまで ------*/
    }

    /*----敵機の初期配置、更新配置
     -----*/
    setEnemies = function () {
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
    /*-------------
   ----------------*/
    // n = 0; // 失敗中
    setBgimg(); // 1回のページリロードにつき1回だけの処理 id=bgimg0 の背景画像を呼び出している。
    setTarget(); // 1回のページリロードにつき1回だけの処理
    setEnemies(); // 敵機の初期配置のために１回呼び出しておく。

  }, false); // DOMCon... の閉じ

/*-----------------------

    ローカル作業スペース

------------------------*/

/*
eRealLife[4] = eDefaultLife[4];
eRealLife[4] --; // 1 を引く
console.log(eDefaultLife[4]);
console.log(eRealLife[4]);
*/

/*------------------------------------------------
　　　　            ローカルブロックここまで
--------------------------------------------------*/

/*-----------------------

     グローバル作業スペース

------------------------*/








