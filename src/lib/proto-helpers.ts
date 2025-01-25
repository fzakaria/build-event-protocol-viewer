import { load, Reader, Message } from 'protobufjs';
import { base } from '$app/paths';

export async function decodeAll(file: File | undefined): Promise<Message<object>[] | null> {
  if (!file) return null;
  const bes_proto_file = await load(`${base}/build_event_stream.proto`);
  const BuildEventType = bes_proto_file.lookupType('build_event_stream.BuildEvent');
  const data = await file.arrayBuffer();
  const reader = new Reader(new Uint8Array(data));
  const events = [];
  while (reader.pos < reader.len) {
    const event = BuildEventType.decodeDelimited(reader);
    events.push(event);
  }
  return events;
}
