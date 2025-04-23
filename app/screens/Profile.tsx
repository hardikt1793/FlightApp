// screens/ProfileScreen.js
import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/Header';

const Profile = () => {
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      Alert.alert('Signed Out', 'You have been signed out successfully.');
    } catch (error) {
      Alert.alert('Sign-Out Error', error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Profile" />
      <View style={styles.container}>
        <Text style={styles.text}>Profile</Text>
        <Button title="Sign Out" onPress={handleSignOut} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
