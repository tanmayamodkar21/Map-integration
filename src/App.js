import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import axios from 'axios';
import './App.css';

const Map = () => {
  const defaultPosition = [20.0112475, 73.7902364];
  const [position, setPosition] = useState(defaultPosition);
  const [cityInfo, setCityInfo] = useState(null);

  const fetchCityInfo = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=acfc4f58224140f3ad0fd6630f639d08`
      );

      console.log('API response:', response.data);

      const { city, state, country } = response.data.results[0].components;
      setCityInfo({ city, state, country });
    } catch (error) {
      console.error('Error fetching city info:', error.message);
    }
  };

  const handleSearch = async (city) => {
    try {
      console.log(`Searching for city: ${city}`);
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=acfc4f58224140f3ad0fd6630f639d08`
      );

      console.log('API response:', response.data);

      const { lat, lng } = response.data.results[0].geometry;
      setPosition([lat, lng]);
      fetchCityInfo(lat, lng);
      console.log('New position:', [lat, lng]);
    } catch (error) {
      console.error('Error searching for city:', error.message);
    }
  };

  const customIcon = new L.Icon({
    iconUrl: require('./Marker.png'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });


  useEffect(() => {
    fetchCityInfo(...defaultPosition);
  }, []);

  return (
    <div className="map-container">
      <div className="search-container">
        <input type="text" placeholder="Enter city" />
        <button onClick={() => handleSearch(document.querySelector('input').value)}>Search</button>
      </div>
      <MapContainer key={`${position[0]}-${position[1]}`} center={position} zoom={8} style={{ width: '100%', height: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            A marker indicating the city.
          </Popup>
        </Marker>
      </MapContainer>
      {cityInfo && (
        <div className="city-info">
          <p>
            City: {cityInfo.city}, {cityInfo.state}, {cityInfo.country}
          </p>
          <p>Latitude: {position[0]}</p>
          <p>Longitude: {position[1]}</p>
        </div>
      )}
    </div>
  );
};

export default Map;
