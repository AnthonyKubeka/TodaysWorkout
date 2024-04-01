export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  pending?: boolean;
  complete?: boolean;
}
