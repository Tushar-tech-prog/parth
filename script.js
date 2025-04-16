// List of sweet items with prices (Rs/kg)
const sweets = {
  "peda": 350,
  "Barfi": 300,
  "Milk Cake": 350,
  "Malai Ladoo": 350,
  "Rasgula": 300,
  "Boondi ke ladoo": 170,
  "Khaoya": 350,
  "Paneer": 400
};

// Dynamically generate the input fields for each sweet item
function generateSweetItems() {
  const itemsContainer = document.getElementById('items-container');
  itemsContainer.innerHTML = '';

  for (let sweet in sweets) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.innerHTML = `
      <label for="${sweet}">${sweet} (${sweets[sweet]} Rs/kg):</label>
      <input type="number" id="${sweet}" placeholder="0" />
    `;
    itemsContainer.appendChild(itemDiv);
  }
}

// Update welcome message based on customer name input
function updateWelcomeMessage() {
  const customerName = document.getElementById('customer-name').value;
  const welcomeMessage = customerName ? `Welcome to Parth Sweets Corner, ${customerName}!` : '';
  document.getElementById('welcome-message').textContent = welcomeMessage;
}

// Generate the bill and display it
function generateBill() {
  const customerName = document.getElementById('customer-name').value;
  const quantities = {};
  let billText = `Shop Name: Parth Sweets Corner\nCustomer Name: ${customerName}\nDate: ${new Date().toLocaleString()}\n-------------------------------\n`;
  let totalPrice = 0;

  // Get quantities of each sweet and calculate total cost
  for (let sweet in sweets) {
    const quantityGrams = document.getElementById(sweet).value;
    if (quantityGrams && quantityGrams > 0) {
      const quantityKg = quantityGrams / 1000;
      const cost = quantityKg * sweets[sweet];
      billText += `${sweet}: ${quantityKg.toFixed(2)} kg = ${cost.toFixed(2)} Rs\n`;
      totalPrice += cost;
    }
  }

  billText += `-------------------------------\nTotal: ${totalPrice.toFixed(2)} Rs\nThank you for your order!`;
  document.getElementById('bill').textContent = billText;

  // Save bill to localStorage
  saveBillToHistory(billText);
}

// Reset the form and bill display
function resetForm() {
  document.getElementById('customer-name').value = '';
  document.getElementById('bill').textContent = '';
  document.querySelectorAll('.item input').forEach(input => input.value = '');
  document.getElementById('welcome-message').textContent = '';
  generateSweetItems(); // Re-generate the input fields
}

// Save bill to localStorage and update history list
function saveBillToHistory(billText) {
  let billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];
  billHistory.push(billText);
  localStorage.setItem('billHistory', JSON.stringify(billHistory));
  updateHistoryList();
}

// Update the bill history list
function updateHistoryList() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  const billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];
  
  billHistory.forEach(bill => {
    const listItem = document.createElement('li');
    listItem.textContent = bill.split('\n')[0]; // Show only shop name and first line of bill for history
    historyList.appendChild(listItem);
  });
}

// Print the current bill
function printBill() {
  const billContent = document.getElementById('bill').textContent;
  if (!billContent) {
    alert("Please generate a bill before printing!");
    return;
  }
  
  const printWindow = window.open('', '', 'height=400,width=600');
  printWindow.document.write('<pre>' + billContent + '</pre>');
  printWindow.document.close();
  printWindow.print();
}

// Share the bill via email or other supported methods
function shareBill() {
  const billContent = document.getElementById('bill').textContent;
  if (!billContent) {
    alert("Please generate a bill before sharing!");
    return;
  }
  
  const emailSubject = "Parth Sweets Corner Bill";
  const emailBody = encodeURIComponent(billContent);
  const emailLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  window.location.href = emailLink; // Opens email client for sharing
}

// Initialize sweet items on page load
document.addEventListener('DOMContentLoaded', () => {
  generateSweetItems(); // Generates sweet item inputs
  updateHistoryList(); // Load and display past bills
});
