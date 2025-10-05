let inventory = {};

fetch('inventory.json')
  .then(response => response.json())
  .then(data => {
    inventory = data;
  });


function searchItem() {
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  const resultBox = document.getElementById("result");

  if (!query) {
    resultBox.innerText = "Please enter an item name.";
    return;
  }

  // Try exact match first
  if (query in inventory) {
    resultBox.innerText = `"${query}" is located in: ${inventory[query]}`;
    return;
  }

  // Try partial matches
  const matches = Object.entries(inventory).filter(([item, location]) =>
    item.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    resultBox.innerHTML = `Found ${matches.length} item(s):<ul>` +
      matches.map(([item, location]) => `<li><strong>${item}</strong>: ${location}</li>`).join("") +
      `</ul>`;
    return;
  }

  // Optional: Suggest the closest match using Levenshtein Distance
  const closest = findClosestMatch(query, Object.keys(inventory));
  if (closest) {
    resultBox.innerHTML = `Item not found. Did you mean <strong>${closest}</strong>?`;
  } else {
    resultBox.innerText = `No matching items found.`;
  }
}

// Optional fuzzy matching using Levenshtein Distance
function findClosestMatch(word, candidates) {
  let minDistance = Infinity;
  let bestMatch = null;

  for (const candidate of candidates) {
    const distance = levenshtein(word, candidate.toLowerCase());
    if (distance < minDistance && distance <= 3) { // max "typo tolerance"
      minDistance = distance;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

// Levenshtein Distance algorithm (for fuzzy search)
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);

  for (let j = 1; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}
