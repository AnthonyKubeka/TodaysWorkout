export interface Exercise {
  id: number;
  name: string;
  targetSets: number;
  targetRepsPerSet: number;
  completedSets: { reps: number, intensity: number}[];
  pending?: boolean;
  complete?: boolean;
}
