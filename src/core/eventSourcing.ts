import { Class } from './utils'
import { DomainEvent } from './domainEvent'
import { AggregateRoot } from './aggregateRoot'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Replayable<ID, E extends DomainEvent, T extends Class<AggregateRoot<ID, E>>>(
  Base: T
) {
  return class extends Base {
    [key: string]: any

    constructor(...args: any[]) {
      super(...args)

      const [, events] = args
      if (events instanceof Array) {
        this.replayEvents(events)
        this.clearEvents()
      }
    }

    protected replayEvents(events: E[]): void {
      events.forEach(event => this.apply(event))
    }

    public apply(event: E): void {
      const hookName = `_on${event.constructor.name}`
      if (typeof this[hookName] === 'function') {
        this[hookName](event)
      } else {
        throw new Error(`No event handler for ${event.constructor.name}`)
      }
      super.apply(event)
    }
  }
}
