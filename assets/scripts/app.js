const ATTACK_VALUE = 10; // 플레이어의 최대 공격력
const STRONG_ATTACK_VALUE = 17; // 최대 강한 공격력
const MONSTER_ATTACK_VALUE = 14; // 몬스터의 최대 공격력
const HEAL_VALUE = 20; // 최대 회복 체력

const MODE_ATTACK = "ATTACK"; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; // MODE_STRONG_ATTACK = 1

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = []; // 로그를 담을 변수
let lastLoggedEntry;

// 2024.12.27  try-catch
function getMaxLifeValues() {
  const enteredValue = prompt("Maximum life for you and the monster.", "100");  // 체력 입력
  
  const parsedValue = parseInt(enteredValue); // 몬스터의 최대 체력
  
  // 사용자가 입력한 값이 숫자가 아닐경우, 0이나 0보다 작을 경우 100으로 기본 셋팅
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw {message: 'Invalid user input, not  a number!'};  // throw
  }

  return parsedValue;
}

let chosenMaxLife;

// try-catch-finally
try {
  chosenMaxLife = getMaxLifeValues();
} catch(error) {
  console.log(error);
  chosenMaxLife = 100;
  alert('You entered something wrong, default value of 100 was used.');
}

let currentMonsterHealth = chosenMaxLife; // 몬스터 체력 조정
let currentPlayerHealth = chosenMaxLife; // 플레이어 체력 조정
let hasBonusLife = true; // 보너스 생명

adjustHealthBars(chosenMaxLife); // 최대 체력을 설정하는 체력 조정 함수

// 로그 기록
function writeToLog(ev, val, monsterHealth, playerHealth) { // ev: 발생 이벤트
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHeal: monsterHealth, // 몬스터 체력
    finalPlayerHealth: playerHealth, // 플레이어 체력
  };

  // 2024.12.23
  // switch case문으로 변환
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
        logEntry.target = "MONSTER";
        break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: "MONSTER",
          finalMonsterHeal: monsterHealth, // 몬스터 체력
          finalPlayerHealth: playerHealth, // 플레이어 체력
        };
        break;
    case LOG_EVENT_MONSTER_ATTACK:
        logEntry = {
          event: ev,
          value: val,
          target: "PLAYER",
          finalMonsterHeal: monsterHealth, // 몬스터 체력
          finalPlayerHealth: playerHealth, // 플레이어 체력
        };
      break;
    case LOG_EVENT_PLAYER_HEAL:
        logEntry = {
          event: ev,
          value: val,
          target: "PLAYER",
          finalMonsterHeal: monsterHealth, // 몬스터 체력
          finalPlayerHealth: playerHealth, // 플레이어 체력
        };
      break;
    case LOG_EVENT_GAME_OVER:
        logEntry = {
          event: ev,
          value: val,
          finalMonsterHeal: monsterHealth, // 몬스터 체력
          finalPlayerHealth: playerHealth, // 플레이어 체력
        };
      break;
    default:
      logEntry = {};
  }
  


//   if (ev === LOG_EVENT_PLAYER_ATTACK) {
//     logEntry.target = "MONSTER";
//   } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
//     logEntry = {
//       event: ev,
//       value: val,
//       target: "MONSTER",
//       finalMonsterHeal: monsterHealth, // 몬스터 체력
//       finalPlayerHealth: playerHealth, // 플레이어 체력
//     };
//   } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
//     logEntry = {
//       event: ev,
//       value: val,
//       target: "PLAYER",
//       finalMonsterHeal: monsterHealth, // 몬스터 체력
//       finalPlayerHealth: playerHealth, // 플레이어 체력
//     };
//   } else if (ev === LOG_EVENT_PLAYER_HEAL) {
//     logEntry = {
//       event: ev,
//       value: val,
//       target: "PLAYER",
//       finalMonsterHeal: monsterHealth, // 몬스터 체력
//       finalPlayerHealth: playerHealth, // 플레이어 체력
//     };
//   } else if (ev === LOG_EVENT_GAME_OVER) {
//     logEntry = {
//       event: ev,
//       value: val,
//       finalMonsterHeal: monsterHealth, // 몬스터 체력
//       finalPlayerHealth: playerHealth, // 플레이어 체력
//     };
//   }
    battleLog.push(logEntry);
}

// 게임 리셋
function reset() {
  currentMonsterHealth = chosenMaxLife; // 몬스터 체력 조정
  currentPlayerHealth = chosenMaxLife; // 플레이어 체력 조정
  resetGame(chosenMaxLife);
}

function endRound() {
  // 몬스터 공격 전 사용자의 생명 상태를 고정
  const initialPlayerLife = currentPlayerHealth;

  // 몬스터가 플레이어 공격
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage; // 플레이어 체력 - 몬스터 공격

  // 로그작성
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  // 보너스 생명
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerLife;
    setPlayerHealth(initialPlayerLife);
    alert("You would be dead but the bonus life saved you!");
  }

  // 공격 후 승리했는지 확인
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("You have a draw!"); // 무승부
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'A DRAW',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  // 리셋
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

// ATTACK, STRONG ATTACK 버튼 핸들러
function attackMonster(mode) {
  // 삼항 연산자 2024.12.20
  let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent = 
    mode === MODE_ATTACK 
    ? LOG_EVENT_PLAYER_ATTACK 
    : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // if (mode === MODE_ATTACK) {
  //   // ATTACK 버튼
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   // STRONG ATTACK 버튼
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage; // 몬스터 체력 - 공격력
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound(); // 그 다음 라운드 ex) 몬스터가 플레이어 공격
}

// ATTACK
function attackHandler() {
  attackMonster(MODE_ATTACK);
}

// STRONG ATTACK
function strongAttackHadler() {
  attackMonster(MODE_STRONG_ATTACK);
}

// HEAL
function healPlayerHandler() {
  let healValue;

  // 회복 체력 20을 지금 체력에 20을 더할때 100을 초과 할때 방지 if문
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealthl; // ex) 체력이 90이면 10만 체력 회복
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue; // 플레이어 체력 회복
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound(); // 회복 후에 몬스터가 공격
}

function printLogHandler() {
  
  // 2024.12.26 for 반복문
  // 1. for 반복문
  // for (let i = 0; i < battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }

  // 2. for - of
  // for(const logEntry of battleLog){
  //   console.log(logEntry);
  // }

  // 3. for - in
  let i = 0;
  for (const logEntry of battleLog){
    if(!lastLoggedEntry && lastLoggedEntry !==0 || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in logEntry) {
        console.log(`${key} => ${logEntry[key]}`);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
    // break
  }

  // 2024.12.27 while, do-while, break ,continue
  // let j = 0;
  // while (j < 3) {
  //   console.log(j);
  //   j++;
  // }
  // let j = 0;
  // // 레이블 구문
  // outerWhile: do {
  //   console.log('Outer', i);
  //   innerFor: for(let k = 0; k < 5; k++){
  //     if(k === 3){
  //       break outerWhile;
  //       // continue outerWhile;  // 무한반복
  //     }
  //     console.log('Inner',k);
  //   }
  //   j++;
  // } while (j<3);
  
}

attackBtn.addEventListener("click", attackHandler); // 공격버튼
strongAttackBtn.addEventListener("click", strongAttackHadler); // 강한 공격 버튼
healBtn.addEventListener("click", healPlayerHandler); // 힐러 버튼
logBtn.addEventListener("click", printLogHandler);
