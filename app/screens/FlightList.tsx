import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import FlightCard from '../component/FlightCard';
import flightsData from '../services/data/flights';
import Header from '../component/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FlightList = ({ navigation }) => {
  const pageSize = 10;
  const [page, setPage] = useState(1);

  const visibleFlights = flightsData.slice(0, page * pageSize);
  const hasMore = visibleFlights.length < flightsData.length;

  return (
    <View style={{ flex: 1 }}>
      <Header title="Flights" />
      <ScrollView contentContainerStyle={styles.container}>
        {visibleFlights.map((flight, index) => (
          <FlightCard
            key={index}
            flight={flight}
            onPress={() => navigation.navigate('FlightDetail', { flight })}
          />
        ))}

        {hasMore && (
          <TouchableOpacity onPress={() => setPage(page + 1)} style={styles.buttonWrapper}>
            <Text style={styles.loadMoreText}>Load More Flights</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Floating ChatBot Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ChatBot')}
      >
        <Icon name="chat" size={24} color="#FFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#E6F7FF',
  },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1E90FF',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default FlightList;
