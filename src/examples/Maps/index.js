import { Card } from '@mui/material';
import MDBox from 'components/MDBox';
import React, { useEffect, useRef } from 'react';

const GoogleMapComponent = React.forwardRef(({ lat, lng }, ref) => {
  const mapRef = ref || useRef(null);

  useEffect(() => {
    const initMap = () => {
      const pinLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 20,
        center: pinLocation,
      });
      const marker = new window.google.maps.Marker({
        position: pinLocation,
        map: map,
        title: 'My Pin',
      });
    };

    const loadGoogleMapScript = () => {
      if (window.google && window.google.maps) {
        initMap(); // Call initMap if Google Maps API is already loaded
      } else {
        window.initMap = initMap; // Define initMap globally
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBwzbz3UcUkp4l5qsD0clePzJZtyLIhf9U&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
          // Clean up the script when the component unmounts
          document.head.removeChild(script);
        };
      }
    };

    loadGoogleMapScript();
  }, [lat, lng]);

  return (
    <Card
      sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', // Set the desired width here
          backgroundColor: 'white',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
      }}
    >
      <MDBox ref={mapRef} style={{ height: '70vh', width: '100%' }}></MDBox>
    </Card>
  );
});

export default GoogleMapComponent;