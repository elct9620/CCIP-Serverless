import { Query, Projection } from '@/core'
import { Booth } from '@/event'
import { FindBoothByTokenInput } from '@api/projection'

export type GetBoothInput = {
  token: string
}

type GetBoothOutput = {
  name: string
}

export class GetBoothByToken implements Query<GetBoothInput, GetBoothOutput> {
  private readonly findBoothByToken: Projection<FindBoothByTokenInput, Booth>

  constructor(findBoothByToken: Projection<FindBoothByTokenInput, Booth>) {
    this.findBoothByToken = findBoothByToken
  }

  async execute({ token }: GetBoothInput): Promise<GetBoothOutput | null> {
    const booth = await this.findBoothByToken.query({ token })

    if (!booth) {
      return null
    }

    return {
      name: booth.name,
    }
  }
}
