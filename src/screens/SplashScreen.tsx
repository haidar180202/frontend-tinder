import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import TinderLogo from '../assets/tinderlogo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '../types';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const infoFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
    };

    checkLoginStatus();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(infoFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300, // Slight delay before info text appears
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(buttonFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlideAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [logoFadeAnim, logoScaleAnim, textFadeAnim, infoFadeAnim, buttonFadeAnim, buttonSlideAnim]);

  const onStart = () => {
    navigation.navigate(isLoggedIn ? 'Main' : 'Login');
  };

  return (
    <LinearGradient
      colors={['#FF7043', '#FF4081']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Animated.View style={{ opacity: logoFadeAnim, transform: [{ scale: logoScaleAnim }] }}>
          <TinderLogo width={60} height={60} />
        </Animated.View>
        <Animated.View style={{ opacity: textFadeAnim }}>
          <Text style={styles.title}>Tinder</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.infoContainer, { opacity: infoFadeAnim }]}>
        <Text style={styles.infoText}>
          By tapping Start, you agree to our <Text style={styles.linkText}>Terms</Text>.
          Learn how we process your data in our <Text style={styles.linkText}>Privacy Policy</Text> and <Text style={styles.linkText}>Cookies Policy</Text>.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: buttonFadeAnim, transform: [{ translateY: buttonSlideAnim }] }]}>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5, // Further reduced margin
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 150,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#FF4081',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;