import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Button,
} from 'react-native';
import useCalendarEvents from '@hooks/useCalendarEvents';
import Header from '../component/Header';

const CalendarEvents: React.FC = () => {
  const {events, error, refreshing, fetchEvents} = useCalendarEvents();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(
      new Date(dateString),
    );
  };

  const renderEvent = ({item}: {item: any}) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{formatDate(item.startDate)}</Text>
      {item.description && (
        <Text style={styles.eventDescription}>{item.description}</Text>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Grant Permission" onPress={fetchEvents} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
    <Header title="Calender Event" />
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEvent}
        ListEmptyComponent={<Text>No events found</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />
        }
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
  },
  eventDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CalendarEvents;
