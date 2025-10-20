import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, uploadAdditionalPicture, deletePicture } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp } from '../types';
import { AuthContext } from '../store/AuthContext';
import { ASSET_URL } from "../config";

const getFullImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http')) return url;
  return `${ASSET_URL}${url}`;
};

const CreateProfileScreen = () => {
  const { setUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
  });
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(null);
  const [additionalImages, setAdditionalImages] = useState<any[]>([]);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        name: profileData.profile.name || '',
        bio: profileData.profile.bio || '',
        location: profileData.profile.location || '',
      });
      if (profileData.profile.birth_date) {
        setBirthDate(new Date(profileData.profile.birth_date));
      }
      if (profileData.profile.profile_picture_url) {
        setProfileImage({ uri: profileData.profile.profile_picture_url });
      }
      if (profileData.pictures) {
        setAdditionalImages(profileData.pictures);
      }
    }
  }, [profileData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: { profile: any }) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser(prev => prev ? { ...prev, profile: data.profile } : null);
      navigation.goBack();
    },
  });

  const uploadAdditionalPictureMutation = useMutation({
    mutationFn: uploadAdditionalPicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const deletePictureMutation = useMutation({
    mutationFn: deletePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleChooseProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const handleAddAdditionalImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadAdditionalPictureMutation.mutate(result.assets[0].uri);
    }
  };

  const handleDeleteAdditionalImage = (pictureId: number) => {
    deletePictureMutation.mutate(pictureId);
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = async () => {
    const age = calculateAge(birthDate);
    const profileDataToSave: any = {
      ...formData,
      birth_date: birthDate.toISOString().split('T')[0],
      age: age,
    };

    if (profileImage?.uri) {
      profileDataToSave.picture = profileImage.uri;
    }

    updateProfileMutation.mutate(profileDataToSave);
  };

  if (isProfileLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const buttonText = profileData?.profile ? 'Update Profile' : 'Add Profile';

  return (
    <LinearGradient colors={['#FF4081', '#FF79B0']} style={styles.container}>
      <ScrollView>
        <View style={styles.profilePictureContainer}>
          <Image source={{ uri: getFullImageUrl(profileImage?.uri) }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editImageIcon} onPress={handleChooseProfileImage}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.additionalImagesContainer}>
          <Text style={styles.sectionTitle}>Additional Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
            {additionalImages.map((img, index) => (
              <View key={index} style={styles.additionalImageContainer}>
                <Image source={{ uri: getFullImageUrl(img.picture_url) }} style={styles.additionalImage} />
                <TouchableOpacity style={styles.deleteImageIcon} onPress={() => handleDeleteAdditionalImage(img.id)} disabled={deletePictureMutation.isPending}>
                  {deletePictureMutation.isPending && deletePictureMutation.variables === img.id ? (
                    <ActivityIndicator size="small" color="#FF4081" />
                  ) : (
                    <Ionicons name="close-circle" size={24} color="#FF4081" />
                  )}
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddAdditionalImage} disabled={uploadAdditionalPictureMutation.isPending}>
              {uploadAdditionalPictureMutation.isPending ? (
                <ActivityIndicator size="small" color="#FF4081" />
              ) : (
                <Ionicons name="add" size={30} color="#FF4081" />
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#FF4081" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="Name"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#FF4081" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.bio}
              onChangeText={value => handleInputChange('bio', value)}
              placeholder="Bio"
              placeholderTextColor="#ccc"
              multiline
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#FF4081" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={value => handleInputChange('location', value)}
              placeholder="Location"
              placeholderTextColor="#ccc"
            />
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Ionicons name="calendar-outline" size={20} color="white" style={styles.inputIcon} />
            <Text style={styles.datePickerButtonText}>Pilih Tanggal Lahir</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Text style={styles.dateText}>Tanggal Lahir: {birthDate.toDateString()}</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>{buttonText}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF4081',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editImageIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#FF4081',
    borderRadius: 20,
    padding: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4081',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 20,
    color: 'white',
  },
  additionalImagesContainer: {
    marginBottom: 20,
  },
  additionalImageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteImageIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

export default CreateProfileScreen;