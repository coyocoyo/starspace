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

キー 「 8 」 : BGM1 再生
キー 「 9 」 : BGM2 再生 (エラーの元になってる気がしたので停止中) → 敵機の組み合わせ変更キー
キー 「 0 」 : BGM3 再生 (エラーの元になってる気がしたので停止中) → 敵機の組み合わせ変更キー

キー 「 x 」
画面上のマウスカーソルの可視・不可視切り替え

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
    // ここでしか使わない変数なのでは。
    // 値を持ったままジッと待機していてもらう。

    document.addEventListener('keydown', function (e) {
      // if (!e) e = window.event;

      if (e.key === 'a') { // 開発用チートキー

        life = 0; // いきなりライフ０

      } else if (e.key === 's') { // 開発用チートキー

        score += 1000; // スコアに1000加算

      } else if (e.key === ' ') {
        shoot();
      } else if (e.key === 'x' && mouseCursor === 'auto') { // 「x」でマウスカーソルの可視・不可視切り替え
        document.body.style.cursor = 'none';
        mouseCursor = 'none'
      } else if (e.key === 'x' && mouseCursor === 'none') {
        document.body.style.cursor = 'auto';
        mouseCursor = 'auto' // 「x」 の処理ここまで

      } else if (e.key === 'z' && scrollrate !== 0) { // 「z」でスクロールロック
        num = scrollrate; // 一旦別の変数に記憶させる。 0.2 , 1 , 5 のうちのどの速さでやってるか分からないので。
        scrollrate = 0; // 動かなくする。背景・敵機・爆発画像全部が止まる。
        z_key = 'locked'; // 0 にする。 「動かない」の意keyupイベントが起きたら戻す。

      } else if (e.key === 'Enter') { // 「Enter」 で敵機の拡大・攻撃スタート

        firstE = 0;
        lastE = 3;
        setEnemies();
        enemySizeup();
        document.querySelector('.game__start').style.display = 'none';
        document.querySelector('#cockpit_01').style.display = 'block';
        document.querySelector('#bgimg0').style.display = 'block';



        // playBgm1();
        // 配列０番～２番の敵を500x500フレーム内に呼び出して拡大モードにし、他は待機させておく関数

      } else if (e.key === '1') { // scrollrate の操作
        scrollrate = 0.2;
      } else if (e.key === '2') {
        scrollrate = 1;
      } else if (e.key === '3') {
        scrollrate = 5; // scrollrate の処理ここまで

      } else if (e.key === '8') {
        //n = 1;
        //setBgimg(n); // 失敗中
        // playBgm1();
      } else if (e.key === '9') {

        firstE = 2;
        lastE = 5;
        setEnemies(); // 配置
        enemySizeup(); // 拡大開始

        // 配列2番～4番の敵を500x500フレーム内に呼び出して拡大モードにし、他は待機させておく関数

        // bgm2 再生 (エラーの元になってる気がしたので停止中)

      } else if (e.key === '0') {

        firstE = 3;
        lastE = 6;
        setEnemies(); // 配置
        enemySizeup(); // 拡大開始
        // 配列３番～５番の敵を500x500フレーム内に呼び出して拡大モードにし、他は待機させておく関数

        // playBgm3(); // bgm3 再生 (エラーの元になってる気がしたので停止中)

      }// if文の閉じ

    }, false); // 'keydown'イベントの閉じ。


    /*-------------------------------------
                 キーアップイベント
    --------------------------------------*/
    // ポンと押すだけの操作ならキーアップイベントは必要がない。
    // 「 z 」 の押しっぱなしは問題を起こさないのでたいした処理ではない。
    // 矢印キーの押しっぱなし移動 と ジャンプや弾発射のキー操作 が衝突して問題を起こす。
    document.addEventListener('keyup', function (e) {

      if (e.key === 'z' && z_key === 'locked') {
        scrollrate = num; // 一旦記憶させた値をもどす
        z_key = 'movable'; // 「動く」の意味
      } // if文の閉じ

    }, false); // keyupイベントリスナーの閉じ


  }, false); // DOMCon... の閉じ
/*-------------------------------------
          ローカルブロック ここまで
--------------------------------------*/


