import { Employee } from "../employee-details/employee.model";

export interface ClientFeedback{
    idClientFeedback: number;
    clientName: string;
    evaluation: Evaluation;
    rating: number;
    trend: string;
    employee: Employee;
    comment: string;
}
export interface ClientFeedbackPlayload {
    idClientFeedback: number;
    clientName: string;
    // evaluation: Evaluation;
    rating: number;
    trend: string;
    employee: Employee;
    comment: string;
}
export enum Evaluation{
    EXCELLENT = 'Excellent',
    GOOD = 'Good',
    APPROPRIATE ='Appropriate',
    UNDER_EXPECTATION ="Under Expectation",
    POOR ="POOR",
    NOT_APPLICABLE ="NOT Applicable"

}