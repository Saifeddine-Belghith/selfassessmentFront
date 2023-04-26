export interface AssessmentDTO {
    skill: {
        idSkill: number,
        skillName: string
    },
    employee: {
        idEmployee: number,
        firstName: string,
        lastName: string
    },
    rating: number,
    assessmentDate: Date
}