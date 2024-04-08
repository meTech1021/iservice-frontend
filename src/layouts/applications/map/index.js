import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapContainer = ({ address }) => {
  const [center, setCenter] = useState(null);

  // Use Google Maps Geocoding API to convert address to coordinates
  useEffect(() => {
    if (address && window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: getAddressString(address) }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            setCenter({ lat: lat(), lng: lng() });
          }
        });
    }
  }, [address]);

  // Format address object into a string
  const getAddressString = (address) => {
    return `${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`;
  };

  return (
    <LoadScript googleMapsApiKey={process.env.googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {center && <Marker position={center} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapContainer;
