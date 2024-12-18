const ATTACK_VALUE = 10;     // 플레이어의 최대 공격력
const MONSTER_ATTACK_VALUE = 14;  // 몬스터의 최대 공격력

let chosenMaxLife = 100;     // 몬스터의 최대 체력
let currentMonsterHealth = chosenMaxLife; // 몬스터 체력 조정
let currentPlayerHealth = chosenMaxLife;  // 플레이어 체력 조정

adjustHealthBars(chosenMaxLife);  // 최대 체력을 설정하는 체력 조정 함수

function attackHandler() {
  const damage = dealMonsterDamage(ATTACK_VALUE);
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

attackBtn.addEventListener('click', attackHandler);  // 공격버튼