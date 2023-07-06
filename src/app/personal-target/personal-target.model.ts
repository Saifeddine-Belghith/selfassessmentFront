import { Employee } from "../employee-details/employee.model";

export interface PersonalTarget {
    idPersonalTarget: number;
    skill: string;
    description: string;
    acceptanceCriteria: string;
    targetArea: TargetArea;
    status: TargetStatus;
    origin: Employee;
    definedBy: string;
    employee: Employee;
    targetDate: number;
    quarter: string;
    supportedValue: SupportedValue;
}
export enum TargetArea {
    TRAINING='TRAINING',
    CDT = 'Client Delivery Target',
    BD = 'Business Development',
    SME = 'SME Task',
    SF ='Soft Skill',
    Others = 'Others'
}

export enum TargetStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum SupportedValue {
    CL = 'CL - Continuous Learning',
    FEEDBACK = 'FEEDBACK',
    TRUST = 'Trust',
    HONESTY = 'Honesty',
    OPC = 'OPC - Openness Towards Change',
    PPDI = 'PPDI - Passion & Process Driven Innovation',
    PCC = 'PCC - Proactive & Conscious Collaboration',
    SOLIDARITY = 'Solidarity'
}