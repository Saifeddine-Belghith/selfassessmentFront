import { Employee } from "../employee-details/employee.model";

export interface ClientFeedback{
    idClientFeedback: number;
    clientName: string;
    evaluation: Evaluation;
    rating: number;
    trend: string;
    employee: Employee;
}
export enum Evaluation{
    EXCELLENT = 'Excellent',
    GOOD = 'Good',
    Appropriate='Appropriate',
    Under_Expectation ="Under Expectation",
    POOR ="POOR",
    NOT_Applicable ="NOT Applicable"

}