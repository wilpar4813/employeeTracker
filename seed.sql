
USE employees;

INSERT INTO department (department_name) VALUES ('Human Resources');
INSERT INTO department (department_name) VALUES ('Accounting');
INSERT INTO department (department_name) VALUES ('Maintenance');
INSERT INTO department (department_name) VALUES ('Information Technology');
INSERT INTO department (department_name) VALUES ('Marketing');
INSERT INTO department (department_name) VALUES ('Sales');
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Counselor', 50000, 1);
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Accountant', 100000, 2);
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Janitor', 100000, 2);
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Software Engineer', 100000, 2);
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Writer', 100000, 2);
INSERT INTO role (role_title, role_salary, department_id) VALUES ('Sales Agent', 100000, 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Tripp', 'Parham', 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Chris', 'Jones', 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Steve', 'Jones', 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Ed', 'Jefferys', 5);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Matthew', 'Landon', 6);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Paul', 'Carroll', 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Peter', 'Brady', 1);