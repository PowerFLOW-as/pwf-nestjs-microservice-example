import type { Role } from './role.interface';

export interface User {
  commonName: string;
  fullName: string;
  givenName: string;
  surname: string;
  uid: string;
  local: boolean;
  additionalAttributes: unknown;
  email: string;
  locale: string;
  environment: string;
  roles: Role[];
  userNotifications: unknown;
  notificationUpdatedByUser: boolean;
  archived: boolean;
  active: boolean;
  lastLogin: Date;
  groups: unknown[];
}
