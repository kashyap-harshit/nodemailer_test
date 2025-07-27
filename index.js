const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
    }
})

app.post('/contact', async (req, res)=>{
    const {name, email, message} = req.body;
    try{
        const info = await transporter.sendMail({
            from: `${name} <${email}>`,
            to: process.env.GMAIL_USER,
            subject: "New Contact Form Submission",
            text : message,
            replyTo: email
        })
        console.log("message sent", info.messageId);
        res.status(200).json({success: true, messageId: info.messageId})
    }catch(e){
        console.log("error sending message : ", e);
        res.status(500).json({success: false, messageId: info.messageId})
    }
})

app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
})