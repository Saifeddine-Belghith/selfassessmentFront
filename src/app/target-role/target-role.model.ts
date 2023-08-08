import { Employee } from "../employee-details/employee.model";
import { ProfileRole } from "../profile-role/profile-role.model";

export interface TargetRole{
    idTargetRole: number;
    role: string;
    employee: Employee;
    originEmployee: Employee;
    definedBy: string;
    

}