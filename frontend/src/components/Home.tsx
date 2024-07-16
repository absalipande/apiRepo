import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import Input from './Input';

interface GeoLocation {
  ip?: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  registry?: string;
  allocated?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  asn?: string;
  name?: string;
  domain?: string;
  num_ips?: number;
  type?: string;
}

interface HistoryEntry {
  id: number;
  ip: string;
}

const Home: React.FC = () => {
  const [searchIp, setSearchIp] = useState('');
  const [searchGeoData, setSearchGeoData] = useState<GeoLocation | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = sessionStorage.getItem('token');

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const uniqueHistory = response.data.reduce((acc: HistoryEntry[], current: any) => {
        if (!acc.some((entry) => entry.ip === current.ip)) {
          acc.push({ id: current.id, ip: current.ip });
        }
        return acc;
      }, []);
      setHistory(uniqueHistory);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearchGeoLocationFetch = async (ipAddress: string) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/geoinfo',
        { ip: ipAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchGeoData(response.data);
      toast.success('Geolocation fetched successfully');
      fetchHistory(); // uupdate the history
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching geolocation');
      toast.error('Error fetching geolocation');
      console.error('Error fetching geolocation:', err);
    }
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchIp) {
      toast.error('Please enter an IP address or ASN to search');
      return;
    }

    const isIpAddress = (input: string) => {
      const parts = input.split('.');
      return (
        parts.length === 4 &&
        parts.every((part) => {
          const num = Number(part);
          return num >= 0 && num <= 255;
        })
      );
    };

    const isAsn = (input: string) => input.toUpperCase().startsWith('AS') && !isNaN(Number(input.slice(2)));

    if (!isIpAddress(searchIp) && !isAsn(searchIp)) {
      toast.error('Please enter a valid IP address or ASN');
      return;
    }

    setError(null);
    toast.loading('Searching geolocation...');
    await handleSearchGeoLocationFetch(searchIp);
    toast.dismiss();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete('http://localhost:3000/api/history', {
        data: { ids: [id] },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('History deleted successfully');
      fetchHistory();
    } catch (err: any) {
      toast.error('Error deleting history');
      console.error('Error deleting history:', err);
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl w-full space-y-8'>
        <div className='flex'>
          <div className='w-1/4 p-4 border-r border-gray-300 rounded-lg shadow-lg overflow-y-auto max-h-80'>
            <h3 className='text-center text-xl font-bold mb-4'>Search History</h3>
            <div className='flex flex-col items-start'>
              {history.map((entry) => (
                <div key={entry.id} className='flex items-center mb-2 w-full'>
                  <input type='checkbox' className='mr-2 h-5 w-5' />
                  <p className='text-blue-500 cursor-pointer flex-grow' onClick={() => handleSearchGeoLocationFetch(entry.ip)}>
                    {entry.ip}
                  </p>
                  <button onClick={() => handleDelete(entry.id)} className='text-red-500 hover:text-red-700'>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className='w-3/4 p-4'>
            <form className='flex items-center justify-start mb-8' onSubmit={handleSearchSubmit}>
              <Input id='searchIp' type='text' placeholder='IP address or ASN' value={searchIp} onChange={(event) => setSearchIp(event.target.value)} />
              <button type='submit' className='ml-4 py-2 px-6 rounded-lg border border-transparent text-sm font-medium text-white bg-blue-500 hover:bg-blue-700'>
                Search
              </button>
            </form>
            {error && <p className='text-red-500 text-center'>{error}</p>}
            {searchGeoData && (
              <div className='border border-gray-300 p-4 rounded-lg shadow-lg'>
                <h3 className='text-center text-xl font-bold mb-4'>Geolocation Data</h3>
                <div className='space-y-2'>
                  {'ip' in searchGeoData && (
                    <>
                      <p>
                        <strong>IP:</strong> {searchGeoData.ip}
                      </p>
                      <p>
                        <strong>Hostname:</strong> {searchGeoData.hostname}
                      </p>
                      <p>
                        <strong>City:</strong> {searchGeoData.city}
                      </p>
                      <p>
                        <strong>Region:</strong> {searchGeoData.region}
                      </p>
                      <p>
                        <strong>Country:</strong> {searchGeoData.country}
                      </p>
                      <p>
                        <strong>Location:</strong> {searchGeoData.loc}
                      </p>
                      <p>
                        <strong>Organization:</strong> {searchGeoData.org}
                      </p>
                      <p>
                        <strong>Postal:</strong> {searchGeoData.postal}
                      </p>
                      <p>
                        <strong>Timezone:</strong> {searchGeoData.timezone}
                      </p>
                    </>
                  )}
                  {'asn' in searchGeoData && (
                    <>
                      <p>
                        <strong>ASN:</strong> {searchGeoData.asn}
                      </p>
                      <p>
                        <strong>Name:</strong> {searchGeoData.name}
                      </p>
                      <p>
                        <strong>Country:</strong> {searchGeoData.country}
                      </p>
                      <p>
                        <strong>Allocated:</strong> {searchGeoData.allocated}
                      </p>
                      <p>
                        <strong>Registry:</strong> {searchGeoData.registry}
                      </p>
                      <p>
                        <strong>Domain:</strong> {searchGeoData.domain}
                      </p>
                      <p>
                        <strong>Num IPs:</strong> {searchGeoData.num_ips}
                      </p>
                      <p>
                        <strong>Type:</strong> {searchGeoData.type}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center justify-center mt-8'>
          <button
            onClick={() => {
              sessionStorage.removeItem('token');
              window.location.href = '/';
            }}
            className='group relative w-5/6 flex justify-center py-5 px-4 rounded-lg border border-transparent text-sm font-medium text-white bg-red-500 hover:bg-red-700'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
