import {
  PostCreated as PostCreatedEvent,
  PostUpdated as PostUpdatedEvent
} from "../generated/Blog/Blog"
import { PostCreated, PostUpdated } from "../generated/schema"

export function handlePostCreated(event: PostCreatedEvent): void {
  let entity = new PostCreated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.id = event.params.id
  entity.title = event.params.title
  entity.hash = event.params.hash
  entity.save()
}

export function handlePostUpdated(event: PostUpdatedEvent): void {
  let entity = new PostUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.id = event.params.id
  entity.title = event.params.title
  entity.hash = event.params.hash
  entity.published = event.params.published
  entity.save()
}
