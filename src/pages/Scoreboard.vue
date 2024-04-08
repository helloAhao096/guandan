<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useScoreStore} from "@/store/ScoreStore.ts";

const A = ref("2")
const B = ref("2")
// 选中两次后确认的时候要判断，不让确认
const aSelectedTimes = ref(0)
let backTime = 0

// 胜负判断
const winFlag = ref({A:false, B: false})
// 每个数字的分值
const scoreSelectorList = ref([
  { "score": 3, "isActivate": false, AB: false},
  { "score": 0, "isActivate": false, AB: false},
  { "score": -1, "isActivate": false, AB: false},
  { "score": -2, "isActivate": false, AB: false}
])

// 排名颜色数组
const rankingColorList = ref(["","","",""])

type PreScoreStatus = {
  A: string;
  B: string;
  AIndex: number;
  BIndex: number;
  winFlag: { A: false, B: false };
  rankingColorList: string[];
  scoreSelectorList: typeof scoreSelectorList.value;
};
// 暂存状态
let preScoreStatus: PreScoreStatus = {
  A:"2",
  B:"2",
  AIndex: 0,
  BIndex: 0,
  winFlag: { A: false, B: false },
  rankingColorList: ["", "", "", ""],
  scoreSelectorList: [
    { "score": 3, "isActivate": false, AB: false},
    { "score": 0, "isActivate": false, AB: false},
    { "score": -1, "isActivate": false, AB: false},
    { "score": -2, "isActivate": false, AB: false}
  ]
};

const scoreStore = useScoreStore()

onMounted(() =>{
})

function addNum(AB: boolean, index: number) {
  if (aSelectedTimes.value === 2 && !AB) {
    return;
  }
  aSelectedTimes.value += AB ? -1 : 1;

  scoreSelectorList.value[index].AB = !AB
  scoreSelectorList.value[index].isActivate = !AB
}

function resetSelector() {
  scoreSelectorList.value.forEach(selector => {
    selector.isActivate = false
    selector.AB = false
  })
  aSelectedTimes.value = 0
  return {scoreSelectorList: scoreSelectorList.value, aSelectedTimes: aSelectedTimes.value}
}

function resetRanking() {
  rankingColorList.value = ["", "", "", ""]
}

function resetAB() {
  scoreStore.resetScoreIndex()
  A.value = "2"
  B.value = "2"
}

function resetFlag(){
  winFlag.value = {A:false, B: false}
}

function init() {
  resetSelector()
  resetRanking()
  resetAB()
  resetFlag()
  resetPreScoreStatus()
}
function confirmRound() {
  if (aSelectedTimes.value != 2) {
    alert("蓝方点数选择未满足两次")
    return
  }

  backTime = 0
  preScoreStatus = {
    "A": A.value,
    "B": B.value,
    "AIndex": scoreStore.scoreIndex.A,
    "BIndex": scoreStore.scoreIndex.B,
    "winFlag": winFlag.value,
    "rankingColorList": [...rankingColorList.value],
    "scoreSelectorList": [
      { "score": 3, "isActivate": false, AB: false},
      { "score": 0, "isActivate": false, AB: false},
      { "score": -1, "isActivate": false, AB: false},
      { "score": -2, "isActivate": false, AB: false}
    ]
  }

  // 当前会和选择的两个分数数组
  const A_list = []
  const B_list = []
  // rankingColor 的样式
  for (const [index, scoreSelector] of scoreSelectorList.value.entries()) {
    // scoreSelector.AB ? A_list.push(scoreSelector.score) : B_list.push(scoreSelector.score);
    if (scoreSelector.AB) {
      A_list.push(scoreSelector.score)
      rankingColorList.value[index] = "ranking__point-blue"
    }else {
     B_list.push(scoreSelector.score)
      rankingColorList.value[index] = "ranking__point-red"
    }
  }

  winFlag.value = {A:scoreSelectorList.value[0].AB, B:!scoreSelectorList.value[0].AB}
  const av = scoreStore.calcLevel(A_list.reduce((accumulator, currentValue) => accumulator + currentValue, 0), "A", winFlag.value.A)
  const bv = scoreStore.calcLevel(B_list.reduce((accumulator, currentValue) => accumulator + currentValue, 0), "B", winFlag.value.B)
  if (av ==  "蓝方胜利") {
    alert(av)
    init()
  }else {
    A.value = av
  }
  if (bv =="红方胜利") {
    alert(bv)
    init()
  }else {
    B.value = bv
  }

  resetSelector()
}

function resetPreScoreStatus() {
  preScoreStatus = {
    A:"2",
    B:"2",
    AIndex: 0,
    BIndex: 0,
    winFlag: { A: false, B: false },
    rankingColorList: ["", "", "", ""],
    scoreSelectorList: [
      { "score": 3, "isActivate": false, AB: false},
      { "score": 0, "isActivate": false, AB: false},
      { "score": -1, "isActivate": false, AB: false},
      { "score": -2, "isActivate": false, AB: false}
    ]
  };
}

function backRound() {
  if (backTime == 0) {
    backTime += 1
    setScoreStatus()
  }
}

function setScoreStatus() {
  const pv = preScoreStatus
  A.value = pv.A
  B.value = pv.B
  winFlag.value = pv.winFlag
  rankingColorList.value = pv.rankingColorList
  scoreSelectorList.value = pv.scoreSelectorList
  scoreStore.resetScoreIndex(pv.AIndex, pv.BIndex)
}
</script>

<template>

  <div class="scoreboard__container bg-neutral h-screen w-screen flex justify-center items-center p-10 text-white">

    <div class="dashboard__left w-3/6 h-full flex flex-col justify-around">
      <!--    计分器-->
      <div class="score__selector bg-[#9B9B9B] h-3/5  mb-4 p-4 rounded-2xl  flex flex-wrap justify-center">
          <div class="score__num"
               :class="{'score__num-activate': selector.isActivate}"
               @click="addNum(selector.AB, index)"
               v-for="(selector, index) in scoreSelectorList">
            {{ index + 1 }}
          </div>
<!--          <div class="selector ">3</div>-->
<!--          <div class="selector ">4</div>-->
      </div>

<!--     排名-->
      <div class="ranking bg-[#9B9B9B] rounded-2xl h-1/5 mb-5 flex justify-around items-center">
        <div class="ranking__point" :class="color" v-for="color in rankingColorList"></div>
      </div>

<!--      操作面板-->
      <div class="console bg-[#9B9B9B] h-1/5 flex justify-around items-center rounded-2xl p-2">
          <div class="console__btn" @click="confirmRound">确认</div>
          <div class="console__btn" @click="backRound">撤回</div>
          <div class="console__btn" @click="init">重开</div>
      </div>

    </div>

    <div class="scorekeeper_right ml-6 rounded-2xl bg-[#9B9B9B] w-3/6 h-full flex flex-col justify-center items-center p-4">

      <div class="score ">
        <span class="score__text-main score__A">{{A}}</span>
        <div class="score__text-sub absolute"></div>
        <div class="score__win" :class="{'score__win-display': winFlag.A}">🚩</div>
      </div>

      <div class="score ">
        <span class="score__text-main score__B">{{ B }}</span>
        <div class="score__text-sub absolute"></div>
        <div class="score__win" :class="{'score__win-display': winFlag.B}">🚩</div>
      </div>
    </div>


  </div>

</template>

<style scoped lang="css">
.scoreboard__container {

}
.score__num {
 /* flex-basis: calc((100% - 20px - 6px) / 2); !* 计算每个元素的宽度 *!
  height: calc((100% - 20px - 6px) / 2); !* 计算每个元素的高度 *!
  margin: 2px; !* 每个元素的 margin *!
  background-color: #ccc; !* 方块元素的背景颜色 *!*/
  flex-basis: calc((100% - 20px - 6px) / 2);

  @apply
  text-5xl m-auto text-center bg-[#0C359E] rounded-3xl
  sm:text-9xl md:text-[8rem] lg:text-[10rem]
}

.score__num-activate {
  @apply
  bg-[#041562]
}

.ranking__point{
  @apply
  w-16 h-16 bg-white rounded-full
}

.ranking__point-blue {
  @apply
  bg-[#0C359E]
}

.ranking__point-red {
  @apply
  bg-[#9e0000]
}

.console__btn{
  @apply
  btn btn-lg btn-neutral text-2xl m-2
  sm:btn-xs md:btn-sm lg:btn-lg xl:btn-lg
}

.score {
  @apply
  h-1/2 w-full bg-white m-2 flex justify-center items-center rounded-2xl

}

.score__text-main {
  @apply
  h-full w-4/5  block text-[15rem] leading-[18rem] text-center rounded-l-2xl
}

.score__A {
  @apply
  bg-[#0C359E]

}

.score__B {
  @apply
  bg-[#9e0000]
}
.score__win {
  @apply
  h-full w-1/5 text-6xl flex justify-center items-center opacity-0
}

.score__win-display {
  opacity: 1;
}
</style>