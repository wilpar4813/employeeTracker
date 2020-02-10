// Install npm packages
const mysql = require("mysql");
const inquirer = require("inquirer");
let roles;
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
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
    console.log("| |  ___|_ ___  __  _ ___| | ___  _   _  ___   ___  |");
    console.log("| |  _| | `_  '_  |  _   | |/ _ '| | | |/ _ ' / _ ' |");
    console.log("| | |___| | | | | | |_|  | | |_| | | | |  __/|  __/ |");
    console.log("| |_____|_| |_| |_| ____/|_|'___/|___| |____||____| |");
    console.log("|                 |_|             |___/             |");
    console.log("|  __  __                                           |");
    console.log("| |  '/  | ____ _ __   ____  ___   ___   _ __       |");
    console.log("| | |'/| |/ _' | '_ ' / _  |/ _ ' / _ ' | ,__|      |");
    console.log("| | |  | | |_| | | | | |_| | |_| |  __/ | |         |");
    console.log("| |_|  |_||__,_|_| |_|___,_|___, |____|_|_|         |");
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
                "View Current Employees",
                "Update Employee Role",
                "Delete Employee",
                "Exit"
            ]
        }]).then(({employeeManagement}) => {
        switch (employeeManagement) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Employee Role":
                addRole();
                break;
            case "Add Employee": 
                addEmployee();
                break;
            case "View Departments": 
                viewDepartments();
                break;
            case "View Employee Roles": 
                viewRoles();
                break;
            case "View Current Employees": 
                viewEmployees();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            /*case "Delete Employee":
                console.log("This feature will be availabe in the next release");
                manageSelections();
                break;*/
            case "Exit": 
                connection.end();
                break;
        } // End switch statement
    }); // End then promise
};//End Manage Selections

const addEmployee = () => {
    
    let id;
    //Build an array of Current Titles and Title ID's 
    var query = "SELECT role_id, role_title FROM role";
    
    connection.query(query, function (err, res) {
        roles = res;
        //Create array of roles for user to pick from
        let roleCall = [];
        //Build object array of role titles for user to select from
        for (i = 0; i < roles.length; i++) {
            roleCall.push(Object.values(roles[i].role_title).join(""));
        };//End for loop
        
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
            name: "role_title",
            //Use roleCall array to provide role choices
            choices: roleCall, 
            type: "list"
        }
        ]).then((res) => {
    
    for (i = 0; i < roles.length; i++) {
        if (roles[i].role_title === res.role_title) {
            console.log(typeof(roles[i].role_id));
            id = roles[i].role_id;
        };
    };
    var query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
    connection.query(query, [res.first_name, res.last_name, id], function (err) {
        if (err) throw err;
        // Call primary menu.
        manageSelections();
      });//End of query connection
    });//connection then
    });//End of first query
  };//end add employee
  

    // Adding a department...
const addDepartment = () => {
    inquirer.prompt(
        {
            name: 'department', 
            type: 'input', 
            message: 'What department would you like to add?'
    }).then(function (res) {
            const query = "INSERT INTO department (department_name) VALUES (?)";
            connection.query(query, [res.department], function(err,res){
            if (err) throw err;
            console.log("Department was successfully updated. \n");
            manageSelections();
        });//End Query
    });//End then
}; // end add department

function addRole() {
    //Build an array of role choices
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
              message: 'Which department is the new role belongs?',
              choices: array
            }];
        
        inquirer.prompt(questions).then(res => {
            const query = "INSERT INTO role (role_title, role_salary, department_id) VALUES (?, ?, ?)";
            connection.query(query, [res.title, res.salary, res.department], function (err, res) {
                if (err) throw err;
                console.log("The role has been added.");
                manageSelections();
            });//End Second Query
          });//End Inquirer then
        });//End First Query
      }
      
const validateSalary = (salary) => {
    var salaryEntered = /^\d+$/;
    return salaryEntered.test(salary) || "Salary should be a number!";
}

const viewDepartments = () =>{
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

const viewRoles = () => {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

const viewEmployees = () => {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
        console.table(res);
        manageSelections();
    });
};

const updateRole = () => {
    let roles;
    let employee;
    let roleCall = [];
    var query = "SELECT employee_id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS employees FROM employee";
    console.log(roles)
    connection.query(query, function (err, res) {
        if (err) 
            throw err;
            console.log(res)
        employee = res;
        //Build an array of Current Titles and Title ID's 
        var query_two = "SELECT role_id, role_title FROM role";
        connection.query(query_two, function (err, res) {
            if (err) throw err;
            roles = res;
            console.log(roles)
            console.log(roles.length);
            //Create array of roles for user to pick from
            
            //Build object array of role titles for user to select from
            for (i = 0; i < roles.length; i++) {
                roleCall.push(Object.values(roles[i].role_title).join(""));
            };//End for loop
            console.log(roleCall)
    
    console.log(employee)
    let currentEmployees = [];
    
    
    //Build list of employees for user to select from
    for (i = 0; i < employee.length; i++) {
      currentEmployees.push(Object.values(employee[i].employees).join(""));
    };
    //Build list of roles for user to select from
    for (i = 0; i < roles.length; i++) {
      roleCall.push(Object.values(roles[i].role_title).join(""));
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
        choices: roleCall
      }
    ]).then((res) => {
  
      let employee_id;
      let role_id;
      //Find role id based off of role name
      for (i = 0; i < roles.length; i++) {
        if (roles[i].role_title === res.title) {
          role_id = roles[i].role_id;
        };
      };
      //Find employee id based of of employee name
      for (i = 0; i < employee.length; i++) {
        if (employee[i].employees === res.employee) {
          employee_id = employee[i].employee_id;
        };
      };
      var query = ("UPDATE employee SET role_id = ? WHERE employee_id = ?");
      connection.query(query, [role_id, employee_id], function (err, res) {
        if (err) throw err;
        manageSelections();
      });//End if
    });//ENd then
});//End query_two
});//End First Query
};//End Update Role
/*Delete is Under Construction
const deleteEmployee = () => {
    let currentEmployees = [];
    let employee;
    var query = "SELECT employee.employee_id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS name FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res)
        employee = res;
    //Build list of employees for user to select from
    for (i = 0; i < employee.length; i++) {
        currentEmployees.push(Object.values(employee[i].employees).join(""));
      };
    for (i = 0; i < employee.length; i++) {
        if (employee[i].employees === res.employee) {
          employee_id = employee[i].employee_id;
    };
      };
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res)
       
        inquirer
        .prompt({
          name: 'employee',
          type: 'list',
          message: 'Which employee do you want to delete?',
          choices: currentEmployees
        }).then(function (res) {
          connection.query("DELETE FROM employee WHERE employees = ?", [res.employee], function (err, res) {
            if (err) throw err;
            if (res.affectedRows > 0) {
              console.log(res.employee + " has been remmoved from company directory.");
            }
            console.log("");
            manageSelections();
          });//ends if
        });//End then
    });//End second query
});//End first query
};//End Delete Employee
*/