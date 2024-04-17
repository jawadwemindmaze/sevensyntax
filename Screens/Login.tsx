import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            let isAuthenticated = false;
            let sessionUser = null;
            const allKeys = await AsyncStorage.getAllKeys();
            const userKeys = allKeys.filter(key => key.startsWith('userProfile_'));
            for (let key of userKeys) {
                const userDataString = await AsyncStorage.getItem(key);
                const userData = JSON.parse(userDataString);
                if (userData.email.toLowerCase() === email.toLowerCase() && userData.password === password) {
                    isAuthenticated = true;
                    sessionUser = { userId: key, username: userData.username, email: userData.email };
                    break;
                }
            }

            if (isAuthenticated) {
                await AsyncStorage.setItem('currentUser', JSON.stringify(sessionUser));
                Alert.alert('Login Successful', 'You are logged in!');
                navigation.navigate("Landing");
            } else {
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        } catch (error) {
            Alert.alert('Login Error', 'An error occurred during login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
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
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#2a2a2a',
    },
    input: {
        width: '80%',
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#007bff',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Login;
