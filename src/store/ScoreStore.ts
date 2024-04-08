import { defineStore } from 'pinia'

interface ScoreIndex {
    A: number;
    B: number;
    [key: string]: number; // 添加索引签名
}

export const useScoreStore = defineStore('score', {
    state: () => ({
        // 当前分数
        scoreIndex: {
            A: 0,
            B: 0
        } as ScoreIndex,
        // 掼蛋规则 15   11 +3
        levelList: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "A2", "A3"]
    }),
    getters: {
    },
    actions: {
        // todo 计算等级，如果进来的index小于到a这个index为止，都是直接+index，然后把x_index直接return出去，如果大于等于a ，不管index是多少
        // todo 每次都加1 然后如果超出index长度了，不管是多少，index直接归零， 然后从level——list的 字符2 开始
        // todo 如果A这轮为A1，然后B赢了， B应该正常+分，A的A1变成A2
        // todo 如果当前轮次蓝方打A，并且蓝方最后a的排名不是12，则a1 -》 a2
        calcLevel(currentCalcNum:number, scoreTeamFlag: string, winFlag: boolean){
            if (currentCalcNum < 1 && this.scoreIndex[scoreTeamFlag] >= 12 && winFlag){
                // 说明是输局，应该+1
                this.scoreIndex[scoreTeamFlag] += 1

            } else if (this.scoreIndex[scoreTeamFlag] + 1 == 15) {
                this.scoreIndex[scoreTeamFlag] = 0
            }
            else if (this.scoreIndex[scoreTeamFlag] < 12 && this.scoreIndex[scoreTeamFlag] + currentCalcNum > 12) {
                this.scoreIndex[scoreTeamFlag] = 12
            }else if (currentCalcNum < 0) {
                this.scoreIndex[scoreTeamFlag] += 0
            }else{
                this.scoreIndex[scoreTeamFlag] += currentCalcNum
            }

            console.log(this.scoreIndex[scoreTeamFlag])
            if (this.scoreIndex[scoreTeamFlag] < 15) {
                return this.levelList[this.scoreIndex[scoreTeamFlag]]
            }else {
                if (scoreTeamFlag == "A" && this.scoreIndex[scoreTeamFlag] >= 15) {
                    return "蓝方胜利"
                }
                if(scoreTeamFlag == "B" && this.scoreIndex[scoreTeamFlag] >= 15) {
                    return "红方胜利"
                }
            }
        },
        resetScoreIndex(A=0, B=0) {
            this.scoreIndex.A = A
            this.scoreIndex.B = B
            return [this.scoreIndex.A, this.scoreIndex.B]
            // return [this.levelList[this.scoreIndex.A], this.levelList[this.scoreIndex.B]]
        }
    },
})