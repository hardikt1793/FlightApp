import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useChatbot} from '@hooks/useChatbot';
import Header from '../component/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatBot = ({route}: {route: any}) => {
  const {flights} = route.params || {};
  const {messages, loading, predefinedQuestions, sendMessage} =
    useChatbot(flights);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handlePredefinedQuestion = (question: string) => {
    setInput(question);
    sendMessage(question);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Chat Bot" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}>
          {predefinedQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handlePredefinedQuestion(question)}>
              <Text style={styles.suggestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.messageContainer,
                item.role === 'user' ? styles.userMessage : styles.botMessage,
              ]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 20}}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask something..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={loading}
            style={[styles.sendButton, loading && {backgroundColor: '#ccc'}]}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  messageContainer: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  userMessage: {
    backgroundColor: '#FFE0B2',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#DFF6FF',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 30,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 25,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    maxHeight: 50,
    backgroundColor: '#E6F7FF',
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  suggestionsContent: {
    alignItems: 'center',
  },
  suggestionButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ChatBot;
