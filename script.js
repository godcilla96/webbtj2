const url = "http://localhost:3300/cv/workexperience";
function createDeleteButton(workExperienceId) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Radera';
  deleteButton.addEventListener('click', function() {
    deleteWorkExperience(workExperienceId);
  });
  return deleteButton;
}

// Funktion för att skapa en knapp för att ändra en post
function createEditButton(workExperienceId, formData) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Ändra';
  editButton.addEventListener('click', function() {
    // Här kan du implementera logik för att ändra posten med ID workExperienceId
    // Exempelvis, visa ett formulär för att redigera posten med förifyllda värden från formData
    console.log('Redigera post med ID:', workExperienceId);
    console.log('Formulärdata:', formData);
  });
  return editButton;
}

// Kod för att inhämta databas och ladda det på sidan
document.addEventListener('DOMContentLoaded', function() {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Presentera datan i en lista
      const postList = document.getElementById('postList');
      data.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = `${post.companyname} - ${post.jobtitle}, ${post.startdate}, ${post.enddate}: ${post.description}`;
        
        // Skapa radera och ändra knappar för varje post
        const deleteButton = createDeleteButton(post.id);
        const editButton = createEditButton(post.id, post);
        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);
        
        postList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

  //funktion för att lägga till arbetserfarenhet till databasen
function addWorkExperience(workExperienceData) {

  //kollar så att fälten är ifyllda
  for (const key in workExperienceData) {
    if (!workExperienceData[key]) {
      alert('Fyll i alla fält!');
      return;
    }
  }

  fetch('http://localhost:3300/cv/workexp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workExperienceData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to add work experience');
    }
    return response.json();
  })
  .then(data => {
    console.log('Work experience added:', data);

    alert('Data tillagd!');
    resetFormFields();
  })
  .catch(error => {
    console.error('Error adding work experience:', error);
  });
}

function resetFormFields() {
  document.getElementById("workExperienceForm").reset();
}

// Funktion för att validera formuläret och visa felmeddelanden
function validateFormAndDisplayErrors(formData) {
  // Objekt för att hålla reda på felmeddelanden
  const errors = {};

  // Validera varje fält
  if (!formData.companyname) {
    errors.companyname = "Fyll i företagets namn";
  }
  if (!formData.jobtitle) {
    errors.jobtitle = "Fyll i jobbtiteln";
  }
  if (!formData.location) {
    errors.location = "Fyll i platsen";
  }
  if (!formData.startdate) {
    errors.startdate = "Fyll i startdatum";
  }
  if (!formData.enddate) {
    errors.enddate = "Fyll i slutdatum";
  }
  if (!formData.description) {
    errors.description = "Fyll i beskrivningen";
  }

  // Visa felmeddelanden på skärmen
  for (const key in errors) {
    const errorMessage = errors[key];
    document.getElementById(`${key}Error`).textContent = errorMessage;
  }

  // Returnera true om det inte finns några fel, annars false
  return Object.keys(errors).length === 0;
}

//eventlistener till formuläret
document.getElementById('workExperienceForm').addEventListener('submit', function(event) {
  event.preventDefault();

  //inhämtar formulärdata
  const formData = {
    companyname: document.getElementById('companyname').value,
    jobtitle: document.getElementById('jobtitle').value,
    location: document.getElementById('location').value,
    startdate: document.getElementById('startdate').value,
    enddate: document.getElementById('enddate').value,
    description: document.getElementById('description').value
  };

  //validera formulärdata och visa felmeddelanden
  if (validateFormAndDisplayErrors(formData)) {
    //lägg till data om fälten är ifyllda
    addWorkExperience(formData);
  }
});

//funktion för att radera arbetserfarenhet från databasen med DELETE-operatorn
function deleteWorkExperience(workExperienceId) {
  //visa en bekräftelsepopup innan radering
  const confirmation = confirm("Är du säker på att du vill radera posten?");
  
  if (confirmation) {
    fetch(`http://localhost:3300/cv/workexp/${workExperienceId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete work experience');
      }
      return response.json();
    })
    .then(data => {
      console.log('Work experience deleted:', data.message);
      //laddar om sidan efter radering
      location.reload();
    })
    .catch(error => {
      console.error('Error deleting work experience:', error);
    });
  }
}