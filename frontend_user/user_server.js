const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const paymentRoutes = require('./payment/payment-routes');
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');

app.use(session({
  secret: 'pet123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 1}
}));



const PORT = 4000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EasyPetpuja')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Mongo error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, unique: true, required: true }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from respective directories
app.use('/home', express.static(path.join(__dirname, 'home')));
app.use('/login', express.static(path.join(__dirname, 'login')));
app.use('/menu', authMiddleware, express.static(path.join(__dirname, 'menu')));
function authMiddleware(req, res, next) {
  if (req.session.loggedIn && req.session.user) {
    next(); // allow access
  } else {
    res.redirect('/login/userlogin.html'); // block access
  }
}
// Serve images inside menu/images so frontend can load /images/xxx.jpg
app.use("/images", express.static(path.join(__dirname, "menu/images")));

// Menu API
const MenuItem = require("./models/MenuItem");

app.get("/api/menu", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});


app.get('/menu/menu.html', (req, res) => {
  if (!req.session.user) { 
      return res.redirect('/login/userlogin.html'); // Redirect to login page
  }
  res.sendFile(path.join(__dirname, 'menu', 'menu.html')); // Serve the menu page if logged in
});


// Serve static files for payment
app.use('/payment', paymentRoutes); // Use payment routes

// Route to serve static files in payment folder
app.use('/payment', express.static(path.join(__dirname, 'payment')));

app.get('/', (req, res) => {
    res.redirect('/home/userget.html');
});

app.post('/login', async (req, res) => {
    const { username, password, mobile } = req.body;
    const user = await User.findOne({ username, password, mobile });
    if (user) {
      req.session.loggedIn = true; 
      req.session.user = user;
        res.redirect('/menu/menu.html'); 
    } else {
        return res.send(`
      <html>
        <head>
          <style>
            .popup {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #f44336;
              color: #fff;
              padding: 15px 20px;
              border-radius: 8px;
              font-family: Arial, sans-serif;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="popup">Invalid login. Please Sign Up...</div>
          <script>
            setTimeout(() => {
              window.location.href = "/login/usersign.html";
            }, 1000);
          </script>
        </body>
      </html>
    `);
    }
});

app.post('/signup', async (req, res) => {
    const { username, password, mobile } = req.body;

    // Check if all fields are the same (username, password, and mobile)
    const existingUser = await User.findOne({ username, password, mobile });
    if (existingUser) {
        return res.send(`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background:rgb(176, 52, 44);
        color: white;
        padding: 15px;
        border-radius: 5px;
        font-family: Arial;
        z-index: 999;">
        <strong>User already exists with the same username, password, and mobile number. Please <a href='/login/userlogin.html' style='color: #fff;'>login here</a></strong>
      </div>
    `);
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return res.send(`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background:rgb(176, 52, 44);
        color: white;
        padding: 15px;
        border-radius: 5px;
        font-family: Arial;
        z-index: 999;">
        <strong>Username already exists. Please choose another username.</strong><br/>
        <a href="/login/usersign.html" style="color: #fff; text-decoration: underline;">Click to signup again</a>
      </div>
    `);
    }

    // Check if the mobile number already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
        return res.send(`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background:rgb(176, 52, 44);
        color: white;
        padding: 15px;
        border-radius: 5px;
        font-family: Arial;
        z-index: 999;">
        <strong>This mobile number is already in use. Please choose another one.</strong><br/>
        <a href="/login/usersign.html" style="color: #fff; text-decoration: underline;">Click to signup again</a>
      </div>
    `);
    }

    // If no user or mobile number is found, create a new user
    const newUser = new User({ username, password, mobile });
    await newUser.save();

    // Redirect to login page
    res.redirect('/login/userlogin.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
      res.redirect('/login/userlogin.html'); // Redirect after logging out
  });
});


// Payment routes
app.use('/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
