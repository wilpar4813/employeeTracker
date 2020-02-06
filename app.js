// Install npm packages
const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "lancelot",
    database: "employees"
});
// Error for failed connection
connection.connect(function (err) {
    if (err) throw err;
    banner();
    manageSelections();
});

const banner = () => {
    console.log(" ____________________________________________________");
    console.log("|                                                   |");
    console.log("|  _____                  _                         |");
    console.log("| |  ___|_ ___  _  _ ___ | | ___  _   _  ___   ___  |");
    console.log("| |  _| | `_  '_ \|  _  \| |/ _ \| | | |/ _ \ / _ \ |");
    console.log("| | |___| | | | | | |_|  | | |_| | | | |  __/|  __/ |");
    console.log("| |_____|_| |_| |_| ____/|_|\___/|___| |\___| \___| |");
    console.log("|                 |_|             |___/             |");
    console.log("|  __  __                                           |");
    console.log("| |  \/  | ____ _ __   ____  ___   ___   _ __       |");
    console.log("| | |\/| |/ _' | '_ \ / _  |/ _ \ / _ \ ' '__|      |");
    console.log("| | |  | | |_| | | | | | | | |_| |  __/ | |         |");
    console.log("| |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|_|         |");
    console.log("|                           |___/                   |");;
    console.log("`---------------------------------------------------'");
}
const manageSelections = () => {
    inquirer.prompt([{
            name: "employeeManagement",
            message: "What would you like to do?",
            type: "list",
            choices: [
                "Add Department",
                "Add Employee Role",
                "Add Employee",
                "View Departments",
                "View Employee Roles",
                "View Employees",
                "Update Employee Role",
                "Exit Program"
            ]
        }]).then(({employeeManagement}) => {
        switch (employeeManagement) {
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee": addEmployee();
                break;
            case "View Departments": viewDepartments();
                break;
            case "View Roles": viewRoles();
                break;
            case "View Current Employees": viewEmployees();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Exit": connection.end();
                break;
        } // End switch statement
    }); // End then promise
};

const addEmployee = () => {
   
    //Build an array of Current Titles and Title ID's 
    var query_one = "SELECT id, title FROM role";
    connection.query(query_one, function (err, res) {
        roles = res;
    });
    //Build an array of Current Managers
    var query_two = "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee";
    connection.query(query_two, function (err, res) {
      managers = res;
    });

    let roleCall = [];
    let managerNames = [];
    //Build object array of role titles for user to select from
    for (i = 0; i < roles.length; i++) {
      roleCall.push(Object.values(roles[i].title).join(""));
    };
    //Build object array of manager names for user to select from
    for (i = 0; i < managers.length; i++) {
      managerNames.push(Object.values(managers[i].managers).join(""));
    };
  
    inquirer.prompt([
      {
        message: "What is the employee's first name?",
        name: "first_name",
        type: "input"
      },
      {
        message: "What is the employee's last name?",
        name: "last_name",
        type: "input"
      },
      {
        message: "What is the employee's role?",
        name: "role_id",
        //Use roleCall array to provide role choices
        choices: roleCall, 
        type: "list"
      },
      {
        message: "Who is the employee's manager?",
        name: "manager_id",
        //Use managerNames array to provide manager choices
        choices: managerNames, 
        type: "list"
      }
    ]).then((res) => {
  
    //These variables will be passed into the INSERT query 
      let role_id;
      let manager_id;
  
      //Loop through roles for corespondiong role title and role_id
      for (i = 0; i < roles.length; i++) {
        if (roles[i].title === res.role_id) {
          role_id = roles[i].id;
        };
      };
      //Loop through managers for corespondiong manager and manager_id
      for (i = 0; i < managers.length; i++) {
        if (managers[i].managers === res.manager_id) {
          manager_id = managers[i].id;
        };
      };
      var query = "INSERT INTO employee SET ?, ?, ?, ?";
      connection.query(query, [{ first_name: res.first_name }, { last_name: res.last_name }, { role_id: role_id }, { manager_id: manager_id }], function (err, res) {
        if (err) throw err;
        // Call primary menu.
        manageSelections();
      });//End of query connection
    });// End of then promise
  };//end add employee
  

    // Adding a department...
    const addDepartment = () => {
        inquirer.prompt(
            {
            name: 'department', 
            type: 'input', 
            message: 'What department would you like to add?'
            }).then(function (res) {
                connection.query('INSERT INTO department SET ?', {
                name: res.department
            }, function (err) {
                if (err) 
                    throw err;
                console.log(`${res.department} department was successfully updated. \n`);
                manageSelections();
            });
        });
    }; // end add department

    function addRole() {
        let array = [];
        var query = "SELECT department_id as value, department_name as name FROM department";
        connection.query(query, function (err, res) {
          if (err) throw err;
          array = JSON.parse(JSON.stringify(res));
          var questions = [
            {
              type: "input",
              name: "title",
              message: "What is the name of the new role?"
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary of this new role?",
              validate: validateSalary
            },
            {
              type: 'list',
              name: 'department',
              message: 'which department is the new role belongs?',
              choices: array
            },
            {
              type: 'confirm',
              name: 'manager',
              message: 'Is this a manager role?',
              default: false
            }];
      
          inquirer.prompt(questions).then(answer => {
            connection.query("INSERT INTO role (role_title, role_salary, department_id, manager) VALUES (?, ?, ?, ?)",
              [answer.title, answer.salary, answer.department, answer.manager], function (err, res) {
                if (err) throw err;
                console.log(answer.title + " role has been added.");
                manageSelections();
              });
          });
        });
      }
      
function validateSalary(salary) {
    var salaryEntered = /^\d+$/;
    return salaryEntered.test(salary) || "Salary should be a number!";
}

function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

const updateRole = () => {
    let employee;
    var query = "SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS employees FROM employee";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        employee = res;
    });

    let currentEmployees = [];
    let rollCall = [];
    //Build list of employees for user to select from
    for (i = 0; i < employee.length; i++) {
      currentEmployees.push(Object.values(employee[i].employees).join(""));
    };
    //Build list of roles for user to select from
    for (i = 0; i < roles.length; i++) {
      rollCall.push(Object.values(roles[i].title).join(""));
    };
    //Prompt user for which employee and role need to be updated
    inquirer.prompt([
      {
        message: "Which employee's role do you want to update?",
        name: "employee",
        type: "list",
        choices: currentEmployees
      },
      {
        message: "What is the employee's role?",
        name: "title",
        type: "list",
        choices: rollCall
      }
    ]).then((res) => {
  
      let employee_id;
      let role_id;
  
      //Find role id based off of role name
      for (i = 0; i < roles.length; i++) {
        if (roles[i].title === res.title) {
          role_id = roles[i].id;
        };
      };
      //Find employee id based of of employee name
      for (i = 0; i < employee.length; i++) {
        if (employee[i].employees === answers.employee) {
          employee_id = employee[i].id;
        };
      };
      var query = ("UPDATE employee SET ? WHERE ?");
      connection.query(query, [{ role_id: role_id }, { id: employee_id }], function (err, res) {
        if (err) throw err;
        manageSelections();
      });
    });
  };