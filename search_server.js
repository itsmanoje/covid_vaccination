const express = require('express');
const mongoose = require('mongoose');
const Center = require('./center');

// ...

// Search vaccination centers route
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

// ...

