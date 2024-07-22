export interface Exercise {
  uuid: string;
  name: string;
  targetSets: number;
  targetRepsPerSet: number;
  completedSets: { reps: number, intensity: number, weight: number}[];
  pending?: boolean;
  complete?: boolean;
}
