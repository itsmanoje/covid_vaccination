document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
  
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    if (!name || !email || !password) {
      alert('Please fill in all the fields');
      return;
    }
  
    var user = {
      name: name,
      email: email,
      password: password
    };
  
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(function(response) {
        console.log(response)
      if (response.ok) {
        alert('Registration successful');
        window.location.href = '/login.html'; 
      } else {
        alert('Registration failed. Please try again.');
      }
    })
    .catch(function(error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again later.');
    });
  });
  