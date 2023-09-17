import { IRequest } from 'itty-router'
import * as schema from '@api/schema'
import { ListBooth } from '@api/query'
import { get } from '@worker/router'
import { json } from '@worker/utils'

type DelivererListRequest = IRequest & {
  listBooth: ListBooth
}

export class PuzzleDeliverer {
  @get('/event/puzzle/deliverers')
  async getDeliverers({ listBooth }: DelivererListRequest) {
    const booths = await listBooth.listAll()

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }
}
