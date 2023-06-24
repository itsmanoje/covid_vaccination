const express = require('express');
const session = require('express-session');
const Center = require('./center');
const mongoose = require('mongoose');
const User = require('./user');
const admin = require('./admin')

mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Failed to connect to MongoDB:', error));

const app = express();
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
  
// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      
      req.session.userId = user._id;
  
      return res.json({ message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});
// Protected route
app.get('/dashboard', (req, res) => {
  
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({ message: 'Welcome to the dashboard' });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.json({ message: 'Logged out successfully' });
  });
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all the fields' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create a new user in the database
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.sendStatus(201); 
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/centers', async (req, res) => {
  const location = req.query.location;

  try {
    // Fetch vaccination centers from the database
    const centers = await Center.find({ location });

    res.json(centers);
  } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.sendStatus(500); 
    } else {
      res.redirect('/login.html'); 
    }
  });
});

// Admin registration route
app.post('/admin/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create a new admin
    const admin = new Admin({
      username,
      password
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.sendStatus(500); // Internal server error
  }
});
// Vaccination center registration route
app.post('/centers', async (req, res) => {
  const { name, address, hours } = req.body;

  try {
    const center = new VaccinationCenter({
      name,
      address,
      hours
    });

    await center.save();

    res.status(201).json({ message: 'Vaccination center registered successfully' });
  } catch (error) {
    console.error('Vaccination center registration error:', error);
    res.sendStatus(500);
  }
});

// Get dosage details grouped by vaccination centers
app.get('/dosage-details', async (req, res) => {
  try {
    const dosageDetails = await VaccinationCenter.aggregate([
      {
        $group: {
          _id: '$name',
          dosageCount: { $sum: 1 }
        }
      }
    ]);

    res.json(dosageDetails);
  } catch (error) {
    console.error('Dosage details retrieval error:', error);
    res.sendStatus(500); 
  }
});

// Remove a vaccination center
app.delete('/centers/:id', async (req, res) => {
  const { id } = req.params;

  try {
   const deletedCenter = await VaccinationCenter.findByIdAndRemove(id);

    if (!deletedCenter) {
      return res.status(404).json({ message: 'Vaccination center not found' });
    }

    res.json({ message: 'Vaccination center removed successfully' });
  } catch (error) {
    console.error('Vaccination center removal error:', error);
    res.sendStatus(500); 
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
