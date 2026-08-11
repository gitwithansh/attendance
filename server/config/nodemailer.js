import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config();

export const transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});