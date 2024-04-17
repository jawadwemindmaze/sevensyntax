import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Seven Syntax Chat</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
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
        backgroundColor: '#f4f4f4' // Soft gray background color for a light theme
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#2a2a2a' // Dark gray for better readability
    },
    button: {
        backgroundColor: '#007bff', // Primary color for the buttons
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        width: '70%', // Set a width to keep buttons consistent
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    }
});

export default Home;
