import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export interface Profile {
  name: string;
  age: number;
  location: string;
  profile_picture_url?: string;
  bio: string;
  birth_date: string;
}

interface UserCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onSwipeRight();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onSwipeLeft();
    });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate },
          ],
        },
      ]}
    >
      <Image source={{ uri: profile.profile_picture_url || 'https://via.placeholder.com/500' }} style={styles.cardImage} />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.gradientTop}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
        <Text style={styles.likeLabelText}>LIKE</Text>
      </Animated.View>

      <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
        <Text style={styles.nopeLabelText}>NOPE</Text>
      </Animated.View>

      <View style={styles.cardInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.age}> {profile.age}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color="#fff" />
          <Text style={styles.distance}>{profile.location}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width,
    height: height * 0.75,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: -50,
    left: '2%',
    right: '2%',
    width: '96%',
    height: '30%',
    borderRadius: 15,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '90%',
    borderRadius: 10,
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 30,
    borderWidth: 4,
    borderColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    transform: [{ rotate: '20deg' }],
  },
  likeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 30,
    borderWidth: 4,
    borderColor: '#FF6B6B',
    borderRadius: 10,
    padding: 10,
    transform: [{ rotate: '-20deg' }],
  },
  nopeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  age: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
});

export default UserCard;