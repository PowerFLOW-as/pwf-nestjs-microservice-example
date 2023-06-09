export interface PayloadFormio {
  readonly external: boolean;
  readonly form: {
    _id: string;
  };
  readonly user: UserFormio;
  readonly project: {
    _id: string | null;
  };
}

export interface UserFormio {
  readonly _id: string;
  readonly data: {
    name: string;
    email: string;
  };
  readonly roles: string[];
}
