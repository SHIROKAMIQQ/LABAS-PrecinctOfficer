export type ScanResult = {
    uin: string;
    demographics: Record<string, string>;
    registered_voter: boolean;
    precinct: string;
    voted: boolean;
    photo: string; // base64 string
};

export type ScanError = {
    error: string;
};

export type ScanMessage = ScanResult | ScanError;
