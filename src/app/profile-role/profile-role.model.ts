export interface ProfileRole {
    idProfileRole: number;
    roleName: string;
    description: string;
    displayName: string;
    categoryMinScores: { [key: string]: number };
}