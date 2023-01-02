import { db } from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


export const register = (req, res) => {

    // CHECK EXISTING USER
    const q = "SELECT * FROM users WHERE email = ? OR username = ?"
    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("User already exists!");
        
        // HASH THE PASSWORD AND CREATE A USER
        const saltRounds = 10;
        const plainPassword = req.body.password;
        
        bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
            // Insert the non-existing user into Database
            const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
            const values = [
                req.body.username,
                req.body.email,
                hash,
            ];
            
            db.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.status(200).json("User has been created");
            })
        });
            
    })
    
}
export const login = (req, res) => {
    //CHECK THE USER IF EXISTS
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data.length) return res.status(404).json("User not found!");

        // Check the password
        const plainPassword = req.body.password;
        const hashedPasswordFromDB = data[0].password;
        bcrypt.compare(plainPassword, hashedPasswordFromDB, function(err, result) {
            if(result) return res.status(400).json("Wrong email or password");

            const token = jwt.sign({id: data[0].id}, process.env.TOKEN_SECRET);

            const { password, ...other } = data;

            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).send(other)

        });
    })
}
export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
}