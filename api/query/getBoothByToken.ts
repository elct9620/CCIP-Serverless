import { Query } from '@/core'

export type GetBoothInput = {
  token: string
}

type GetBoothOutput = {
  name: string
}

export class GetBoothByToken implements Query<GetBoothInput, GetBoothOutput> {
  async execute(): Promise<GetBoothOutput> {
    return {
      name: 'COSCUP',
    }
  }
}
