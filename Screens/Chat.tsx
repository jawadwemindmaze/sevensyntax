import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

function Chat({ route, navigation }) {
    const { channelId, userId, otherUserId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
            socket.emit('joinRoom', channelId);
        });

        socket.on('receiveMessage', (msg) => {
            if (msg.channelId === channelId) {
                if (userId !== msg.senderId) {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
            }
        });
    }, [socket, channelId]);

    const loadMessages = async () => {
        const storedMessages = await AsyncStorage.getItem(`messages_${channelId}`);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    };

    const sendMessage = async () => {
        const newMessage = {
            id: uuidv4(),
            channelId,
            senderId: userId,
            message,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, newMessage];
        await AsyncStorage.setItem(`messages_${channelId}`, JSON.stringify(updatedMessages));
        socket.emit('sendMessage', newMessage);
        setMessages(updatedMessages);
        setMessage('');
    };

    const deleteMessage = async (id) => {
        const filteredMessages = messages.filter(msg => msg.id !== id);
        await AsyncStorage.setItem(`messages_${channelId}`, JSON.stringify(filteredMessages));
        setMessages(filteredMessages);
    };

    const handleLongPress = (id) => {
        Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteMessage(id), style: 'destructive' },
            ],
            { cancelable: true }
        );
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.messageContainer, item.senderId === userId ? styles.sender : styles.receiver]}
                        onLongPress={() => handleLongPress(item.id)}>
                        <Text>{item.message}</Text>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    style={styles.input}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light grey background
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#ffffff', // White background for input area
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 40, // Fixed height for the input
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20, // Rounded borders for the input
        paddingHorizontal: 15,
        backgroundColor: '#ffffff', // White background for the text input
        marginRight: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#007AFF', // iOS blue for the button
        borderRadius: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    messageContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginVertical: 4,
        maxWidth: '80%',
        elevation: 1, // Slight elevation for message bubbles
    },
    sender: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6', // Soft green for messages from the user
        marginRight: 10,
    },
    receiver: {
        alignSelf: 'flex-start',
        backgroundColor: '#e6e6eb', // Soft grey for messages from others
        marginLeft: 10,
    },
    messageText: {
        fontSize: 16,
    }
});

export default Chat;
