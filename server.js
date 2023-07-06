const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(cors());

const SECRET_KEY = 'mysecretkey';

let users = []; // database simulato in memoria

app.post('/api/register', async (req, res) => {
    const { username, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword,
        name,
    });

    res.status(201).json({ message: 'User registered' });
});

app.post('/api/authenticate', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ name: user.name, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
    });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.post('/api/updateProfile', async (req, res) => {
    const token = req.headers['authorization'];
    const { name } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find(user => user.name === decoded.name);

        if (user) {
            user.name = name;
            res.json({ message: 'Profile updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.post('/api/updateDetails', async (req, res) => {
    const token = req.headers['authorization'];
    const { bio, projects, skills, contacts } = req.body;
    
    try {        
        console.log('Token:', token);
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Decoded:', decoded);
        const user = users.find(user => user.username === decoded.username);
        console.log(user.username);
        console.log(decoded.username);

        if (user) {
            user.bio = bio;
            user.projects = projects;
            user.skills = skills;
            user.contacts = contacts;

            res.json({ message: 'Details updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
