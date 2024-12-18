const ATTACK_VALUE = 10;     // 플레이어의 최대 공격력
const STRONG_ATTACK_VALUE = 17;   // 최대 강한 공격력
const MONSTER_ATTACK_VALUE = 14;  // 몬스터의 최대 공격력

let chosenMaxLife = 100;     // 몬스터의 최대 체력
let currentMonsterHealth = chosenMaxLife; // 몬스터 체력 조정
let currentPlayerHealth = chosenMaxLife;  // 플레이어 체력 조정

adjustHealthBars(chosenMaxLife);  // 최대 체력을 설정하는 체력 조정 함수

// ATTACK, STRONG ATTACK 버튼 핸들러
function attackMonster(mode) {
  let maxDamage;
  if (mode === 'ATTACK') { // ATTACK 버튼
    maxDamage = ATTACK_VALUE;
  } else if(mode === 'STRONG_ATTACK'){  // STRONG ATTACK 버튼
    maxDamage = STRONG_ATTACK_VALUE;
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage; // 몬스터 체력 - 공격력

  // 몬스터가 플레이어 공격
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;  // 플레이어 체력 - 몬스터 공격

  // 공격 후 승리했는지 확인
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
    alert('You won!');
  } else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
  } else if (currentPlayerHealth <=0 && currentMonsterHealth <= 0){
    alert('You have a draw!');  // 무승부
  }
}

// ATTACK
function attackHandler() {
  attackMonster('ATTACK');
}

// STRONG ATTACK
function strongAttackHadler() {
  attackMonster('STRONG_ATTACK');
}

attackBtn.addEventListener('click', attackHandler);  // 공격버튼
strongAttackBtn.addEventListener('click', strongAttackHadler);  // 강한 공격 버튼