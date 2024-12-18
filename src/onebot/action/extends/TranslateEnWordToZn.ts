import { OneBotAction } from '@/onebot/action/OneBotAction';
import { ActionName } from '@/onebot/action/router';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

const SchemaData = {
    type: 'object',
    properties: {
        words: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['words'],
} as const satisfies JSONSchema;

type Payload = FromSchema<typeof SchemaData>;

export class TranslateEnWordToZn extends OneBotAction<Payload, Array<any> | null> {
    actionName = ActionName.TranslateEnWordToZn;
    payloadSchema = SchemaData;

    async _handle(payload: Payload) {
        const ret = await this.core.apis.SystemApi.translateEnWordToZn(payload.words);
        if (ret.result !== 0) {
            throw new Error('翻译失败');
        }
        return ret.words;
    }
}
