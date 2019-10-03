/*---------------------------
 キー操作割り当て
----------------------------*/

/*

キー 「 a 」 : 開発用チートキー。「 いきなり life = 0 」
キー 「 s 」 : 開発用チートキー。「 スコアに1000加算 」

スペースキー 「 」 : 当たり判定処理。＝自機の射撃。
マウスクリックは「要素の全選択」みたいになって画面が真っ青になることがある。。

キー 「 Enter 」 : 敵機の拡大開始。 ゲームスタートに近い。

画面や敵機が流れる速さ係数
キー 「 1 」 : 0.2 遅い
キー 「 2 」 : 1 普通
キー 「 3 」 : 5 速い (これぐらいがちょうどいい？)

キー 「 8 」 : 呼び出しテスト用
キー 「 9 」 : 呼び出しテスト用
キー 「 0 」 : 呼び出しテスト用

キー 「 x 」
画面上のマウスカーソルの可視・不可視切り替え。役に立ってない。

キー 「 z 」
背景画像・敵機・爆発のマウス追従をストップする

*/

/*-------------------------------------
          グローバルブロック ここから
--------------------------------------*/

// キーボード操作についての jsファイル なので、
// 外部から呼ばれることはないと思う。

/*-------------------------------------
          グローバルブロック ここまで
--------------------------------------*/

/*-------------------------------------
          ローカルブロック ここから
--------------------------------------*/
document.addEventListener('DOMContentLoaded',
  function () {
    'use strict';

    /*-------------------------------------
                 キーダウンイベント
    --------------------------------------*/
    let z_key = 'movable';
    // zキーイベント用関数
    // zキーを押しながらだとスクロールが全部止まる
    // 'movable' or 'locked'

    let num; // キーダウン、キーアップイベントで使ってる

    let mouseCursor = 'auto';
    // マウスカーソルの可視・不可視切り替え用。'none' か 'auto'かの文字列を格納。初期値:auto

    let l; // 画面上の life 表示要素取得用

    let s; // 画面上の score 表示要素取得用

    let lvl; // 画面上の level 要素取得用

    document.addEventListener('keydown', function (e) {

      switch (e.key) {

        case 'a':
          // 開発用チートキー
          life = -10; // いきなりライフ-10
          l = document.getElementById('HP');
          l.textContent = 'HP : ' + life;
          break;

        case 's':
          // 開発用チートキー
          score += 1000; // スコアに1000加算
          s = document.getElementById('score');
          s.textContent = 'Score : ' + score;
          break;

        case ' ': // 空白キー
          shoot(); // mouseMove.js の関数呼び出し
          break;

        case 'x':
          if (mouseCursor === 'auto') {
            document.body.style.cursor = 'none';
            mouseCursor = 'none';
          } else {
            document.body.style.cursor = 'auto';
            mouseCursor = 'auto';
          }
          break;

        case 'z':
          if (scrollrate !== 0) {
            num = scrollrate; // 一旦別の変数に記憶させる。 0.2 , 1 , 5 のうちのどの速さでやってるか分からないので。
            scrollrate = 0; // 動かなくする。背景・敵機・爆発画像全部が止まる。
            z_key = 'locked';
            // 戻し処理は keyupイベントで
          }
          break;

        case 'Enter':
          enemySpeed = 2;
          life = 100;
          document.querySelector('#life').innerHTML = 'Life : ' + life;
          score = 0;
          s = document.getElementById('score');
          s.textContent = 'Score : ' + score;

          level = 1;
          lvl = document.getElementById('level');
          lvl.textContent = 'level : ' + level;

          firstE = 0;
          lastE = 3;
          setEnemies();// mouseMove.js の関数
          // 配列０番～２番の敵を500x500フレーム内に呼び出して拡大モードにし、他は待機させておく関数
          enemySizeup(); // function.js の関数。敵機拡大開始

          setTarget();// mouseMove.js の関数。照準設置

          document.querySelector('#result').innerHTML = '';
          document.querySelector('.game__start').style.display = 'none';
          document.querySelector('#cockpit_01').style.display = 'block';
          document.querySelector('#bgimg0').style.display = 'block';
          document.querySelector('#score').style.display = 'block';
          document.querySelector('#level').style.display = 'block';
          document.querySelector('#life').style.display = 'block';
          document.querySelector('#targetScope0').style.display = 'block';
          document.querySelector('.game__wrapper').style.display = 'block';
          document.querySelector('.game__over').style.display = 'none';
          playBgm1(); // audio.js の関数呼び出し

          //初期化も合わせて処理しています
          break;

        case '1':
          scrollrate = 0.2;
          break;

        case '2':
          scrollrate = 1;
          break;

        case '3':
          scrollrate = 5;
          break;

        case '8':
          funcFreeA(); // freeSpaceA のテスト関数呼び出し
          break;

        case '9':
          funcFreeB(); // freeSpaceB のテスト関数呼び出し
          break;

        case '0':
          funcFreeC(); // freeSpaceC のテスト関数呼び出し
          break;

      } // switch文の閉じ

    }, false); // 'keydown'イベントの閉じ。


    /*-------------------------------------
                 キーアップイベント
    --------------------------------------*/
    // ポンと押すだけの操作ならキーアップイベントは必要がない。
    // 「 z 」 の押しっぱなしは問題を起こさないのでたいした処理ではない。
    // 矢印キーの押しっぱなし移動 と ジャンプや弾発射のキー操作 が衝突して問題を起こす。
    document.addEventListener('keyup', function (e) {

      switch (e.key) {
        case 'z':

          if (z_key === 'locked') {
            scrollrate = num; // 止めるときに一旦記憶させた値をもどす
            z_key = 'movable'; // 「動く」の意味
          }
          break;
      }

    }, false); // keyupイベントリスナーの閉じ

  }, false); // DOMCon... の閉じ


/*---------------------------
    作業スペース(ローカル)
----------------------------*/



/*-------------------------------------
          ローカルブロック ここまで
--------------------------------------*/


