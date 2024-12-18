const ATTACK_VALUE = 10;     // 플레이어의 최대 공격력

let chosenMaxLife = 100;     // 몬스터의 최대 체력
let currentMonsterHealth = chosenMaxLife; // 몬스터 체력 조정
let currentPlayerHealth = chosenMaxLife;  // 플레이어 체력 조정

adjustHealthBars(chosenMaxLife);  // 최대 체력을 설정하는 체력 조정 함수

function attackHandler() {
  const damage = dealMonsterDamage(ATTACK_VALUE);
  currentMonsterHealth -= damage;
}

attackBtn.addEventListener('click', attackHandler);  // 공격버튼