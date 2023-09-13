import { IRequest } from 'itty-router'
import * as schema from '@api/schema'
import { Booth } from '@api/usecase'
import { get } from '@worker/router'
import { json } from '@worker/utils'

type DelivererListRequest = IRequest & {
  booth: Booth
}

export class PuzzleDeliverer {
  @get('/event/puzzle/deliverers')
  async getDeliverers({ booth }: DelivererListRequest) {
    const booths = await booth.listAll()

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }
}
