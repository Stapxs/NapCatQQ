import BaseAction from '../BaseAction';
import { ActionName } from '../types';
import { ChatType, SendFileElement } from '@/core/entities';
import fs from 'fs';
import { sendMsg } from '@/onebot/action/msg/SendMsg';
import { uri2local } from '@/common/utils/file';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';
const SchemaData = {
  type: 'object',
  properties: {
    group_id: { type: ['number', 'string'] },
    file: { type: 'string' },
    name: { type: 'string' },
    folder: { type: 'string' },
    folder_id: { type: 'string' }//临时扩展
  },
  required: ['group_id', 'file', 'name']
} as const satisfies JSONSchema;

type Payload = FromSchema<typeof SchemaData>;

export default class GoCQHTTPUploadGroupFile extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_UploadGroupFile;
  PayloadSchema = SchemaData;
  protected async _handle(payload: Payload): Promise<null> {
    let file = payload.file;
    if (fs.existsSync(file)) {
      file = `file://${file}`;
    }
    const downloadResult = await uri2local(file);
    if (!downloadResult.success) {
      throw new Error(downloadResult.errMsg);
    }
    const sendFileEle: SendFileElement = await SendMsgElementConstructor.file(downloadResult.path, payload.name, payload.folder_id);
    await sendMsg({ chatType: ChatType.group, peerUid: group.groupCode }, [sendFileEle], [], true);
    return null;
  }
}