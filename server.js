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
        const token = jwt.sign({ name: user.name }, SECRET_KEY, {
        expiresIn: "1h",
    });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
