document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
  
    var location = document.getElementById('location').value;
  
    if (!location) {
      alert('Please enter a location');
      return;
    }
  
    fetch('/centers?location=' + encodeURIComponent(location))
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error searching for vaccination centers');
        }
      })
      .then(function(data) {
        displayCenters(data);
      })
      .catch(function(error) {
        console.error('Search error:', error);
        alert('An error occurred while searching for vaccination centers');
      });
  });
  
  function displayCenters(centers) {
    var centerList = document.getElementById('centerList');
    centerList.innerHTML = '';
  
    if (centers.length === 0) {
      var message = document.createElement('li');
      message.textContent = 'No vaccination centers found';
      centerList.appendChild(message);
    } else {
      centers.forEach(function(center) {
        var centerItem = document.createElement('li');
        var centerName = document.createElement('h3');
        centerName.textContent = center.name;
        var centerAddress = document.createElement('p');
        centerAddress.textContent = 'Address: ' + center.address;
        var centerHours = document.createElement('p');
        centerHours.textContent = 'Working Hours: ' + center.hours;
        
        centerItem.appendChild(centerName);
        centerItem.appendChild(centerAddress);
        centerItem.appendChild(centerHours);
        centerList.appendChild(centerItem);
      });
    }
  }
  