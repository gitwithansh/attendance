import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { transporter } from '../config/nodemailer.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (req, res) => {
  console.log("register hit",req.body);
  try {
    const { name, email, password } = req.body;
    let adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (error) {
    console.log("register crash error",error);
    res.status(500).json({ message: error.message });
  }
};

export const loginInitiate = async (req, res) => {
  console.log("api hit for imal logn",req.body.email);
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();
console.log("👉 Sending email via Brevo API...");
        
        // --- BREVO HTTP API CODE ---
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { email: process.env.EMAIL_USER, name: 'Blinkit Admin' },
                to: [{ email: email }],
                subject: 'Blinkit Portal Login Verification OTP',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0;">
                        <h2 style="color: #f7c200; background: #0c831f; padding: 10px; border-radius: 4px;">
                            Your OTP code for admin portal login verification is:
                        </h2>
                        <h1 style="color: #0c831f; letter-spacing: 4px;">${otp}</h1>
                        <p>This OTP is valid for 10 minutes.</p>
                    </div>
                `
            })
        });
if (!response.ok) {
            const errData = await response.json();
            console.error("🚨 Brevo API Error:", errData);
            throw new Error("Failed to send email via Brevo");
        }
        // --- BREVO HTTP API CODE END ---

        console.log("✅ Email sent successfully via Brevo!");
    res.status(200).json({ message: 'OTP sent to email', email });
  } catch (error) {
    console.log("asli",error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || admin.otp !== otp || admin.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpires = Date.now() + 10 * 60 * 1000;
    await admin.save();

    await transporter.sendMail({
      from: `"Blinkit Admin Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resent: Blinkit Portal Verification OTP',
      html: `<h2>Your new OTP is: <span style="color:#0c831f;">${otp}</span></h2>`
    });

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};