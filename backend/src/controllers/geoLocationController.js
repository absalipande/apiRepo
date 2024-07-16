import axios from 'axios';
import pool from '../db.js';

export const getGeoLocation = async (req, res) => {
  const { ip } = req.body;

  const isIpAddress = (input) => {
    const parts = input.split('.');
    return parts.length === 4 && parts.every(part => {
      const num = Number(part);
      return num >= 0 && num <= 255;
    });
  };

  const isAsn = (input) => input.toUpperCase().startsWith('AS') && !isNaN(Number(input.slice(2)));

  if (!isIpAddress(ip) && !isAsn(ip)) {
    return res.status(400).json({ message: 'Invalid IP address or ASN' });
  }

  try {
    let url;
    if (isIpAddress(ip)) {
      url = `https://ipinfo.io/${ip}/geo`;
    } else {
      url = `https://ipinfo.io/${ip}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.IPINFO_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching or storing geolocation information', error });
  }
};

export const getUserGeoLocation = async (req, res) => {
  try {
    const userIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
 
    if (!userIp) {
      return res.status(400).json({ message: 'Unable to determine user IP address' });
    }

    const response = await axios.get(`https://ipinfo.io/${userIp}/geo`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching geolocation information', error });
  }
};

export const addGeoLocation = async (req, res) => {
  const { ip } = req.body;
  console.log(`Received request to add geolocation for IP address: ${ip}`);

  try {
    let url;
    if (ip.toUpperCase().startsWith('AS')) {
      url = `https://ipinfo.io/${ip}`;
    } else {
      url = `https://ipinfo.io/${ip}/geo`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.IPINFO_TOKEN}`,
      },
    });

    const geoInfo = response.data;
    console.log(`Fetched geolocation data for IP address: ${ip}:`, geoInfo);

    await pool.query('INSERT INTO search_history (ip, geo_info) VALUES ($1, $2)', [ip, geoInfo]);
    console.log(`Inserted geolocation data for IP address: ${ip} into database`);

    res.json(geoInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching or storing geolocation information', error });
  }
}

export const getHistory = async (req, res) => {
  console.log(`Received request to fetch search history`);

  try {
    const result = await pool.query('SELECT * FROM search_history ORDER BY created_at DESC');
    console.log(`Fetched search history:`, result.rows);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search history', error });
  }
};

export const deleteHistories = async (req, res) => {
  const { ids } = req.body;
  console.log(`Received request to delete histories with IDs: ${ids}`);

  try {
    const result = await pool.query('DELETE FROM search_history WHERE id = ANY($1) RETURNING *', [ids]);
    console.log(`Deleted histories:`, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error deleting histories:`, error);
    res.status(500).json({ message: 'Error deleting histories', error });
  }
};
