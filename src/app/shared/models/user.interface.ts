export interface UserI {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string; //identificador del documento en firebase
  phoneNumber?: string;
}
