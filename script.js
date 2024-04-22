fetch('http://localhost:3300/cv/workexperience')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // tillgång till data från databasen
    console.log(data);
    // Datan visas i en lista
    const postList = document.getElementById('postList');
    data.forEach(post => {
      const listItem = document.createElement('li');
      listItem.textContent = `${post.companyname} - ${post.jobtitle}`;
      postList.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });