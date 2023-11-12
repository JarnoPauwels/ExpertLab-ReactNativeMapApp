import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import poiData from './poiData.json';
import { GOOGLE_MAPS_API_KEY } from './ApiKey';

const customMapStyle = [
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [compassData, setCompassData] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  const requestMagnetometerPermission = async () => {
    const { status } = await Magnetometer.getPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access the magnetometer sensor is denied.');
    }
  };

  const updateCompassData = ({ x, y }) => {
    const rotation = Math.atan2(y, x) * (270 / Math.PI);
    setCompassData(rotation);
  };

  useEffect(() => {
    getLocation();
    requestMagnetometerPermission();
    Magnetometer.setUpdateInterval(500);

    Magnetometer.addListener(updateCompassData);

    return () => {
      Magnetometer.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          // region={{
          //   latitude: location.latitude,
          //   longitude: location.longitude,
          //   latitudeDelta: 0.001,
          //   longitudeDelta: 0.001,
          // }}
          showsUserLocation
          zoomEnabled
          provider="google"
          customMapStyle={customMapStyle} 
          camera={{
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            pitch: 0,
            heading: compassData || 0, 
            altitude: 1000, // IOS
            zoom: 18, // GOOGLE
          }}
        >
          {poiData.map((poi) => (
            <Marker
              key={poi.id}
              coordinate={{
                latitude: poi.latitude,
                longitude: poi.longitude,
              }}
              title={poi.name}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

export default MapScreen;
