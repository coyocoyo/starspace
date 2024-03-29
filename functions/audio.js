
/*-------------------------------------
          グローバルブロック ここから
--------------------------------------*/

/*---- 関数の窓口 ----*/

let soundShoot; // 発射音

let soundHit; // 自機の攻撃の命中音。破壊したとは限らない。

let soundDestroy; // 敵機の爆発音

let soundDamaged; // 攻撃を受けた時の音

let playBgm1; // BGM1再生

let playBgm2; //game overのbgm

// 外部からの関数を呼び出しを受け止めるために
// 関数の名前だけグローバルで宣言しておく。
// 関数の本体はローカルの中 ↓↓

/*-------------------------------------
          グローバルブロック ここまで
--------------------------------------*/

/*------------------------------------------------
　　　　            ローカルブロックここから
--------------------------------------------------*/
document.addEventListener('DOMContentLoaded',
  function () {
    'use strict';

    let soundShoot01, soundShoot02; // 連射制御用

    let R1 = 1; // ローテーション用変数 初期値 1
    soundShoot = () => {
      switch (R1) {
        case 1: soundShoot01(); break;
        case 2: soundShoot02(); break;
      } // switch の閉じ
    } // soundShoot の閉じ

    soundShoot01 = () => {
      document.querySelector('#soundShoot01').currentTime = 0; // 音源の再生位置を 0秒目からにする。
      document.querySelector('#soundShoot01').volume = 0.5; // 割とかん高い音で耳障りだった 
      document.querySelector('#soundShoot01').play();
      R1 = 2; // 切り替え。 次にsoundShoot()を実行するときは 02 のほうが鳴る。
    }

    soundShoot02 = () => {
      document.querySelector('#soundShoot02').currentTime = 0;
      document.querySelector('#soundShoot02').volume = 0.5; // 0 ~ 1 で設定する。
      document.querySelector('#soundShoot02').play();
      R1 = 1; // 切り替え。 次にsoundShoot()を実行したときは 03 のほうが鳴る。
    }
    // id を２つぐらい用意すれば軽い連打なら対応できてると思う。

    soundHit = () => {
      document.querySelector('#soundHit').currentTime = 0;
      document.querySelector('#soundHit').volume = 0.4; // 0 ~ 1 で設定する。
      document.querySelector('#soundHit').play();
    }

    // 敵機を撃墜したときの音
    soundDestroy = () => {
      document.querySelector('#soundDestroy').currentTime = 0;
      document.querySelector('#soundDestroy').volume = 0.8; // 0 ~ 1 で設定する。
      document.querySelector('#soundDestroy').play();
    }

    soundDamaged = () => {
      document.querySelector('#soundDamaged').currentTime = 0;
      document.querySelector('#soundDamaged').volume = 0.8; // 0 ~ 1 で設定する。
      document.querySelector('#soundDamaged').play();
    }

    playBgm1 = () => {
      document.querySelector('#bgm2').pause();
      bgm2.currentTime = 0;
      document.querySelector('#bgm1').volume = 1; // 0 ~ 1 で設定する。
      document.querySelector('#bgm1').play();
    }

    playBgm2 = () => {
      document.querySelector('#bgm1').pause();
      bgm1.currentTime = 0;
      document.querySelector('#bgm2').play();
    }




  }, false); // DOMCon... の閉じ

/*------------------------------------------------
　　　　            ローカルブロックここまで
--------------------------------------------------*/