// Set variables to track

let totalAmount = document.getElementById("total-amount");
const totalAmountButton = document.getElementById("total-amount-button");

const addExpenseButton = document.getElementById("add-expense-button");
const amount = document.getElementById("amount");

const expensesValue = document.getElementById("expenses-value");
const balanceValue = document.getElementById("balance-amount");

// In the begining assume the amount to be zero
// this way we'll add everything to zero
// Note: JS counts from 0 in arrays, just like Python

let tempAmount = 0;
//localStorage.clear();

// !! figure out when to clear local storage !!
localStorage.clear()


// Remove specific expense from local storage

function removeExpenseFromStorage(expenseToRemove) {

    let expenses = getExpensesFromStorage();


    // Find and remove the specific expense

    expenses = expenses.filter(expense => {

        return !(expense.description === expenseToRemove.description && 

                 expense.amount === expenseToRemove.amount);

    });


    localStorage.setItem('expenses', JSON.stringify(expenses));

}

// Load existing expenses from local storage !!! źle
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadBudget();
    updateChart();
});

// Load expenses on page load
function loadExpenses() {
    const expenses = getExpensesFromStorage();
    displayExpenses(expenses);
}

// Update budget summary on page load
function loadBudget() {
    updateBudgetSummary();
}

// Set Budget by creating an event that 
// tracks what is the value of tempAmount through a button

totalAmountButton.addEventListener("click", function () {
  tempAmount = totalAmount.value;
  amount.innerHTML = tempAmount;
});

// Create event to Add expenses

addExpenseButton.addEventListener("click", function () {
  const newExpenseName = document.getElementById("expense-name").value;
  const newExpenseCost = document.getElementById("user-amount").value;
  const expensesList = document.getElementById("expenses-list");
  const expensesListElement = document.createElement("li");
  const elementName = document.createElement("span");
  const elementCost = document.createElement("span");

  // Button to remove already existing expenses

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerText = "Remove";

  // Create event for if the removeBtn is clicked 
  // so that a given expense is removed

  console.log(expensesListElement);
  removeBtn.addEventListener("click", function () {
    expensesList.removeChild(expensesListElement);
    removeExpenseFromStorage(expense_line);
    updateBalancesAfterRemoval(newExpenseCost);
  });


  // Update the total balance

  function updateBalance(currentExpenses) {

      const totalBalance = tempAmount - currentExpenses;

      balanceValue.innerText = totalBalance;

      balanceValue.style.color = totalBalance < 0 ? "red" : "black";

  }
  // Update balance after removal

  function updateBalancesAfterRemoval(removedAmount) {

      let currentExpenses = parseInt(expensesValue.innerText) - removedAmount;

      expensesValue.innerText = currentExpenses;

      updateBalance(currentExpenses);

  }

  // Create new expenses

  elementCost.appendChild(document.createTextNode(newExpenseCost));
  elementName.appendChild(document.createTextNode(newExpenseName));
  expensesListElement.appendChild(elementName);
  expensesListElement.appendChild(elementCost);
  expensesListElement.appendChild(removeBtn);
  expensesList.appendChild(expensesListElement);


  // Calculate expenses
  // meaning: find numbers that are related to expenses (costs of the expenses),
  // store them as int numbers and sum them up

  let expenses = parseInt(newExpenseCost);
  let sum = parseInt(expensesValue.innerText) + expenses;
  expensesValue.innerText = sum;

  // sum up the new input to the csv of the budget tracker
  // !!
  const expense_line = {
  description: newExpenseName,
  amount: newExpenseCost
  };
  //const expense_line = {expensesValue, expenses};
  addExpense(expense_line);


  // Total balance (budget - total expenses)
  // Count the balance after the expenses written

  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;

  // Change total balance color
  // this helps the user see that the balance is bad
  // (if under 0 then no money for the expenses of course)

  if (totalBalance < 0) {
    balanceValue.style.color = "red";
  }
});

// Add expense to the list and local storage
function addExpense(expense) {
    let expenses = getExpensesFromStorage();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    // displayExpenses(expenses);
}

// Get expenses from local storage
function getExpensesFromStorage() {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}


// Export expenses as CSV (under expense list)
document.getElementById('export-csv').addEventListener('click', function() {
    const expenses = getExpensesFromStorage();

    // set columns inside the csv
    let csvContent = "data:text/csv;charset=utf-8,Description,Amount\n";
    expenses.forEach(expense => {
    csvContent += `${expense.description},${expense.amount}\n`;
    });
    
    // Add Budget, Expenses, and Balance to the CSV

    csvContent += `\nBudget,${tempAmount}\n`;

    csvContent += `Expenses,${expensesValue.innerText}\n`;

    csvContent += `Balance,${balanceValue.innerText}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

