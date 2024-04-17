import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

function UserList({ navigation }) {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);


    // Function to create a new channel
    const createChannel = async (user1Id, user2Id) => {
        const newChannelId = uuidv4();
        const channelData = {
            channelId: newChannelId,
            userIds: [user1Id, user2Id],
        };
        await AsyncStorage.setItem(`channel_${newChannelId}`, JSON.stringify(channelData));
        return newChannelId;
    };

    // Function to find an existing channel between two users
    const findChannel = async (user1Id, user2Id) => {
        let allKeys = await AsyncStorage.getAllKeys();
        let channelKeys = allKeys.filter(key => key.startsWith('channel_'));

        for (let key of channelKeys) {
            let channelDataString = await AsyncStorage.getItem(key);
            let channelData = JSON.parse(channelDataString);
            if (channelData.userIds.includes(user1Id) && channelData.userIds.includes(user2Id)) {
                return channelData.channelId;
            }
        }
        return null;
    };


    useEffect(() => {
        fetchUsers();
        fetchCurrentUserId();
    }, [currentUserId]);

    const fetchCurrentUserId = async () => {
        try {
            const userData = await AsyncStorage.getItem('currentUser');
            const user = JSON.parse(userData);
            setCurrentUserId(user.userId);
        } catch (error) {
            Alert.alert("Error", "Failed to retrieve current user data.");
        }
    };

    const fetchUsers = async () => {
        let allKeys = await AsyncStorage.getAllKeys();
        let userKeys = allKeys.filter(key => key.startsWith('userProfile_'));
        let retrievedUsers = [];
        for (let key of userKeys) {
            if (key !== currentUserId) {
                let userData = await AsyncStorage.getItem(key);
                userData = JSON.parse(userData);
                retrievedUsers.push({ id: key, ...userData });
            }
        }
        setUsers(retrievedUsers);
    };


    const handleSelectUser = async (otherUserId) => {
        if (!currentUserId) {
            Alert.alert("Error", "Current user not found. Please log in again.");
            return;
        }

        let channelId = await findChannel(currentUserId, otherUserId);
        if (!channelId) {
            channelId = await createChannel(currentUserId, otherUserId);
        }

        if (channelId) {
            navigation.navigate('Chat', { userId: currentUserId, otherUserId, channelId });
        } else {
            Alert.alert("Error", "Unable to create or find a chat channel.");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleSelectUser(item.id)}
        >
            <Text style={styles.userName}>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    userItem: {
        padding: 15,
        backgroundColor: '#ffffff', // White background for a clean look
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1', // Softer color for the separator
        marginHorizontal: 10, // Horizontal margin for better side spacing
        marginTop: 10, // Spacing between items
        borderRadius: 5, // Rounded corners for a card-like look
        shadowColor: "#000", // Shadow for depth
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Elevation for Android (shadow equivalent)
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold', // Making the font bold for better readability
        color: '#333333' // Darker text for contrast against white background
    },
});

export default UserList;
