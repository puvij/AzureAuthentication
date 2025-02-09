// This file allows you to configure ESLint according to your project's needs, so that you
// can control the strictness of the linter, the plugins to use, and more.

// For more information about configuring ESLint, visit https://eslint.org/docs/user-guide/configuring/

export interface ResponseDto<T> {
  result: T | null; // ✅ Stores the actual user data
  isSuccess: boolean;
  message: string;
}

// ✅ Define a model for User (adjust based on API)
export interface User {
  ID: number;
  Employeecode: string;
  UserName: string;
  Email: string;
  EmployeeStatus: string;
  Roles: string[];  
}
