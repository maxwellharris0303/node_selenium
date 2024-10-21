function removeDuplicates(array, property) {
  // Create a map to store unique objects based on the specified property
  const uniqueMap = new Map();
  
  // Iterate over the array
  for (let obj of array) {
    const key = obj[property];
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, obj);
    }
  }
  
  // Convert the map values back to an array
  const uniqueArray = Array.from(uniqueMap.values());
  return uniqueArray;
}

// Example usage
const inputArray = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "John" },
  { id: 4, name: "Alice" },
  { id: 5, name: "John" }
];

const resultArray = removeDuplicates(inputArray, "name");
console.log(resultArray);