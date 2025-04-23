import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FlightCard = ({
  airlineName,
  onPress,
  departureTime,
  departureFrom,
  arrivalTime,
  arrivalFrom,
  pnr,
  bookingDate,
  additionalNotes,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {airlineName && (
        <View style={styles.header}>
          <Text style={styles.airlineText}>{airlineName}</Text>
        </View>
      )}

      <View style={styles.timeRow}>
        <View style={styles.locationWrapper}>
          <Text style={styles.cityText}>{departureFrom || 'N/A'}</Text>
          <Text style={styles.timeText}>{departureTime || 'N/A'}</Text>
        </View>

        <View style={styles.lineWrapper}>
          <View style={styles.line} />
          <Icon
            name="airplane"
            size={20}
            color="#6B7280"
            style={styles.planeIcon}
          />
          <View style={styles.line} />
        </View>

        <View style={styles.locationWrapper}>
          <Text style={styles.cityText}>{arrivalFrom || 'N/A'}</Text>
          <Text style={styles.timeText}>{arrivalTime || 'N/A'}</Text>
        </View>
      </View>

      {pnr && (
        <View style={styles.pnrContainer}>
          <Text style={styles.pnrLabel}>PNR:</Text>
          <Text style={styles.pnrText}>{pnr}</Text>
        </View>
      )}

      {bookingDate && (
        <View style={styles.bookingContainer}>
          <Text style={styles.bookingLabel}>Booking Date:</Text>
          <Text style={styles.bookingText}>{bookingDate}</Text>
        </View>
      )}

      {additionalNotes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Additional Notes:</Text>
          <Text style={styles.notesText}>{additionalNotes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 12,
  },
  airlineText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locationWrapper: {
    flex: 2, // Adjusted flex to ensure proper spacing
    alignItems: 'center',
  },
  cityText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  lineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Reduced flex to prevent pushing content
  },
  line: {
    height: 1,
    backgroundColor: '#D1D5DB',
    flex: 1,
  },
  planeIcon: {
    marginHorizontal: 8,
  },
  pnrContainer: {
    marginTop: 16,
  },
  pnrLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  pnrText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  bookingContainer: {
    marginTop: 16,
  },
  bookingLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  bookingText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  notesText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
});

export default FlightCard;
