import { nullable, object, picklist, string, type InferOutput, union } from "valibot";

export const webSocketStatusValues = ['idle', 'connecting', 'scanning-qr', 'received-photo', 'error', 'mismatch-photo', 'scanning-ballot'] as const;
export type WebSocketStatus = typeof webSocketStatusValues[number];

const voterStatusValues = ['printed', 'tallied'] as const;
export const ScanResultSchema = object({
    uin: string(),
    demographics: object({
        location1_eng: string(),
        location3_eng: string(),
    }),
    photo: string(), // base64 string
    precinct: string(),
    voter_status: nullable(picklist(voterStatusValues)),
});
export type ScanResult = InferOutput<typeof ScanResultSchema>;

export const ScanErrorSchema = object({
    error: string(),
});
export type ScanError = InferOutput<typeof ScanErrorSchema>;

export const ScanMessageSchema = union([ScanResultSchema, ScanErrorSchema]);
export type ScanMessage = ScanResult | ScanError;

export const PrintBallotMessageSchema = object({
    status: picklist(['printed', 'failed']),
});
export type PrintBallotMessage = InferOutput<typeof PrintBallotMessageSchema>;