export interface Employee {
    idEmployee: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    experienceLevel: string;
    role: string;
    isCoach: boolean;
    isCoachee: boolean;
    isManager: boolean;
    employeeDetails?: Employee;
}