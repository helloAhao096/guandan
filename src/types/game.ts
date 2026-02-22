export type Level =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A'
  | 'A2'
  | 'A3';

export type Team = 'red' | 'blue';

// 打级方（逻辑上必有一方是“庄”或“先手”）
export type Attacker = Team;

// 本局结果：头游+二游(+3), 头游+三游(+2), 头游+末游(+1)
export type RoundResult = 3 | 2 | 1;

// 进贡类型
export type TributeType = 'single' | 'double' | 'none'; // none 仅用于开局

// 进贡关系
export interface TributeRelation {
  type: TributeType;
  // 排名：[红1, 红2] vs [蓝1, 蓝2]
  // 1=头游, 2=二游, 3=三游, 4=末游
  rankings: {
    red: [number, number];
    blue: [number, number];
  };
}

export interface GameSnapshot {
  redLevelIndex: number;
  blueLevelIndex: number;
  attacker: Attacker;
  lastTribute: TributeRelation | null; // 上一局产生的进贡关系
}
