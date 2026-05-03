import { nullable, object, picklist, string, type InferOutput, union } from "valibot";

const voterStatusValues = ['printed', 'tallied'] as const;
export const ScanResultSchema = object({
    uin: string(),
    demographics: object({
        location1_eng: string(),
        location3_eng: string(),
    }),
    photo: string(), // base64 string
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