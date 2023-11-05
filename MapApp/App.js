import React from 'react';
import { View, StatusBar } from 'react-native';
import MapScreen from './MapScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <MapScreen />
    </View>
  );
}
