import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Landing({ navigation }) {
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser'); // Clear the stored current user session
            navigation.replace('Login'); // Use replace to clear navigation stack
        } catch (error) {
            Alert.alert("Logout Failed", "Could not log out. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserList')}>
                <Text style={styles.buttonText}>New Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
    }
});

export default Landing;
