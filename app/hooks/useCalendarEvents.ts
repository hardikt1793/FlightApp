import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

type UseCalendarEventsReturn = {
  events: RNCalendarEvents[];
  error: string | null;
  refreshing: boolean;
  fetchEvents: () => Promise<void>;
};

const useCalendarEvents = (): UseCalendarEventsReturn => {
  const [events, setEvents] = useState<RNCalendarEvents[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchEvents = async (): Promise<void> => {
    try {
      setRefreshing(true);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError('Calendar permission denied');
          setRefreshing(false);
          return;
        }
      }

      const status = await RNCalendarEvents.requestPermissions();
      if (status === 'authorized') {
        const startDate = new Date().toISOString();
        const endDate = new Date(
          new Date().getFullYear(),
          11,
          31,
        ).toISOString(); // Last day of the current year
        const fetchedEvents = await RNCalendarEvents.fetchAllEvents(
          startDate,
          endDate,
        );

        // Filter upcoming events, include specific keywords in title or description, and sort by date
        const includedKeywords = ['Flight', 'Booking', 'Amazon', 'Movie'];
        const upcomingEvents = fetchedEvents
          .filter(
            event =>
              new Date(event.startDate) > new Date() &&
              includedKeywords.some(
                keyword =>
                  event.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                  event.description
                    ?.toLowerCase()
                    .includes(keyword.toLowerCase()),
              ),
          )
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          );

        setEvents(upcomingEvents);
      } else {
        setError('Calendar permission denied');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {events, error, refreshing, fetchEvents};
};

export default useCalendarEvents;
