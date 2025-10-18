import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UserCardProps {
  card: {
    id: number;
    name: string;
    age: number;
    profile_picture: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ card }) => {
  if (!card) {
    return null;
  }

  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: card.profile_picture }} style={styles.image} imageStyle={{ borderRadius: 15 }}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name}>{card.name}, {card.age}</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.8,
    borderRadius: 15,
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserCard;