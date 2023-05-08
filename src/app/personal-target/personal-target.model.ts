import { Employee } from "../employee-details/employee.model";
import { Target } from "./target.model";

export interface PersonalTarget{
    idPersonalTarget: number;
    year: number;
    status: string;
    employee: Employee;
    idEmployee: number;
    target: Target;
    idTarget: number;
}