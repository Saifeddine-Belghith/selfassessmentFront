export interface TargetRole {
    idTargetRole: number;
    roleName: string;
    description: string;
    displayName: string;
    categoryMinScores: { [key: string]: number };
}