const url = "http://localhost:3300/cv/workexperience";
const cors = require("cors"); 
app.use(cors());

//skapar raderaknapp
function createDeleteButton(workExperienceId) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Radera';
  deleteButton.addEventListener('click', function() {
    deleteWorkExperience(workExperienceId);
  });
  return deleteButton;
}

//skapar ändraknapp
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
  fetch(url, {
    method: 'GET'
  })
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



/* IGNORERA v

//funktion som var tänkt att finnas till för att kunna göra ändringar i den lagrade databasen men som jag inte fick att fungera helt
function openEditModal(postId) {
  //hämta information om posten från servern baserat på postId
  fetch(`http://localhost:3300/cv/workexperience/${workExperienceId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch work experience details');
      }
      return response.json();
    })
    .then(data => {
      //fyll formuläret med den befintliga informationen för posten
      document.getElementById('companyname').value = data.companyname;
      document.getElementById('jobtitle').value = data.jobtitle;
      document.getElementById('location').value = data.location;
      document.getElementById('startdate').value = data.startdate;
      document.getElementById('enddate').value = data.enddate;
      document.getElementById('description').value = data.description;

      //uppdatera knappens dataset för att lagra postId
      document.getElementById('saveChangesButton').dataset.workExperienceId =  workExperienceId;

      //skapa knappen om den inte redan finns
      if (!document.getElementById('saveChangesButton')) {
        const saveChangesButton = document.createElement('button');
        saveChangesButton.id = 'saveChangesButton';
        saveChangesButton.textContent = 'Spara ändringar';
        
        //lägg till eventlyssnare för knappen
        saveChangesButton.addEventListener('click', function() {
          const updatedData = {
            companyname: document.getElementById('companyname').value,
            jobtitle: document.getElementById('jobtitle').value,
            location: document.getElementById('location').value,
            startdate: document.getElementById('startdate').value,
            enddate: document.getElementById('enddate').value,
            description: document.getElementById('description').value
          };
          const postId = document.getElementById('saveChangesButton').dataset.workExperienceId;
          // Skicka PUT-begäran med uppdaterad information till servern
          updateWorkExperience(postId, updatedData);
        });

        //lägg till knappen i formuläret
        document.getElementById('formContainer').appendChild(saveChangesButton);
      }
    })
    .catch(error => {
      console.error('Error fetching work experience details:', error);
    });
}

//funktion för att skicka PUT-begäran med uppdaterad information
function updateWorkExperience(workExperienceId, updatedData) {
  fetch(`http://localhost:3300/cv/workexp/${workExperienceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update work experience');
    }
    return response.json();
  })
  .then(data => {
    console.log('Work experience updated:', data);
    // Uppdatera gränssnittet efter att ändringen är klar
  })
  .catch(error => {
    console.error('Error updating work experience:', error);
  });
}


function createEditButton(workExperienceId, formData) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Ändra';
  editButton.addEventListener('click', function() {
    // Visa ett modalfönster för redigering med förifyllda värden från formData
    showModalForEditing(workExperienceId, formData);
  });
  return editButton;
}

function showModalForEditing(workExperienceId, formData) {
  //skapa ett modalfönster
  const modal = document.createElement('div');
  modal.classList.add('modal');

  //skapa innehållet i modalfönstret
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  //skapa en rubrik för modalfönstret
  const modalHeader = document.createElement('h2');
  modalHeader.textContent = 'Redigera post';

  //skapa ett formulär för redigering
  const editForm = document.createElement('form');

  //lägg till formulärfält för varje attribut i formData
  for (const key in formData) {
    const label = document.createElement('label');
    label.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Första bokstaven i nyckeln stor
    const input = document.createElement('input');
    input.type = 'text';
    input.value = formData[key];
    input.name = key; // Använd attributets namn som namnet på input-fältet
    label.appendChild(input);
    editForm.appendChild(label);
  }

  //skapa en knapp för att spara ändringar
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Spara ändringar';
  saveButton.addEventListener('click', function() {
    //implementera logik för att spara ändringar till databasen
    saveChangesToDatabase(workExperienceId, editForm);
    //stäng modalfönstret efter att ändringarna är sparade
    closeModal(modal);
  });

  //lägg till rubrik, formulär och spara-knapp till modalfönstret
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(editForm);
  modalContent.appendChild(saveButton);
  modal.appendChild(modalContent);

  //lägg till modalfönstret till body-elementet
  document.body.appendChild(modal) ;
}

function saveChangesToDatabase(workExperienceId, editForm) {
  //implementera logik för att skicka uppdaterad data till servern och uppdatera posten med workExperienceId
  //hämta uppdaterad information från formuläret
  const updatedData = {};
  const formData = new FormData(editForm);
  for (const [key, value] of formData.entries()) {
    updatedData[key] = value;
  }
  //skicka PUT-begäran med uppdaterad information till servern
  updateWorkExperience(workExperienceId, updatedData);
}

function updateWorkExperience(postId, updatedData) {
  //implementera logik för att skicka PUT-begäran till servern med uppdaterad information
  // fetch(...);
}

function closeModal(modal) {
  //stäng modalfönstret genom att ta bort det från DOM-trädet
  modal.remove();
}*/