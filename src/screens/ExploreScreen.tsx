import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, FlatList, Image, ScrollView } from 'react-native';
import { getRecommendedUsers, getMyDataByCategory, userAction } from '../services/api';
import UserCard from '../components/organisms/UserCard';
import { User } from '../types/User';

const SimpleUserCard = ({ user }: { user: User }) => (
  <View style={styles.simpleCardContainer}>
    <Image source={{ uri: user.profile.profile_picture_url || 'https://via.placeholder.com/150' }} style={styles.simpleCardImage} />
    <View style={styles.simpleCardInfo}>
      <Text style={styles.simpleCardName}>{user.profile.name}</Text>
      <Text style={styles.simpleCardLocation}>{user.profile.location}</Text>
    </View>
  </View>
);

const ExploreScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('recommended');
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setCurrentIndex(0); // Reset index when category changes
    try {
      let responseData;
      if (category === 'recommended') {
        responseData = await getRecommendedUsers();
        setUsers(responseData);
      } else {
        responseData = await getMyDataByCategory(category as any);
        const extractedUsers = responseData.map((item: any) => {
          if (item.disliked_user) return item.disliked_user;
          if (item.liked_user) return item.liked_user;
          if (item.user) return item.user; // For 'liked_me' category
          return item; // Fallback for recommended or other structures
        });
        setUsers(extractedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (userId: number, action: 'like' | 'dislike') => {
    try {
      await userAction(userId, action);
      // No need to filter, just move to the next card
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const renderNoMoreCards = () => (
    <View style={styles.noMoreCardsContainer}>
      <Text style={styles.noMoreCardsText}>No more users in this category.</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={styles.loader} />;
    }

    if (users.length === 0) {
      return renderNoMoreCards();
    }

    if (category === 'recommended') {
      return (
        <View style={styles.cardContainer}>
          {users.slice(currentIndex, currentIndex + 2).reverse().map((user) => (
            <UserCard
              key={user.id}
              profile={user.profile}
              onSwipeLeft={() => handleAction(user.id, 'dislike')}
              onSwipeRight={() => handleAction(user.id, 'like')}
            />
          ))}
        </View>
      );
    }

    return (
      <FlatList
        data={users}
        renderItem={({ item }) => <SimpleUserCard user={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity onPress={() => setCategory('recommended')} style={[styles.filterButton, category === 'recommended' && styles.activeFilter]}>
            <Text style={[styles.filterText, category === 'recommended' && styles.activeFilterText]}>Recommended</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('liked')} style={[styles.filterButton, category === 'liked' && styles.activeFilter]}>
            <Text style={[styles.filterText, category === 'liked' && styles.activeFilterText]}>Liked</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('disliked')} style={[styles.filterButton, category === 'disliked' && styles.activeFilter]}>
            <Text style={[styles.filterText, category === 'disliked' && styles.activeFilterText]}>Disliked</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCategory('liked_me')} style={[styles.filterButton, category === 'liked_me' && styles.activeFilter]}>
            <Text style={[styles.filterText, category === 'liked_me' && styles.activeFilterText]}>Liked You</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainerWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50, // Adjust to position cards nicely
  },
  noMoreCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  listContainer: {
    padding: 10,
  },
  simpleCardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  simpleCardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  simpleCardInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  simpleCardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  simpleCardLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default ExploreScreen;