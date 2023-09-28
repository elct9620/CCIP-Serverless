import { IRequest, StatusError } from 'itty-router'
import * as schema from '@api/schema'
import { ListBooth, GetBoothByToken } from '@api/query'
import { get } from '@worker/router'
import { json } from '@worker/utils'

type DelivererListRequest = IRequest & {
  listBooth: ListBooth
}

type GetDelvierRequest = IRequest & {
  getBoothByToken: GetBoothByToken
}

export class PuzzleDeliverer {
  @get('/event/puzzle/deliverers')
  async getDeliverers({ query, listBooth }: DelivererListRequest) {
    const booths = await listBooth.execute({ eventId: query.event_id as string })

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }

  @get('/event/puzzle/deliverer')
  async getDeliverer({ query, getBoothByToken }: GetDelvierRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token required')
    }

    const ownedBooth = await getBoothByToken.execute({ token: query.token as string })

    if (!ownedBooth) {
      throw new StatusError(400, 'invalid deliverer token')
    }

    return json<schema.BoothStaff>({ slug: ownedBooth.name })
  }
}
