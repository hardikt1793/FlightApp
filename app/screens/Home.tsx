import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchEmailList, fetchEmailDetails} from '@services/api/emailService';
import Header from '../component/Header';
import FlightCard from '../component/FlightCard';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Buffer} from 'buffer';
import {GOOGLE_IOS_CLIENT_ID, OPENAI_API_KEY} from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Email {
  id: string;
  subject: string;
  body: string;
}

GoogleSignin.configure({
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
});

const flightKeywords = [
  'flight',
  'ticket',
  'booking',
  'itinerary',
  'airline',
  'departure',
  'arrival',
  'boarding pass',
  'confirmation',
  'details',
  'travel',
  'confirm',
  'status',
];

const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) {
    return 'N/A';
  }
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const isFlightEmail = (subject: string, body: string): boolean => {
  const combinedText = `${subject.toLowerCase()} ${body.toLowerCase()}`;
  const matchedKeywords = flightKeywords.filter(keyword =>
    combinedText.includes(keyword.toLowerCase()),
  );
  return matchedKeywords.length >= 3;
};

const truncateEmailBody = (
  emailBody: string,
  maxLength: number = 4000,
): string => {
  if (emailBody.length > maxLength) {
    return emailBody.slice(0, maxLength) + '... [Content Truncated]';
  }
  return emailBody;
};

const parseEmailWithOpenAI = async (emailBody: string): Promise<any> => {
  try {
    const truncatedBody = truncateEmailBody(emailBody);
    const prompt = `
      Extract the following details from the email:
      - pnr
      - passenger_name
      - airline_name
      - flight_number
      - departure_location
      - departure_airport_code
      - departure_time (in Date Time format)
      - arrival_location
      - arrival_airport_code
      - arrival_time (in Date Time format)
      - duration
      - booking_date (in Date format)
      - additional_notes

      Email Content:
      ${truncatedBody}

      Return the details in a JSON data object (exclude markdown formatting).And keep the JSON object consistent.
    `.trim();

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that extracts flight details from emails.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    console.log('OpenAI response', response.data.choices[0].message.content);
    const parsedData = JSON.parse(
      response.data.choices[0].message.content.trim(),
    );
    // console.warn('Parsed Data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error(
      'Error parsing email with OpenAI:',
      error.response?.data || error.message,
    );
    return null;
  }
};

const Home: React.FC = () => {
  const navigation = useNavigation();
  const pageSize = 50;
  const [parsedFlights, setParsedFlights] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  useEffect(() => {
    console.warn('OPENAI KEY', OPENAI_API_KEY);
  }, []);
  const fetchEmailIds = async (
    pageToken: string | null = null,
  ): Promise<void> => {
    if (loading || !hasMore) {
      return;
    }
    try {
      setLoading(true);
      const savedToken = await AsyncStorage.getItem('accessToken');
      if (!savedToken) {
        Alert.alert('Error', 'No saved token found. Please sign in.');
        return;
      }

      const emailListData = await fetchEmailList(
        savedToken,
        pageSize,
        pageToken,
      );
      const newEmailIds = emailListData.messages || [];
      setNextPageToken(emailListData.nextPageToken || null);
      setHasMore(!!emailListData.nextPageToken && newEmailIds.length > 0);

      const detailedEmails: Email[] = await Promise.all(
        newEmailIds.map(async ({id}: {id: string}) => {
          const data = await fetchEmailDetails(savedToken, id);
          const headers = data.payload?.headers || [];
          const subject =
            headers.find(
              (h: {name: string}) => h.name.toLowerCase() === 'subject',
            )?.value || 'No Subject';
          const bodyParts = data.payload?.parts || [];
          const body = bodyParts
            .map((part: any) => part.body?.data || '')
            .join('');
          const decodedBody = Buffer.from(body, 'base64').toString('utf-8');
          const email = {id: data.id, subject, body: decodedBody};
          return isFlightEmail(email.subject, email.body) ? email : null;
        }),
      );

      const filteredEmails = detailedEmails.filter(
        (email): email is Email => email !== null,
      );
      console.log('Filtered Emails:', filteredEmails);

      const parsedFlightsWithOpenAI = await Promise.all(
        filteredEmails.map(email => parseEmailWithOpenAI(email.body)),
      );

      setParsedFlights(prevFlights => [
        ...prevFlights,
        ...parsedFlightsWithOpenAI,
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = useCallback((): void => {
    if (!loading && hasMore) {
      fetchEmailIds(nextPageToken);
    }
  }, [loading, hasMore, nextPageToken]);

  const handleSignIn = async (): Promise<void> => {
    try {
      const savedToken = await AsyncStorage.getItem('accessToken');
      if (savedToken) {
        Alert.alert('Info', 'You are already signed in.');
        return;
      }
      const userInfo = await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('accessToken', accessToken);
      Alert.alert('Success', `Welcome, ${userInfo.data?.user.name}!`);
      setIsSignedIn(true);
      fetchEmailIds();
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('accessToken');
      Alert.alert('Signed Out', 'You have been signed out successfully.');
      setParsedFlights([]);
      setNextPageToken(null);
      setHasMore(true);
      setIsSignedIn(false);
    } catch (error: any) {
      Alert.alert('Sign-Out Error', error.message);
    }
  };

  const checkSavedToken = useCallback(async (): Promise<void> => {
    try {
      const savedToken = await AsyncStorage.getItem('accessToken');
      if (savedToken) {
        setIsSignedIn(true);
        fetchEmailIds();
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to retrieve saved token.');
    }
  }, []);

  useEffect(() => {
    checkSavedToken();
  }, [checkSavedToken]);

  const renderItem: ListRenderItem<any> = ({item}) => {
    if (!item) {
      return null;
    }

    return (
      <FlightCard
        airlineName={item.airline_name || ''}
        departureTime={
          new Date(item.departure_time).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
          }) || ''
        }
        departureFrom={`${item.departure_location} (${item.departure_airport_code})`}
        arrivalTime={
          new Date(item.arrival_time).toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
          }) || ''
        }
        arrivalFrom={`${item.arrival_location} (${item.arrival_airport_code})`}
        pnr={item.pnr || ''}
        bookingDate={item.booking_date || ''}
        additionalNotes={item.additional_notes || ''}
        onPress={() =>
          navigation.navigate('FlightDetail', {
            flight: {
              departure: {
                iata: item.departure_airport_code,
                airport: item.departure_location,
                scheduled: item.departure_time,
                actual: item.departure_time,
                estimated: item.departure_time,
                terminal: 'N/A', // Placeholder if terminal info is unavailable
                gate: 'N/A', // Placeholder if gate info is unavailable
              },
              arrival: {
                iata: item.arrival_airport_code,
                airport: item.arrival_location,
                scheduled: item.arrival_time,
                actual: item.arrival_time,
                estimated: item.arrival_time,
                terminal: 'N/A', // Placeholder if terminal info is unavailable
                gate: 'N/A', // Placeholder if gate info is unavailable
                baggage: 'N/A', // Placeholder if baggage info is unavailable
              },
              airline: {
                name: item.airline_name,
                iata: 'N/A', // Placeholder if IATA code is unavailable
              },
              flight: {
                iata: item.flight_number,
              },
              aircraft: {
                iata: 'N/A', // Placeholder if aircraft info is unavailable
                registration: 'N/A', // Placeholder if registration info is unavailable
              },
              flight_status: 'N/A', // Placeholder if flight status is unavailable
              duration: item.duration,
              pnr: item.pnr,
              bookingDate: item.booking_date,
              additionalNotes: item.additional_notes,
            },
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {parsedFlights.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() =>
            navigation.navigate('ChatBot', {flights: parsedFlights})
          }>
          <Icon name="chat" size={24} color="#FFFF" />
        </TouchableOpacity>
      )}

      <Header title="Flights" />

      {parsedFlights.length > 0 ? (
        <FlatList
          style={{padding: 16}}
          data={parsedFlights}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{paddingBottom: 100}}
        />
      ) : (
        <Text style={styles.loadingText}>
          {loading ? 'Scanning emails...' : 'No flight-related emails found.'}
        </Text>
      )}

      <View style={styles.buttonWrapper}>
        {!isSignedIn && (
          <Button title="Sign In to Authorize" onPress={handleSignIn} />
        )}
        {isSignedIn && (
          <Button title="Sign Out" onPress={handleSignOut} color="red" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F7FF',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  buttonWrapper: {
    marginTop: 20,
  },
  emailItem: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    borderColor: '#D0D0D0',
    borderWidth: 1,
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2C3E50',
  },
  flightDetail: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 2,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  flightDetailContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    borderColor: '#D0D0D0',
    borderWidth: 1,
  },
  flightDetailText: {
    fontSize: 14,
    color: '#34495E',
    fontFamily: 'Courier',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    zIndex: 1,
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

export default Home;
