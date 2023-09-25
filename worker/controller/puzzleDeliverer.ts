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
  async getDeliverers({ query, listBooth }: DelivererListRequest) {
    const booths = await listBooth.execute({ eventId: query.event_id as string })

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }
}
