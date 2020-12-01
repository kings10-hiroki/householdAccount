'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

/**
 * TODO:
 * - 備考のキーを作る
 */
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-27T17:01:17.194Z',
    '2020-11-29T10:36:17.929Z',
    '2020-11-30T10:51:36.790Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
/**
 * 入出金の備考に表示されるdateの日付を下記の形式で出力する
 * - today
 * return 'Today'
 * - yesterday
 * return 'Yesterday'
 * - 7日以内
 * return {本日から経過した日数} days ago
 * - 7日より大きい
 * return yyyy/mm/dd
 * @function
 * @param {Date} date
 * @param {string} locale
 * @return {string}
 */
/**
 * TODO:
 * - 備考の日付の形式を日本語にする
 */
const formatMovementDate = (date, locale) => {
  /**
   * date2 - date1の日数を計算する
   * @function
   * @param {Date} date1
   * @param {Date} date2
   * @return {number}
   */
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // ex) locale:'ja-JP' -> yyyy/mm/dd
  return new Intl.DateTimeFormat(locale).format(date);
};

/**
 * 金額のフォーマットを整える
 * - ex) 130254 -> ￥130,254
 * @function
 * @param {number} value
 * @param {string} currency
 * @param {string} locale
 * @return {string}
 */
const formatCur = (value, currency, locale) => {
  const options = {
    style: 'currency',
    currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * TODO:
 * - deposit -> 収入, withdrawal -> 支出
 * <div class="movements__type movements__type--deposit">2 deposit</div>
 */
/**
 * HTML文を作成して所定の場所に挿入する、ソート機能あり
 * - HTML
 * <div class="movements__row">
 *  <div class="movements__type movements__type--deposit">2 deposit</div>
 *  <div class="movements__date">3 days ago</div>
 *  <div class="movements__value">4 000€</div>
 * </div>
 * - 所定の場所
 * <div class="movements">[挿入]</div>
 * - ソート
 * パラメーターでsort=trueの場合、入出金を昇順で並び替え
 * @function
 * @param {Object.<number>} acc アカウントオブジェクト
 * @param {boolean} sort
 */
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  // sort .slice() : シャローコピー
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.currency, acc.locale);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  // 偶数の行に対してbackgroundColorを設定
  // スプレッド構文を使用して新しい配列を作成
  [...document.querySelectorAll('.movements__row')].forEach((el, i) => {
    if (isEven(i)) {
      el.style.backgroundColor = '#EEEEEE';
    }
  });
};

/**
 * usernameを作成する
 * - 'Steven Thomas Williams' => 'stw'
 * @function
 * @param {Array.<object>} accs
 */
const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

// Heapの仕組みにより各accountのプロパティusernameが保存される
createUsernames(accounts);

/**
 * 口座金額の動きから残高を計算する
 * - movementsの数字をすべて足し算する
 * - labelBalanceに足した金額をtextContentで出力する
 * @function
 * @param {Object.<number>} acc アカウントオブジェクト
 */
const calcPrintBalance = acc => {
  // accountsオブジェクトのプロパティbalanceを新たに作成して保存
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  const formattedBal = formatCur(acc.balance, acc.currency, acc.locale);

  labelBalance.textContent = `${formattedBal}`;
};

/**
 * 口座金額の動きから以下を計算して、画面に出力させる
 * - 収入合計
 * - 支出合計
 * - 利息合計
 * @function
 * @param {Object.<number>} acc アカウントオブジェクト
 */
/**
 * TODO:
 * - 利息合計の代わりに「収入－支出」の欄を設ける
 */
const calcDisplaySummary = acc => {
  // 利率
  const intRatePercent = acc.interestRate / 100;

  // 収入合計
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  // 支出合計
  const outgoings = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );

  // 利息合計
  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * intRatePercent)
    // １以上の値を返す
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  // Format value
  const formattedInc = formatCur(incomes, acc.currency, acc.locale);
  const formattedOut = formatCur(outgoings, acc.currency, acc.locale);
  const formattedInt = formatCur(interests, acc.currency, acc.locale);

  // 画面表示
  labelSumIn.textContent = `${formattedInc}`;
  labelSumOut.textContent = `${formattedOut}`;
  labelSumInterest.textContent = `${formattedInt}`;
};

/**
 * 偶数かどうか判定する
 * - 偶数: true, 奇数: false
 * @function
 * @param {number} n
 * @return {boolean}
 */
const isEven = n => n % 2 === 0;

// Event hundler
/**
 * UIを更新する
 * - 残高を計算する
 * - 口座の収入、支出、利息を計算する
 * - 口座の金額の動きを計算する
 * @function
 * @param {Object.<number>} acc
 */
const updateUI = acc => {
  // Display calc balance
  calcPrintBalance(acc);
  // Display calc summary
  calcDisplaySummary(acc);
  // Display movements
  displayMovements(acc);
};

/**
 * input valueの文字を削除、input fieldからフォーカスを外す
 * @function
 * @param {Array.<string>} inputEl : valueの文字を削除したい要素
 * @param {Array.<string>} blurEl : フォーカスをはずしたい要素
 */
const clearBlurInput = (inputEl, blurEl) => {
  inputEl.forEach(el => (el.value = ''));
  blurEl.forEach(el => el.blur());

  // ex)
  // - clear input field
  // inputTransferAmount.value = '';
  // inputTransferTo.value = '';
  // - blur input field
  // inputTransferAmount.blur();
  // inputTransferTo.blur();
};

/**
 * TODO:
 * - 処理の内容がよくわからないから内容を把握する
 */
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      /**
       * TODO:
       * - 開発を終えたら0->100にする
       */
      containerApp.style.opacity = 100;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let curUser, timer;
/**
 * TODO:
 * - 開発を終えたら下記の{Fake always login}を削除
 */
// Fake always login
let currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// login
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  // find method accounts.owner === inputValue
  curUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  // confirm find accounts.owner && pin acconts.pin === inputValue
  if (curUser && curUser.pin === Number(inputLoginPin.value)) {
    // Display welcome message
    const welcomeMsg = `Good Day, ${curUser.owner.split(' ')[0]}!`;
    labelWelcome.textContent = welcomeMsg;

    containerApp.style.opacity = 100;

    // 1秒毎に現在時刻を更新する
    setInterval(() => {
      const now = new Date();
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };
      labelDate.textContent = new Intl.DateTimeFormat(
        curUser.locale,
        options
      ).format(now);
    }, 1000);

    // clear input field
    // blur input fieldからフォーカスを失う
    clearBlurInput(
      [inputLoginUsername, inputLoginPin],
      [inputLoginUsername, inputLoginPin]
    );

    /**
     * TODO:
     * - よくわからないからもう一度動画をみる
     */
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update UI
    updateUI(curUser);

    // else alert 'input your username and pin'
  } else {
    alert('Input your username and pin!');
  }
});

/**
 * TODO:
 * - 収入の入力
 * transfer to の代わりに備考
 * - 下記に変更あり
 * <input type="number" class="form__input form__input--amount" />
  　<input type="text" class="form__input form__input--memo" />
 */
// transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  // get inputValue 'Amount'
  const inputAmount = Number(inputTransferAmount.value);

  // find recipient account from 'Transfer to' inputValue
  const recUser = accounts.find(acc => acc.username === inputTransferTo.value);

  // 入力されたusernameとamountの整合性の確認
  if (
    inputAmount > 0 &&
    recUser &&
    curUser.balance >= inputAmount &&
    // - ?.  optional chaining演算子 nullまたはundefinedのときエラーを返すのではなくundefinedを返す
    recUser?.username !== curUser.username
  ) {
    // Add negative movement to current user
    // - '-'を先頭に付けることで負数にすることができる
    curUser.movements.push(-inputAmount);

    // Add positive movement to recipient
    recUser.movements.push(inputAmount);

    // Add transfer date
    curUser.movementsDates.push(new Date().toISOString());

    // input clear & blur
    clearBlurInput(
      [inputTransferAmount, inputTransferTo],
      [inputTransferAmount, inputTransferTo]
    );

    // update UI
    updateUI(curUser);
  } else {
    alert('Input recipient and amount! or Invalid recipient and amount!');
  }
});

/**
 * TODO:
 * - 支出の入力
 * 備考の欄を新たに設ける
 * - 下記に変更あり
 * <input type="number" class="form__input form__input--outgo--amount" />
  　<input type="text" class="form__input form__input--outgo--memo" />
 */
// loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  // inputValue
  const amount = Math.floor(inputLoanAmount.value);

  // ローンの条件
  // any deposit > 10% of request
  // ex) deposit: 4000 > amount: 30000 * 10% -> OK!
  if (amount > 0 && curUser.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add positive movement to recipient
      curUser.movements.push(amount);

      // Add loan date
      curUser.movementsDates.push(new Date().toISOString());

      // input clear & blur
      clearBlurInput([inputLoanAmount], [inputLoanAmount]);

      // update UI
      updateUI(curUser);
    }, 3000);
  } else {
    alert('Invalid amount. Confirm your input amount');
  }
});

// close account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  // inputValue
  const inputUser = inputCloseUsername.value;
  const inputPin = inputClosePin.value;

  // compare with currentUser to inputValue
  if (curUser.username === inputUser && curUser.pin === Number(inputPin)) {
    // return true or false
    const returnConfirm = confirm('本当にaccountを削除してよろしいですか？');

    if (returnConfirm) {
      // delete
      // accountsからcurUserの情報を探す　条件に合致した配列の添字を返す
      const index = accounts.findIndex(
        acc => acc.username === curUser.username
      );

      // 要素の削除
      accounts.splice(index, 1);

      alert('アカウントの削除に成功しました');

      // Hide UI
      containerApp.style.opacity = 0;

      // input clear & blur
      clearBlurInput(
        [inputCloseUsername, inputClosePin],
        [inputCloseUsername, inputClosePin]
      );
    } else {
      // cancel
      alert('キャンセルしました');
    }
  } else {
    alert('Confirm your username and pin!');
  }
});

let sorted = false;
// sort
btnSort.addEventListener('click', e => {
  e.preventDefault();

  // update UI
  displayMovements(curUser, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// * checking number
// // parseint parsefloat
// console.log(Number.parseInt('25px'));
// console.log(Number.parseFloat('2.5px'));

// // isNaN isFinite isInteger
// console.log(Number.isFinite(10 / 5));

// * Math
/**
 * ランダムな数を生成する
 * @function
 * @param {number}} min 最小値
 * @param {number}} max 最大値
 * @return {number}}
 */
// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min + 1)) + min;

// console.log(randomInt(10, 20));

// * remainder

// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((el, i) => {
//     if (isEven(i)) {
//       el.style.backgroundColor = '#EEEEEE';
//     }
//   });
// });

// * dates and time
// const now = new Date();
// console.log(now);

// const future = new Date(2025, 11, 30, 15, 50);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getMinutes());

// 1000: ミリ秒、60: 秒、60: 分、24: 時
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const day1 = calcDaysPassed(new Date(2037, 3, 10), new Date(2037, 3, 14));

// console.log(day1);

// const number = 130254.32;
// const options = {
//   style: 'currency',
//   currency: 'JPY',
// };
// console.log(`JP: ${new Intl.NumberFormat('ja-JP', options).format(number)}`);

// const ingredients = ['meat', 'bread', 'fish'];

// const order = setTimeout(
//   () => {
//     console.log(`お待たせしました。${[...ingredients]} です`);
//   },
//   3000,
//   ...ingredients
// );
// console.log('お待ち下さい');

// if (ingredients.includes('fish')) {
//   clearTimeout(order);
// }

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);
