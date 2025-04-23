// components/Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();
  const route = useRoute();

  // List of bottom tab screen names
  const bottomTabs = ['Flight', 'CalendarEvents', 'Profile'];

  // Determine if the back button should be hidden
  const hideBack = bottomTabs.includes(route.name);

  return (
    <View style={styles.header}>
      {!hideBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, hideBack && { marginLeft: 0 }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtn: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Header;
