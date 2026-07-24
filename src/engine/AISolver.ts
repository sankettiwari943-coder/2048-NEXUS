import { Direction, HintResult, AIDifficulty, TileData } from '../types/game';
import { GameEngine } from './GameEngine';

export class AISolver {
  private static DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  // Heuristic weights for Expectimax evaluation
  private static WEIGHT_MONOTONICITY = 1.0;
  private static WEIGHT_SMOOTHNESS = 0.1;
  private static WEIGHT_MAX_CORNER = 2.5;
  private static WEIGHT_EMPTY_CELLS = 2.7;
  private static WEIGHT_MERGES = 0.7;

  /**
   * Generates a detailed Hint for the player
   */
  public static getHint(grid: (TileData | null)[][]): HintResult {
    let bestMove: Direction | null = null;
    let bestScore = -Infinity;
    let bestImmediateGain = 0;

    for (const dir of AISolver.DIRECTIONS) {
      const res = GameEngine.move(grid, dir);
      if (!res.moved) continue;

      // Evaluate depth 2 Expectimax
      const evalScore = AISolver.expectimax(res.grid, 2, false);
      
      if (evalScore > bestScore) {
        bestScore = evalScore;
        bestMove = dir;
        bestImmediateGain = res.score;
      }
    }

    if (!bestMove) {
      return {
        bestMove: null,
        winProbability: 0,
        riskLevel: 'high',
        scoreGain: 0,
        futureScoreEstimate: 0,
      };
    }

    // Calculate win probability & risk level
    const maxTile = GameEngine.getHighestTile(grid);
    const emptyCount = AISolver.countEmptyCells(grid);

    let winProbability = Math.min(99, Math.max(15, Math.round((maxTile / 2048) * 100 + emptyCount * 3)));
    if (maxTile >= 2048) winProbability = 99;

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (emptyCount <= 2) riskLevel = 'high';
    else if (emptyCount <= 5) riskLevel = 'medium';

    return {
      bestMove,
      winProbability,
      riskLevel,
      scoreGain: bestImmediateGain,
      futureScoreEstimate: Math.max(0, Math.round(bestScore)),
    };
  }

  /**
   * Returns AI move choice based on selected difficulty level
   */
  public static getAutoMove(
    grid: (TileData | null)[][],
    difficulty: AIDifficulty = 'expert'
  ): Direction | null {
    const depthMap = {
      easy: 1,
      medium: 2,
      expert: 3,
    };
    const maxDepth = depthMap[difficulty] || 2;

    let bestMove: Direction | null = null;
    let bestScore = -Infinity;

    // Add slight randomness for Easy mode
    if (difficulty === 'easy' && Math.random() < 0.3) {
      const validMoves: Direction[] = [];
      for (const dir of AISolver.DIRECTIONS) {
        if (GameEngine.move(grid, dir).moved) validMoves.push(dir);
      }
      if (validMoves.length > 0) {
        return validMoves[Math.floor(Math.random() * validMoves.length)];
      }
    }

    for (const dir of AISolver.DIRECTIONS) {
      const res = GameEngine.move(grid, dir);
      if (!res.moved) continue;

      const evalScore = AISolver.expectimax(res.grid, maxDepth, false);
      if (evalScore > bestScore) {
        bestScore = evalScore;
        bestMove = dir;
      }
    }

    return bestMove;
  }

  /**
   * Core Expectimax search algorithm
   */
  private static expectimax(
    grid: (TileData | null)[][],
    depth: number,
    isMaxPlayer: boolean
  ): number {
    if (depth === 0 || !GameEngine.hasMovesLeft(grid)) {
      return AISolver.evaluateBoard(grid);
    }

    if (isMaxPlayer) {
      let maxEval = -Infinity;
      for (const dir of AISolver.DIRECTIONS) {
        const res = GameEngine.move(grid, dir);
        if (res.moved) {
          const evalVal = AISolver.expectimax(res.grid, depth - 1, false);
          maxEval = Math.max(maxEval, evalVal);
        }
      }
      return maxEval === -Infinity ? AISolver.evaluateBoard(grid) : maxEval;
    } else {
      // Chance node (tile spawn node)
      const emptyCells: { r: number; c: number }[] = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!grid[r][c]) emptyCells.push({ r, c });
        }
      }

      if (emptyCells.length === 0) {
        return AISolver.evaluateBoard(grid);
      }

      let totalExpectedValue = 0;

      // Sample a subset of empty cells if search space is large
      const maxSample = Math.min(emptyCells.length, 4);
      for (let i = 0; i < maxSample; i++) {
        const { r, c } = emptyCells[i];

        // 90% chance of 2
        const grid2 = GameEngine.cloneGrid(grid);
        grid2[r][c] = { id: 'temp2', value: 2, row: r, col: c };
        const val2 = AISolver.expectimax(grid2, depth - 1, true);

        // 10% chance of 4
        const grid4 = GameEngine.cloneGrid(grid);
        grid4[r][c] = { id: 'temp4', value: 4, row: r, col: c };
        const val4 = AISolver.expectimax(grid4, depth - 1, true);

        totalExpectedValue += 0.9 * val2 + 0.1 * val4;
      }

      return totalExpectedValue / maxSample;
    }
  }

  /**
   * Board evaluation function using heuristic metrics
   */
  private static evaluateBoard(grid: (TileData | null)[][]): number {
    const emptyCells = AISolver.countEmptyCells(grid);
    const emptyScore = Math.log(emptyCells + 1) * AISolver.WEIGHT_EMPTY_CELLS * 100;

    const cornerScore = AISolver.evaluateCornerMax(grid) * AISolver.WEIGHT_MAX_CORNER * 150;
    const monoScore = AISolver.evaluateMonotonicity(grid) * AISolver.WEIGHT_MONOTONICITY * 50;
    const smoothScore = AISolver.evaluateSmoothness(grid) * AISolver.WEIGHT_SMOOTHNESS * 30;

    return emptyScore + cornerScore + monoScore + smoothScore;
  }

  private static countEmptyCells(grid: (TileData | null)[][]): number {
    let count = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!grid[r][c]) count++;
      }
    }
    return count;
  }

  private static evaluateCornerMax(grid: (TileData | null)[][]): number {
    let maxVal = 0;
    let maxR = 0;
    let maxC = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c]?.value || 0;
        if (val > maxVal) {
          maxVal = val;
          maxR = r;
          maxC = c;
        }
      }
    }

    // Check if max is on one of the 4 corners
    const isCorner =
      (maxR === 0 || maxR === 3) && (maxC === 0 || maxC === 3);

    return isCorner ? Math.log2(maxVal) : 0;
  }

  private static evaluateMonotonicity(grid: (TileData | null)[][]): number {
    let score = 0;
    // Check left/right monotonic direction
    for (let r = 0; r < 4; r++) {
      let inc = 0;
      let dec = 0;
      for (let c = 0; c < 3; c++) {
        const val1 = grid[r][c]?.value || 0;
        const val2 = grid[r][c + 1]?.value || 0;
        if (val1 > val2) dec += val1 - val2;
        else inc += val2 - val1;
      }
      score += Math.max(inc, dec);
    }
    return score;
  }

  private static evaluateSmoothness(grid: (TileData | null)[][]): number {
    let smoothness = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = grid[r][c]?.value;
        if (!val) continue;

        const valLog = Math.log2(val);

        // Right neighbor
        if (c + 1 < 4 && grid[r][c + 1]?.value) {
          const rightLog = Math.log2(grid[r][c + 1]!.value);
          smoothness -= Math.abs(valLog - rightLog);
        }
        // Down neighbor
        if (r + 1 < 4 && grid[r + 1][c]?.value) {
          const downLog = Math.log2(grid[r + 1][c]!.value);
          smoothness -= Math.abs(valLog - downLog);
        }
      }
    }
    return smoothness;
  }
}
