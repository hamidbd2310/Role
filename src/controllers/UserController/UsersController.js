const UsersModel = require('../../models/UserModel/UsersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registration = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await UsersModel.create({ ...req.body, password: hashedPassword });
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "Failed", message: "Email and password are required." });
        }

        const users = await UsersModel.aggregate([
            { $match: { email: email } },
            { $project: { _id: 1, firstName: 1, lastName: 1, email: 1, mobile: 1, password: 1, photo: 1 } }
        ]);

        if (users.length === 0) {
            return res.status(401).json({ status: "Unauthorized", message: "Invalid email or password." });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: "Unauthorized", message: "Invalid email or password." });
        }

        const payload = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                password: user.password,
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('token', token, cookieOptions);

        const responseData = {
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            photo: user.photo
        };

        res.status(200).json({ status: "Success", token: token, data: responseData });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};

exports.profileUpdate = async (req, res) => {
    try {
        const email = req.headers.email;
        let user = await UsersModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ status: "Failed", message: "User not found." });
        }

        const { email: _, password: newPassword, ...updateData } = req.body;

        Object.assign(user, updateData);

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }
        const responseData = {
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            photo: user.photo
        };

        await user.save();

        res.status(200).json({ status: "Success", data: responseData });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Internal server error.", error: error.message });
    }
};