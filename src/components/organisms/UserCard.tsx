import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Ini adalah tipe data sementara, kita akan sesuaikan dengan data dari API nanti
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
      <Image source={{ uri: card.profile_picture }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{card.name}, {card.age}</Text>
      </View>
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default UserCard;