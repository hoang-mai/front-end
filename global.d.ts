declare global {
  interface ErrorResponse {
    [key: string]: string[];
  }

  interface Option{
    id:number|string;
    label:string
  }
}

export {};
