const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const cors = require('cors');
const PORT = process.env.port || 3001;

app.use(express.json());
app.use(cors());

const dummyUser = {
    username: 'user',
    password: 'password',
    name: 'John Doe',
};

const SECRET_KEY = 'mysecretkey';

app.post('/api/authenticate', (req, res) => {
    const { username, password } = req.body;

    if (username === dummyUser.username && password === dummyUser.password) {
        const token = jwt.sign({ name: dummyUser.name }, SECRET_KEY, {
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