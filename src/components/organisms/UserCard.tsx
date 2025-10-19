import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../../config';
import PlaceholderImage from '../../assets/samplefoto.jpg';

interface UserCardProps {
  card: {
    id: number;
    name: string;
    age?: number;
    profile_picture?: string;
  };
  handleLike: () => void;
  handleDislike: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ card, handleLike, handleDislike }) => {
  if (!card) {
    return null;
  }

  const imageUrl = card.profile_picture && card.profile_picture.startsWith('http') ? card.profile_picture : card.profile_picture ? `${API_URL.replace('/api', '')}${card.profile_picture}` : '';

  const renderContent = () => (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)']}
      style={styles.gradient}
    >
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.name}>{card.name}<Text style={styles.age}>{card.age ? `, ${card.age}` : ''}</Text></Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={handleDislike} style={[styles.button, styles.dislikeButton]}>
            <MaterialCommunityIcons name="close" size={28} color="#ff3b5f" />
          </Pressable>
          <Pressable onPress={handleLike} style={[styles.button, styles.likeButton]}>
            <MaterialCommunityIcons name="heart" size={28} color="#4de6a3" />
          </Pressable>
          <Pressable style={styles.infoIcon}>
            <Feather name="info" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.image}
          imageStyle={{ borderRadius: 20 }}
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <ImageBackground
          source={PlaceholderImage}
          style={styles.image}
          imageStyle={{ borderRadius: 20 }}
        >
          {renderContent()}
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height:'100%',
    alignSelf: 'center',
    marginTop:'-15%',
    marginBottom:'-15%',
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  image: {
    width: 'auto',
    height: '96%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // overflow: 'hidden',
  },
  gradient: {
    width: '97%',
    height:'auto',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 40,
    // marginHorizontal:0,
    paddingBlockEnd:50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  age: {
    fontSize: 26,
    fontWeight: '300',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  likeButton: {},
  dislikeButton: {},
  infoIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default UserCard;