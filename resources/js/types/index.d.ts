export interface UserType {
    id: number;
    saldo: number;
    status: number;
    name: string;
    username?: string;
    email: string;
    email_verified_at: string;
    created_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    data: {
        user: UserType;
        is_admin: boolean;
        setting?: {
            balance: number,
            status: number,
            bank: string,
            account_number: string,
            logo: string,
        }
    };
};
