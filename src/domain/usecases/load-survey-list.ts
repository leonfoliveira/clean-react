export interface LoadSurveyList {
  loadAll: () => Promise<LoadSurveyList.Model[]>;
}

export namespace LoadSurveyList {
  export type Model = {
    id: string;
    question: string;
    answers: {
      answer: string;
      image?: string;
    }[];
    date: Date;
    didAnswer: boolean;
  };
}
