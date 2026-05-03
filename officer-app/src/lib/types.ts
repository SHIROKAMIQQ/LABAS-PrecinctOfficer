import { nullable, object, picklist, string, type InferOutput, union, array } from 'valibot';

export const webSocketStatusValues = [
    'idle',
    'connecting',
    'scanning-qr',
    'received-photo',
    'scanning-ballot',
    'error',
] as const;
export type WebSocketStatus = (typeof webSocketStatusValues)[number];

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

export const CandidateSchema = object({
    first_name: string(),
    last_name: string(),
    middle_name: string(),
});
export type Candidate = InferOutput<typeof CandidateSchema>;

export const ScanBallotResultSchema = object({
    candidates: array(CandidateSchema),
});
export type ScanBallotResult = InferOutput<typeof ScanBallotResultSchema>;

export const ScanBallotErrorSchema = object({
    error: string(),
});
export type ScanBallotError = InferOutput<typeof ScanBallotErrorSchema>;

export const ScanBallotMessageSchema = union([ScanBallotResultSchema, ScanBallotErrorSchema]);
export type ScanBallotMessage = ScanBallotResult | ScanBallotError;
