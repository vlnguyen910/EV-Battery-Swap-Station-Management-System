import { Role } from '@prisma/client';

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    user: {
        user_id: number;
        email?: string;
        phone?: string;
        username: string;
        roles: Role;
    }
}  