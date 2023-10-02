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

        res.status(200).json({status:true,token:token,message : ""});

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

