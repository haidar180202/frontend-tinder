import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, ScrollView, Keyboard, Animated, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '../services/api';
import TinderLogo from '../assets/tinderlogo.svg';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

const { height } = Dimensions.get('window');
const shiftValue = height * 0.05;

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        Animated.timing(shift, {
          toValue: -shiftValue,
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      await registerUser({ name, email, password });
      Alert.alert('Success', 'Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      Alert.alert('Registration Failed', errorMessage);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#FFF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
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
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF006F',
  },
  loginText: {
    color: '#FFF',
    marginTop: 20,
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;