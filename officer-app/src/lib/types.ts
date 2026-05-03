import { nullable, object, picklist, string, type InferOutput, union } from "valibot";

export const webSocketStatusValues = ['idle', 'connecting', 'scanning-qr', 'received-photo', 'scanning-ballot', 'error'] as const;
export type WebSocketStatus = typeof webSocketStatusValues[number];

const voterStatusValues = ['printed', 'tallied'] as const;
export const ScanQRResultSchema = object({
    uin: string(),
    demographics: object({
        location1_eng: string(),
        location3_eng: string(),
    }),
    photo: string(), // base64 string
    precinct: string(),
    voter_status: nullable(picklist(voterStatusValues)),
});
export type ScanQRResult = InferOutput<typeof ScanQRResultSchema>;

export const ScanQRErrorSchema = object({
    error: string(),
});
export type ScanQRError = InferOutput<typeof ScanQRErrorSchema>;

export const ScanQRMessageSchema = union([ScanQRResultSchema, ScanQRErrorSchema]);
export type ScanQRMessage = ScanQRResult | ScanQRError;

export const PrintBallotMessageSchema = object({
    status: picklist(['printed', 'failed']),
});
export type PrintBallotMessage = InferOutput<typeof PrintBallotMessageSchema>;