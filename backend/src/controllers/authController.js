import { findUserByEmail, createUser } from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

export const loginOrSignup = async (req, res) => {
  const { email, password } = req.body;

  let userIp;
  try {
    const publicIpResponse = await axios.get('https://api.ipify.org?format=json');
    userIp = publicIpResponse.data.ip;
  } catch (error) {
    console.error('Error fetching public IP address:', error);
    return res.status(500).json({ message: 'Error fetching public IP address', error });
  }
  console.log(`User IP: ${userIp}`);

  try {
    const geoResponse = await axios.get(`https://ipinfo.io/${userIp}/geo?token=${IPINFO_TOKEN}`);
    const geoData = geoResponse.data;

    let user = await findUserByEmail(email);

    // existing user
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Logged in successfully', token });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // new uyser
      user = await createUser(email, password, geoData);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'User created and logged in', token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in or signing up', error });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

export const verify = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.json({ message: 'Authenticated' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
