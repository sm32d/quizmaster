export type User = {
    _id: string,
    username: string;
    name: string;
    email: string;
    role: string;
    provider: string;
    providerAccountId: string;
    ab_test_group: boolean;
    created_at: string;
    updated_at: string;
}