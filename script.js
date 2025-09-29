let inventory = {};

fetch('inventory.json')
  .then(response => response.json())
  .then(data => {
    inventory = data;
  });

function searchItem() {
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  const resultBox = document.getElementById("result");

  if (query in inventory) {
    resultBox.innerText = `"${query}" is located in: ${inventory[query]}`;
  } else {
    resultBox.innerText = `Item "${query}" not found in inventory.`;
  }
}
