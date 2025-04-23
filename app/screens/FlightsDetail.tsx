import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import Header from '../component/Header';
import MapView, {Marker, PROVIDER_DEFAULT, Polyline} from 'react-native-maps';

const FlightsDetail = ({route}: {route: any}) => {
  const {flight} = route.params || {};

  const departureCoords = {latitude: 40.6413, longitude: -73.7781};
  const arrivalCoords = {latitude: 50.0379, longitude: 8.5622};

  return (
    <>
      <Header title="Flight Details" />
      <ScrollView
        bounces={false}
        style={styles.container}
        stickyHeaderIndices={[0]}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: (departureCoords.latitude + arrivalCoords.latitude) / 2,
            longitude:
              (departureCoords.longitude + arrivalCoords.longitude) / 2,
            latitudeDelta: 70,
            longitudeDelta: 70,
          }}>
          <Marker
            coordinate={departureCoords}
            title={flight?.departure?.airport}
            description="Departure Airport"
          />
          <Marker
            coordinate={arrivalCoords}
            title={flight?.arrival?.airport}
            description="Arrival Airport"
          />
          <Polyline
            coordinates={[departureCoords, arrivalCoords]}
            strokeColor="#FF5733"
            strokeWidth={2}
          />
        </MapView>

        <View style={styles.card}>
          <Text style={styles.flightHeader}>
            {flight?.departure?.iata} to {flight?.arrival?.iata}
          </Text>
          <Text style={styles.statusLine}>
            Flight Status: {flight?.flight_status || 'N/A'}
          </Text>

          <View style={styles.airportBlock}>
            <View>
              <Text style={styles.airportCode}>{flight?.departure?.iata}</Text>
              <Text style={styles.airportLabel}>
                {flight?.departure?.airport}
              </Text>
              <Text style={styles.gateInfo}>
                Terminal {flight?.departure?.terminal} • Gate{' '}
                {flight?.departure?.gate}
              </Text>
              <Text style={styles.gateInfo}>
                Scheduled:{' '}
                {new Date(flight?.departure?.scheduled).toLocaleString()}
              </Text>
              <Text style={styles.gateInfo}>
                Actual: {new Date(flight?.departure?.actual).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.time}>
              {new Date(flight?.departure?.estimated).toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.airportBlock}>
            <View>
              <Text style={styles.airportCode}>{flight?.arrival?.iata}</Text>
              <Text style={styles.airportLabel}>
                {flight?.arrival?.airport}
              </Text>
              <Text style={styles.gateInfo}>
                Terminal {flight?.arrival?.terminal} • Gate{' '}
                {flight?.arrival?.gate}
              </Text>
              <Text style={styles.gateInfo}>
                Scheduled:{' '}
                {new Date(flight?.arrival?.scheduled).toLocaleString()}
              </Text>
              <Text style={styles.gateInfo}>
                Actual: {new Date(flight?.arrival?.actual).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.time}>
              {new Date(flight?.arrival?.estimated).toLocaleTimeString()}
            </Text>
          </View>

          <Text style={styles.flightInfo}>
            Airline: {flight?.airline?.name} ({flight?.airline?.iata})
          </Text>
          <Text style={styles.flightInfo}>
            Flight Number: {flight?.flight?.iata}
          </Text>
          <Text style={styles.flightInfo}>
            Aircraft: {flight?.aircraft?.iata} ({flight?.aircraft?.registration}
            )
          </Text>
          <Text style={styles.flightInfo}>
            Baggage Claim: {flight?.arrival?.baggage || 'N/A'}
          </Text>
          <Text style={styles.flightInfo}>
            Duration: {flight?.duration || 'N/A'}
          </Text>
          <Text style={styles.flightInfo}>PNR: {flight?.pnr || 'N/A'}</Text>
          <Text style={styles.flightInfo}>
            Booking Date: {flight?.bookingDate || 'N/A'}
          </Text>
          <Text style={styles.flightInfo}>
            Additional Notes: {flight?.additionalNotes || 'N/A'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 10,
  },
  flightHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statusLine: {
    color: '#2ECC71',
    marginBottom: 16,
    fontSize: 14,
  },
  airportBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
  },
  airportCode: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  airportLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  gateInfo: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  flightInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    marginTop: 14,
  },
});

export default FlightsDetail;
