import { Employee } from "../employee-details/employee.model";

export interface PersonalTarget {
    idPersonalTarget: number;
    description: string;
    targetArea: TargetArea;
    status: TargetStatus;
    origin: Employee;
    definedBy: string;
    employee: Employee;
    year: number;
    supportedValue: SupportedValue;
}
export enum TargetArea {
    TRAINING='TRAINING',
    CDT = 'Client Delivery Target',
    BD = 'Business Development',
    BA = 'Blog - Article',
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