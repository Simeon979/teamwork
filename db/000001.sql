CREATE TABLE IF NOT EXISTS employees (
  employeeId int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstName text NOT NULL,
  lastName text NOT NULL,
  email text UNIQUE NOT NULL,
  passwordHash text NOT NULL,
  gender text NOT NULL,
  jobRole text NOT NULL,
  dept text NOT NULL,
  employeeAddress text NOT NULL
);
