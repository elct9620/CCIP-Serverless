import { Command } from '@/core'

export type RevokePuzzleInput = {
  attendeeToken: string
}

export type RevokePuzzleOutput = {
  success: boolean
}

export class RevokePuzzleCommand implements Command<RevokePuzzleInput, RevokePuzzleOutput> {
  async execute(_input: RevokePuzzleInput): Promise<RevokePuzzleOutput> {
    return {
      success: true,
    }
  }
}
