import { Direction, GameMode, TileData } from '../types/game';

export class GameEngine {
  public static GRID_SIZE = 4;

  /**
   * Creates an empty 4x4 board
   */
  public static createEmptyGrid(): (TileData | null)[][] {
    return Array.from({ length: GameEngine.GRID_SIZE }, () =>
      Array(GameEngine.GRID_SIZE).fill(null)
    );
  }

  /**
   * Spawns a new random tile in an empty spot on the grid
   */
  public static spawnRandomTile(
    grid: (TileData | null)[][],
    mode: GameMode = 'classic'
  ): { grid: (TileData | null)[][]; newTile: TileData | null } {
    const emptyCells: { row: number; col: number }[] = [];

    for (let r = 0; r < GameEngine.GRID_SIZE; r++) {
      for (let c = 0; c < GameEngine.GRID_SIZE; c++) {
        if (!grid[r][c]) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return { grid, newTile: null };
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    // Determine value based on mode
    let spawnFourProbability = 0.1; // default 10%
    if (mode === 'easy') spawnFourProbability = 0.02; // only 2% fours
    if (mode === 'hard') spawnFourProbability = 0.35; // 35% fours!

    const value = Math.random() < spawnFourProbability ? 4 : 2;

    const newTile: TileData = {
      id: `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value,
      row,
      col,
      isNew: true,
    };

    const newGrid = grid.map((rArr) => [...rArr]);
    newGrid[row][col] = newTile;

    return { grid: newGrid, newTile };
  }

  /**
   * Executes a move in the given direction.
   * Returns new grid state, score added, whether grid changed, and list of merges.
   */
  public static move(
    grid: (TileData | null)[][],
    direction: Direction
  ): {
    grid: (TileData | null)[][];
    score: number;
    moved: boolean;
    mergesCount: number;
    mergedMaxTile: number;
  } {
    const size = GameEngine.GRID_SIZE;
    const newGrid: (TileData | null)[][] = GameEngine.createEmptyGrid();
    let score = 0;
    let moved = false;
    let mergesCount = 0;
    let mergedMaxTile = 0;

    // Vector direction helpers
    const isRowTraversal = direction === 'LEFT' || direction === 'RIGHT';
    const isReverse = direction === 'RIGHT' || direction === 'DOWN';

    for (let i = 0; i < size; i++) {
      // Extract line along motion direction
      const line: (TileData | null)[] = [];
      for (let j = 0; j < size; j++) {
        const row = isRowTraversal ? i : j;
        const col = isRowTraversal ? j : i;
        line.push(grid[row][col]);
      }

      if (isReverse) {
        line.reverse();
      }

      // Filter out nulls
      const nonNull = line.filter((t): t is TileData => t !== null);
      const mergedLine: (TileData | null)[] = [];

      let ptr = 0;
      while (ptr < nonNull.length) {
        if (
          ptr + 1 < nonNull.length &&
          nonNull[ptr].value === nonNull[ptr + 1].value
        ) {
          // Merge two tiles
          const mergedVal = nonNull[ptr].value * 2;
          score += mergedVal;
          mergesCount++;
          if (mergedVal > mergedMaxTile) mergedMaxTile = mergedVal;

          const mergedTile: TileData = {
            id: `tile-merged-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            value: mergedVal,
            row: 0,
            col: 0,
            mergedFrom: [nonNull[ptr], nonNull[ptr + 1]],
          };

          mergedLine.push(mergedTile);
          ptr += 2;
        } else {
          mergedLine.push({ ...nonNull[ptr], isNew: false });
          ptr++;
        }
      }

      // Pad remaining empty slots
      while (mergedLine.length < size) {
        mergedLine.push(null);
      }

      if (isReverse) {
        mergedLine.reverse();
      }

      // Place back onto new grid with updated coordinates
      for (let j = 0; j < size; j++) {
        const row = isRowTraversal ? i : j;
        const col = isRowTraversal ? j : i;
        const tile = mergedLine[j];

        if (tile) {
          const updatedTile: TileData = {
            ...tile,
            row,
            col,
          };
          newGrid[row][col] = updatedTile;

          // Check if position or value changed
          const origTile = grid[row][col];
          if (
            !origTile ||
            origTile.id !== updatedTile.id ||
            origTile.value !== updatedTile.value
          ) {
            moved = true;
          }
        } else if (grid[row][col] !== null) {
          moved = true;
        }
      }
    }

    return { grid: newGrid, score, moved, mergesCount, mergedMaxTile };
  }

  /**
   * Checks if any valid moves remain on the board
   */
  public static hasMovesLeft(grid: (TileData | null)[][]): boolean {
    const size = GameEngine.GRID_SIZE;

    // Check for empty cells
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) return true;
      }
    }

    // Check adjacent horizontally & vertically for matching values
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const current = grid[r][c]?.value;
        if (!current) continue;

        if (c + 1 < size && grid[r][c + 1]?.value === current) return true;
        if (r + 1 < size && grid[r + 1][c]?.value === current) return true;
      }
    }

    return false;
  }

  /**
   * Gets highest tile value on the grid
   */
  public static getHighestTile(grid: (TileData | null)[][]): number {
    let max = 0;
    for (let r = 0; r < GameEngine.GRID_SIZE; r++) {
      for (let c = 0; c < GameEngine.GRID_SIZE; c++) {
        const val = grid[r][c]?.value || 0;
        if (val > max) max = val;
      }
    }
    return max;
  }

  /**
   * Creates a deep copy of a 2048 grid
   */
  public static cloneGrid(grid: (TileData | null)[][]): (TileData | null)[][] {
    return grid.map((row) =>
      row.map((tile) => (tile ? { ...tile, mergedFrom: undefined } : null))
    );
  }
}
