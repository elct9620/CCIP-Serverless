import { AggregateRoot, Replayable, getCurrentTime } from '@/core'
import { StatEvent, PuzzleStatIncremented } from './event'

export class PuzzleStat {
  public readonly name: string
  private _delivered: number
  private _valid: number

  constructor(name: string) {
    this.name = name
    this._delivered = 0
    this._valid = 0
  }

  get delivered(): number {
    return this._delivered
  }

  get valid(): number {
    return this._valid
  }

  deliver(): void {
    this._delivered++
    this._valid++
  }
}

@Replayable
export class Stats extends AggregateRoot<string, StatEvent> {
  private _puzzles: Map<string, PuzzleStat> = new Map()

  constructor(id: string, _events?: StatEvent[]) {
    super(id)
  }

  get puzzles(): PuzzleStat[] {
    return Array.from(this._puzzles.values())
  }

  get totalDelivered(): number {
    return this.puzzles.reduce((acc, puzzle: PuzzleStat) => acc + puzzle.delivered, 0)
  }

  get totalValid(): number {
    return this.puzzles.reduce((acc, puzzle: PuzzleStat) => acc + puzzle.valid, 0)
  }

  deliverPuzzle(name: string): void {
    this.apply(new PuzzleStatIncremented(crypto.randomUUID(), this.id, getCurrentTime(), name))
  }

  private _onPuzzleStatIncremented(event: PuzzleStatIncremented): void {
    let puzzle = this._puzzles.get(event.puzzleName)
    if (puzzle === undefined) {
      puzzle = new PuzzleStat(event.puzzleName)
      this._puzzles.set(event.puzzleName, puzzle)
    }
    puzzle.deliver()
  }
}
