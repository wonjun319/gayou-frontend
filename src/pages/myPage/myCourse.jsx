import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import PostCard from '../../components/common/PostCard';

const MyCourse = () => {
  const [myData, setMyData] = useState(null);

  const GetData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/springboot/route/locations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleDeletePost = id => {
    setMyData(prevData => prevData.filter(post => post.id !== id));
  };

  return (
    <Box>
      {myData && myData.length > 0 ? (
        <Box>
          {myData.map((data, index) => (
            <PostCard key={index} data={data} onDelete={handleDeletePost} />
          ))}
        </Box>
      ) : (
        <Box>No Data Available</Box>
      )}
    </Box>
  );
};

export default MyCourse;
