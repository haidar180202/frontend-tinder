import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, ScrollView, Keyboard, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TinderLogo from '../assets/tinderlogo.svg';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        Animated.timing(shift, {
          toValue: -3,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(shift, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [shift]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await loginUser({ email, password });
      await AsyncStorage.setItem('userToken', response.access_token);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <LinearGradient colors={['#FF006F', '#FF8E53']} style={styles.container}>
      <Animated.View style={[styles.keyboardView, { transform: [{ translateY: shift }] }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <TinderLogo width={100} height={100} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#FFF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#FFF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerLink}>Register</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#FFF',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF006F',
  },
  registerText: {
    color: '#FFF',
    marginTop: 20,
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;