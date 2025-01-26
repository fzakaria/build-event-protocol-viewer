import { Reader } from 'protobufjs/minimal';
import { build_event_stream } from '$lib/generated/build_event_stream_proto';

export async function decodeAll(file: File | undefined): Promise<build_event_stream.BuildEvent[]> {
  if (!file) return [];
  const data = await file.arrayBuffer();
  const reader = new Reader(new Uint8Array(data));
  const events = [];
  while (reader.pos < reader.len) {
    const event = build_event_stream.BuildEvent.decodeDelimited(reader);
    events.push(event);
  }
  return events;
}
