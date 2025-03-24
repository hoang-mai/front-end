declare global {
  interface ErrorResponse {
    [key: string]: string[];
  }

  interface Option{
    id:number|string;
    label:string
  }

  interface Term extends Record<string, unknown>{
    id:number;
    nameTerm:string;
    startDate:Date;
    endDate:Date;
    rosterDeadline:Date;
    gradeEntryDate:Date;
    createdAt:Date;
    updatedAt:Date;
    deletedAt:Date;
  }

  interface Course extends Record<string, unknown> {
    id: number;
    subjectName: string;
    code: string;
    enrollLimit: number;
    midtermWeight: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

}

export {};
