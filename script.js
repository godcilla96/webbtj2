const url = "http://localhost:3300/cv/workexperience";

//kod för att inhämta databas och ladda det på sidan
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
      //presentera datan i en lista
      const postList = document.getElementById('postList');
      data.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = `${post.companyname} - ${post.jobtitle}, ${post.startdate}, ${post.enddate}: ${post.description}`;
        postList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

  //funktion för att lägga till arbetserfarenhet till databasen
function addWorkExperience(workExperienceData) {
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
  })
  .catch(error => {
    console.error('Error adding work experience:', error);
  });
}

// eventlistener tillagt till formuläret
document.getElementById('workExperienceForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    //inhämta formulärdata
    const formData = {
        companyname: document.getElementById('companyname').value,
        jobtitle: document.getElementById('jobtitle').value,
        location: document.getElementById('location').value,
        startdate: document.getElementById('startdate').value,
        enddate: document.getElementById('enddate').value,
        description: document.getElementById('description').value
    };

    console.log('Form data:', formData); 
    addWorkExperience(formData);
});

  //Raderar data 
function deleteWorkExperience(workExperienceId) {
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

  })
  .catch(error => {
    console.error('Error deleting work experience:', error);
  });
}
/*
// Exempel:
const workExperienceIdToDelete = 1; 
deleteWorkExperience(workExperienceIdToDelete);*/