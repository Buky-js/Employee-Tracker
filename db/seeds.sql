-- sample data for the employees_db

INSERT INTO department (name)
VALUES ('Care'), 
('Accounts'), 
('Engineering'), 
('Products');


INSERT INTO role (title, salary, department_id)
VALUES ('Customer Service Representative', 50000, 1), 
('Technical Support Specialist', 55000, 1),
('Accountant', 50000, 2),
('Senior Accountant', 65000, 2),
('Frontend Developer', 70000, 3),
('Backend Developer', 75000,3),
('Product Owner', 65000, 4),
('Product Manager', 75000, 4),
('Customer Support Manager', 70000, 1),
('Financial Analyst', 63000, 2),
('Engineering Manager', 58000, 3),
('UX designer', 72000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sarah', 'Merlin',9, NULL),
('Sylvester', 'Stallon', 4, NULL),
('Adesola', 'Abioye', 11, NULL),
('Peter', 'Butler', 8, NULL),
('Peter', 'Butler', 8, NULL),
('Robert', 'Brown', 2, 1),
('John', 'Darling', 1, 1),
('Stephen', 'Seagal', 3, 2),
('John', 'Darling', 5, 3),
('Segun', 'Ajayi', 6, 3),
('Susan', 'Shower', 7, 4),
('Ron', 'Barton', 12, 4);