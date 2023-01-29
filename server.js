//const express = 'express';
const inquirer = require('inquirer');
const mysql = require('mysql2');
const figlet = require('figlet');

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    //console.log(`Connected to the database`)
);

// Connect to the database
db.connect((err) => {
    if (err) throw err;

    // generate the 'Employee tracker' title
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        appStart();
    });

});

function appStart() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: [

            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }]).then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                console.log("Good-Bye!");
                break;

        }
    })
}

function viewDepartments() {
    db.query(`SELECT * from department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        appStart();
    })
}

function viewRoles() {
    db.query(`SELECT * from role`, (err, res) => {
        if (err) throw err;
        console.table(res);
        appStart();
    })
}

function viewEmployees() {
    db.query(`SELECT * from employee`, (err, res) => {
        if (err) throw err;
        console.table(res);
        appStart();
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the new department?',
        validate: deptName => {
            if (deptName) {
                return true;
            } else {
                console.log('Enter the name of the new department');
                return false;
            }
        }
    }]).then(answer => {
            db.query(`INSERT INTO department (name) VALUES (?)`, answer.deptName, (err, res) => {
                if (err) throw err;
                //console.log(res);
                console.log(`The department ${answer.deptName} has been added`);
                appStart();
            });
        }

    )
}

function addRole() {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        let depts = result.map((dept) => ({
            name: dept.name,
            value: dept.id
        }))

        inquirer.prompt([{
                type: 'input',
                name: 'newRole',
                message: "What is the name of the new role?",
                validate: newRole => {
                    if (newRole) {
                        return true;
                    } else {
                        console.log('Please enter a role');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of this role?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary');
                        return false;
                    }
                }
            },
            {
                name: 'deptName',
                type: 'rawlist',
                message: 'Which department do you want to add the new role to?',
                choices: depts
            }

        ]).then((answer) => {
            db.query("INSERT INTO Role SET ?", {
                    title: answer.newRole,
                    salary: answer.salary,
                    department_id: answer.deptName,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`The role ${answer.newRole} has been added`);
                    appStart();
                }
            );
        })
    })
}

function addEmployee() {
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err;
        let roles = result.map(role => ({
            name: role.title,
            value: role.id
        }));
        db.query(`SELECT * FROM employee;`, (err, result) => {
            if (err) throw err;
            let employees = result.map(employee => ({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            }))
            inquirer.prompt([{
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the new employee\'s first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the new employee\'s last name?'
                },
                {
                    name: 'role',
                    type: 'rawlist',
                    message: 'What is the new employee\'s role?',
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'Who is the new employee\'s manager?',
                    choices: employees
                }
            ]).then((response) => {
                db.query(`INSERT INTO employee SET ?`, {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: response.role,
                        manager_id: response.manager,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`\n ${response.firstName} ${response.lastName} has been added \n`);
                        appStart();
                    })
            })
        })
    })
}

function updateEmployeeRole() {
    db.query(`SELECT * FROM role;`, (err, result) => {
        if (err) throw err;
        let roles = result.map(role => ({
            name: role.title,
            value: role.id
        }));
        db.query(`SELECT * FROM employee;`, (err, result) => {
            if (err) throw err;
            let employees = result.map(employee => ({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            }));
            inquirer.prompt([{
                    name: 'employee',
                    type: 'rawlist',
                    message: 'Whose employee record do you want to update?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'rawlist',
                    message: 'What\'s the employee\'s new role?',
                    choices: roles
                },
            ]).then((response) => {
                db.query(`UPDATE employee SET ? WHERE ?`,
                    [{
                            role_id: response.newRole,
                        },
                        {
                            id: response.employee,
                        },
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`\n Employee\'s role successfully updated! \n`);
                        appStart();
                    })
            })

        })

    })
}