import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp, User, UserPicture } from "../types";
import { ASSET_URL } from "../config";

const getFullImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http')) return url;
  return `${ASSET_URL}${url}`;
};

const ImageWithLoader = ({ style, source }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { borderRadius } = StyleSheet.flatten(style);

  return (
    <View style={style}>
      <Image
        style={{ width: "100%", height: "100%", borderRadius }}
        source={source}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.1)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius,
            },
          ]}
        >
          <ActivityIndicator color="white" />
        </View>
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const allPictures = React.useMemo(() => {
    const pictures = [];
    if (user?.profile?.profile_picture_url) {
      pictures.push({
        id: "profile",
        picture_url: user.profile.profile_picture_url,
      });
    }
    if (user?.pictures) {
      pictures.push(...user.pictures);
    }
    return pictures;
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("Login");
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.container} />;
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error fetching profile</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FF4081", "#FF79B0"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {user?.profile ? (
          <>
            <View style={styles.header}>
              <ImageWithLoader
                style={styles.profileImage}
                source={{
                  uri: getFullImageUrl(
                    user?.profile?.profile_picture_url
                  ),
                }}
              />
              <Text style={styles.name}>
                {user?.name && user.name.length > 18
                  ? `${user.name.substring(0, 18)}...`
                  : user?.name}
              </Text>
              <Text style={styles.age}>{user?.profile?.age} years old</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={18} color="white" />
                <Text style={styles.location}>{user.profile.location}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>About Me</Text>
              <Text style={styles.bio}>{user.profile.bio}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>My Photos</Text>
              <FlatList
                data={allPictures}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ImageWithLoader
                    source={{
                      uri: getFullImageUrl(item.picture_url),
                    }}
                    style={styles.picture}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.noPhotosText}>No photos to display.</Text>
                }
              />
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("CreateProfile", { isEdit: true, user })
              }
            >
              <Text style={styles.editButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noProfileContainer}>
            <Text style={styles.noProfileText}>
              You haven’t created a profile yet.
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("CreateProfile", { isEdit: true })
              }
            >
              <Text style={styles.editButtonText}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "white",
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  age: {
    fontSize: 19,
    color: "white",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "700",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  location: {
    fontSize: 16,
    color: "white",
    marginLeft: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  picturesContainer: {
    // This style is no longer used by FlatList, can be removed or left empty
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  noPhotosText: {
    textAlign: "center",
    width: "100%",
    color: "#666",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#FF4081",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noProfileText: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
});

export default ProfileScreen;