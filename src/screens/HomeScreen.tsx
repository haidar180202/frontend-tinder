import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import UserCard from '../components/organisms/UserCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendedUsers, userAction } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: profiles, isLoading, isError } = useQuery({
    queryKey: ['profiles'],
    queryFn: getRecommendedUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ userId, action }: { userId: number; action: 'like' | 'dislike' }) => 
      userAction(userId, action),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = () => {
    if (profiles && currentIndex < profiles.length) {
      mutation.mutate({ userId: profiles[currentIndex].id, action: 'like' });
      nextCard();
    }
  };

  const handleNope = () => {
    if (profiles && currentIndex < profiles.length) {
        mutation.mutate({ userId: profiles[currentIndex].id, action: 'dislike' });
        nextCard();
      }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (isError || !profiles) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.headerTitle}>Gagal memuat profil.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.endContainer}>
          <Text style={styles.headerTitle}>Tidak ada profil lagi</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)} // Sebaiknya refetch data di sini
          >
            <Text style={styles.resetButtonText}>Mulai Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Tinder</Text>
        <View style={styles.headerRight}>
          <Ionicons name="notifications" size={24} color="#333" style={styles.headerIcon} />
          <Ionicons name="wifi" size={24} color="#333" />
        </View>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {profiles.slice(currentIndex, currentIndex + 2).reverse().map((user, index) => {
            const profileForCard = user.profile ? {
                ...user.profile,
                profile_picture_url: user.profile.profile_picture_url || 'https://via.placeholder.com/500'
            } : {
                name: user.name,
                age: 0,
                location: 'Unknown',
                bio: '',
                birth_date: '',
                profile_picture_url: 'https://via.placeholder.com/500'
            };
            return (
                <UserCard
                    key={user.id}
                    profile={profileForCard}
                    onSwipeLeft={handleNope}
                    onSwipeRight={handleLike}
                />
            )
        })}
        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.undoButton]} onPress={handleUndo}>
            <Ionicons name="arrow-undo" size={28} color="#FFC629" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.nopeButton]} onPress={handleNope}>
            <Entypo name="cross" size={36} color="#FF6B6B" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.starButton]}>
            <Ionicons name="star" size={28} color="#4FC3F7" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={handleLike}>
            <Ionicons name="heart" size={32} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.boostButton]}>
            <Ionicons name="flash" size={28} color="#B565D8" />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 15,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20, // Menambah padding untuk menurunkan kartu
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  undoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nopeButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  starButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  boostButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  endContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});