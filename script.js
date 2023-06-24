const dosageTable = document.getElementById('dosageTable').getElementsByTagName('tbody')[0];

fetch('/dosage-details')
  .then(response => response.json())
  .then(data => {
    data.forEach(center => {
      const row = dosageTable.insertRow();
      const centerCell = row.insertCell();
      const dosageCell = row.insertCell();

      centerCell.textContent = center._id;
      dosageCell.textContent = center.dosageCount;
    });
  })
  .catch(error => console.error('Dosage details fetch error:', error));


  // Event listener for the remove center button
document.addEventListener('click', function (event) {
    if (event.target.matches('.remove-center-btn')) {
      const centerId = event.target.getAttribute('data-center-id');
      removeCenter(centerId);
    }
  });
  
  // Function to remove a vaccination center
  function removeCenter(centerId) {
    fetch(`/centers/${centerId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Vaccination center removed successfully');
        } else {
          console.error('Failed to remove vaccination center:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Vaccination center removal error:', error);
      });
  }
  