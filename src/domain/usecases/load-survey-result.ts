export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.Model>;
}

export namespace LoadSurveyResult {
  export type Model = {
    question: string;
    answers: {
      image?: string;
      answer: string;
      count: number;
      percent: number;
    }[];
    date: Date;
    didAnswer: boolean;
  };
}
