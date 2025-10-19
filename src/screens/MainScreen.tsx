import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swiper from 'react-native-deck-swiper';
import { getRecommendedUsers, likeUser, dislikeUser, User } from '../services/api';
import UserCard from '../components/organisms/UserCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MainScreen = () => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const swiperRef = React.useRef<Swiper<User>>(null);

  const handleLike = () => {
    swiperRef.current?.swipeRight();
  };

  const handleDislike = () => {
    swiperRef.current?.swipeLeft();
  };

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const { data: users, isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUsers,
    enabled: !!token,
  });

  const likeMutation = useMutation({
    mutationFn: likeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: dislikeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
  });

  const handleSwipeRight = (cardIndex: number) => {
    if (users) {
      const user = users[cardIndex];
      likeMutation.mutate(user.id);
    }
  };

  const handleSwipeLeft = (cardIndex: number) => {
    if (users) {
      const user = users[cardIndex];
      dislikeMutation.mutate(user.id);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profiles...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error fetching users: {error?.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        {users && users.length > 0 ? (
          <View style={styles.swiperContainer}>
            <Swiper
              ref={swiperRef}
              cards={users}
              renderCard={(card: User) => (
                <UserCard
                  card={{
                    id: card.id,
                    name: card.name,
                    age: card?.profile?.age,
                    profile_picture: card.pictures.length > 0 ? card.pictures[0].url : ''
                  }}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                />
              )}
              onSwipedLeft={handleSwipeLeft}
              onSwipedRight={handleSwipeRight}
              cardIndex={0}
              stackSize={3}
              stackSeparation={15}
              animateOverlayLabelsOpacity
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: { backgroundColor: 'red', color: 'white', fontSize: 24 },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginLeft: -20 }
                  }
                },
                right: {
                  title: 'LIKE',
                  style: {
                    label: { backgroundColor: 'green', color: 'white', fontSize: 24 },
                    wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 20 }
                  }
                }
              }}
            />

          </View>
        ) : (
          <View style={styles.centerContainer}>
            <Text>No more profiles to show.</Text>
          </View>
        )}
      </View>
      <ActionButtons onLike={handleLike} onDislike={handleDislike} />
    </View>
  );
};

const ActionButtons = ({ onLike, onDislike }: { onLike: () => void, onDislike: () => void }) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPress={onDislike}
        style={[styles.button, styles.dislikeButton]}
      >
        <MaterialCommunityIcons name="close" size={32} color="#6e767d" />
      </Pressable>

      <Pressable
        onPress={onLike}
        style={[styles.button, styles.likeButton]}
      >
        <MaterialCommunityIcons name="heart" size={32} color="#ff3b5f" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainer: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: 'white',
  },
  dislikeButton: {
    backgroundColor: 'white',
  },
});

export default MainScreen;