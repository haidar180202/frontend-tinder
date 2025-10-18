import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swiper from 'react-native-deck-swiper';
import { getRecommendedUsers, likeUser, dislikeUser, User } from '../../services/api';
import UserCard from '../../components/organisms/UserCard';

const MainScreen = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUsers,
  });

  const likeMutation = useMutation({
    mutationFn: likeUser,
    onSuccess: () => {
      // Invalidate and refetch to remove the liked user from the stack
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: dislikeUser,
    onSuccess: () => {
      // Invalidate and refetch to remove the disliked user from the stack
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
  });

  const handleSwipeRight = (cardIndex: number) => {
    if (users) {
      const user = users[cardIndex];
      console.log(`Liking ${user.name}`);
      likeMutation.mutate(user.id);
    }
  };

  const handleSwipeLeft = (cardIndex: number) => {
    if (users) {
      const user = users[cardIndex];
      console.log(`Disliking ${user.name}`);
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
      {users && users.length > 0 ? (
        <Swiper
          cards={users}
          renderCard={(card: User) => (
            <UserCard card={{
              id: card.id,
              name: card.name,
              age: card.profile.age,
              // Mengambil gambar pertama sebagai gambar profil utama
              profile_picture: card.pictures.length > 0 ? card.pictures[0].url : 'https://via.placeholder.com/300'
            }} />
          )}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          cardIndex={0}
          backgroundColor={'#f0f0f0'}
          stackSize={3}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: { backgroundColor: 'red', color: 'white', fontSize: 24 },
                wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: { backgroundColor: 'green', color: 'white', fontSize: 24 },
                wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 }
              }
            }
          }}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text>No more profiles to show.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;