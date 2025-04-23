import {useState} from 'react';
import axios from 'axios';

export const useChatbot = (flights: any[]) => {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    {role: 'assistant', content: 'Hi! Ask me about your flights. ✈️'},
  ]);
  const [loading, setLoading] = useState(false);

  const predefinedQuestions = [
    'What is my next flight?',
    'Can you provide details about my flight?',
    'What is the departure time for my flight?',
    'What is the arrival time for my flight?',
    'Are there any delays in my flight schedule?',
  ];

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage = {role: 'user', content: input};
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const flightContext = flights.map(flight => ({
        pnr: flight.pnr || 'N/A',
        airline: flight.airline_name || 'N/A',
        departure: `${flight.departure_location || 'N/A'} (${
          flight.departure_airport_code || 'N/A'
        }) at ${flight.departure_time || 'N/A'}`,
        arrival: `${flight.arrival_location || 'N/A'} (${
          flight.arrival_airport_code || 'N/A'
        }) at ${flight.arrival_time || 'N/A'}`,
        duration: flight.duration || 'N/A',
        bookingDate: flight.booking_date || 'N/A',
      }));

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant with access to flight details.',
            },
            {
              role: 'system',
              content: `Flight details: ${JSON.stringify(flightContext)}`,
            },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      const botReply = response.data.choices?.[0]?.message;
      if (botReply && botReply.role && botReply.content) {
        setMessages(prev => [...prev, botReply]);
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage =
        error.response?.data?.error?.message ||
        'Sorry, I couldn’t get a response. Please try again shortly.';
      setMessages(prev => [...prev, {role: 'bot', content: errorMessage}]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    predefinedQuestions,
    sendMessage,
    setMessages,
  };
};
