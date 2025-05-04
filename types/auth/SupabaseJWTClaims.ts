export type SupabaseJWTClaims = {
    sub: string;
    email: string;
    exp: number;
    profile_role?: string;
};