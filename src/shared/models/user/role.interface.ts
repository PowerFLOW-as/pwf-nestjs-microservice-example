export interface Role {
  id: number;
  assignmentType: string;
  title: string;
  privileges: [string];
  groups: [string];
  system: boolean;
}
