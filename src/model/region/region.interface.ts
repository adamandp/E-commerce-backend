export interface Region {
  status: number;
  message: string;
  result: Result;
}

export interface Result {
  id: number;
  text: string;
}
