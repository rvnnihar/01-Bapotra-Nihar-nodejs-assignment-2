const User = require("../model/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log({ email })
        if (!user) {
            return res.status(401).send('Authentication failed');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Authentication failed');
        }

        const token = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' });

        req.session.token = token;

        res.redirect("/students");

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


exports.logout = (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
        
        // Redirect the user to the login page or any other desired page
        res.redirect('/');
    });
}