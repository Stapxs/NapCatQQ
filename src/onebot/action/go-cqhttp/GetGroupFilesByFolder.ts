import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { OneBotAction } from '@/onebot/action/OneBotAction';
import { ActionName } from '@/onebot/action/router';
import { OB11Construct } from '@/onebot/helper/data';

const SchemaData = {
    type: 'object',
    properties: {
        group_id: { type: ['string', 'number'] },
        folder_id: { type: 'string' },
        folder: { type: 'string' },
        file_count: { type: ['string', 'number'] },
    },
    required: ['group_id'],
} as const satisfies JSONSchema;

type Payload = FromSchema<typeof SchemaData>;

export class GetGroupFilesByFolder extends OneBotAction<any, any> {
    actionName = ActionName.GoCQHTTP_GetGroupFilesByFolder;
    payloadSchema = SchemaData;
    async _handle(payload: Payload) {

        const ret = await this.core.apis.MsgApi.getGroupFileList(payload.group_id.toString(), {
            sortType: 1,
            fileCount: +(payload.file_count ?? 50),
            startIndex: 0,
            sortOrder: 2,
            showOnlinedocFolder: 0,
            folderId: payload.folder ?? payload.folder_id ?? '',
        }).catch(() => []);
        return {
            files: ret.filter(item => item.fileInfo)
                .map(item => OB11Construct.file(item.peerId, item.fileInfo!)),
            folders: [] as [],
        };
    }
}
