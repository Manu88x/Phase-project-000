// Function to render a single food item
function renderOneFood(Food) {
  const foodMenu = document.getElementById('Food-menu'); // Updated ID

  const foodItem = document.createElement('div'); // Created the div element within food menu
  foodItem.classList.add('food-item'); // Added a class list for this div

  const foodImage = document.createElement('img');
  foodImage.src = Food.image; // Sets the URL for the image
  foodImage.alt = Food.name; // Sets the name
  foodItem.appendChild(foodImage); // Adds the info onto food item

  const foodName = document.createElement('h4'); // Creates h4 element
  foodName.textContent = Food.name; // Sets the food name
  foodItem.appendChild(foodName); // Pushes the info into food item

  // Attach click event to each food item
  foodItem.addEventListener('click', () => handleClick(Food)); // Adds the click event

  foodMenu.appendChild(foodItem); 

  // Create Delete Button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the click on foodItem
      deletcomment(Food); // Pass the Food object for deletion
      foodMenu.removeChild(foodItem); // Remove item from menu
  });
  foodItem.appendChild(deleteButton);

  // Create Edit Button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the click on foodItem
      populateForm(Food); // Populate the form with the food item
  });
  foodItem.appendChild(editButton);
}

// Global variable to track the currently editing food item's ID
let editingFoodId = null;

// Function to populate the form with food item data
const populateForm = (Food) => {
   const form = document.getElementById('new-comments'); // Updated ID
   form.name.value = Food.name;
   form.restaurant.value = Food.restaurant;
   form.image.value = Food.image;
   form.rating.value = Food.rating;
   form['new-comment'].value = Food.comment;
   editingFoodId = Food.id; // Set the ID for PATCH
};

// Function to handle click on food item
const handleClick = (Food) => {
  const detailImage = document.querySelector('.detail-image');
  const nameDisplay = document.querySelector('.name');
  const restaurantDisplay = document.querySelector('.restaurant');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');

  detailImage.src = Food.image;
  nameDisplay.textContent = Food.name;
  restaurantDisplay.textContent = Food.restaurant;
  ratingDisplay.textContent = Food.rating;
  commentDisplay.textContent = Food.comment;
};

// Function to add submit listener to the form
const addSubmitListener = () => {
  const form = document.getElementById('new-comments'); // Updated ID

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newFood = {
      name: event.target.name.value,
      restaurant: event.target.restaurant.value,
      image: event.target.image.value,
      rating: parseInt(event.target.rating.value),
      comment: event.target['new-comment'].value,
      id: editingFoodId // Include ID for PATCH
    };

    if (editingFoodId) {
      patchcomment(newFood); // Use PATCH if editing
    } else {
      addcomment(newFood); // Use POST if creating
    }

    // Reset the form and clear the editing ID
    form.reset();
    editingFoodId = null;
  });
};

// Function to fetch and display all food
const displayFoods = () => {
  fetch("http://localhost:3000/Food")
    .then(res => res.json())
    .then(Food => Food.forEach(Food => renderOneFood(Food)));
};

// POST
function addcomment(Foodobj) {
  console.log('Adding comment:', Foodobj);
  fetch(`http://localhost:3000/Food`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Foodobj)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(postfood => console.log(postfood))
  .catch(error => console.error('Error:', error));
}

// PATCH
function patchcomment(Foodobj) {
  console.log('Patching comment:', Foodobj);
  fetch(`http://localhost:3000/Food/${Foodobj.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Foodobj)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(patchfood => console.log(patchfood))
  .catch(error => console.error('Error:', error));
}

// DELETE
function deletcomment(Foodobj) {
  console.log('Deleting comment:', Foodobj.id);
  fetch(`http://localhost:3000/Food/${Foodobj.id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(deletefood => console.log(deletefood))
  .catch(error => console.error('Error:', error));
}

//i added the .thens to prevent a certain error that kept pooping up

// Main function to start the program
const main = () => {
  displayFoods();
  addSubmitListener();
};

// Ensure the DOM is fully loaded before running the main function
document.addEventListener('DOMContentLoaded', main);


//json-server --watch db.json
