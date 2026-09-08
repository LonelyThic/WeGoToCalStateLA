import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, ArrowLeft, Camera, Images, MapPin, Calendar, Clock } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { createEvent } from '../../services/events';

export default function CreateEventScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  async function pickFrom(kind) {
    try {
      if (kind === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library access is required.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      }
    } catch (_e) {
      Alert.alert('Error', 'Unable to open picker.');
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter an event title.');
      return;
    }
    if (!date.trim() || !time.trim()) {
      Alert.alert('Missing info', 'Please enter a date and time.');
      return;
    }
    setLoading(true);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        imageUri,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        createdAt: Date.now(),
      });
      router.replace('/home_screen/events');
    } catch (_e) {
      Alert.alert('Error', 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.PRIMARY, Colors.DARK_BLUE]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.replace('/home_screen/events')} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.SECONDARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

          <TouchableOpacity style={styles.imagePlaceholder} onPress={() => pickFrom('library')} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.coverImage} />
            ) : (
              <View style={styles.imagePlaceholderInner}>
                <ImageIcon size={40} color={Colors.GRAY} />
                <Text style={styles.imagePlaceholderText}>Add a cover image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.pickerButton, styles.galleryButton]} onPress={() => pickFrom('library')}>
              <Images size={18} color={Colors.SECONDARY} />
              <Text style={styles.pickerButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pickerButton, styles.cameraButton]} onPress={() => pickFrom('camera')}>
              <Camera size={18} color={Colors.SECONDARY} />
              <Text style={styles.pickerButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="What's this event about?"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.iconInput}>
                <Calendar size={16} color={Colors.TEXT_MUTED} style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInputField}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={Colors.TEXT_MUTED}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.iconInput}>
                <Clock size={16} color={Colors.TEXT_MUTED} style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInputField}
                  placeholder="e.g. 3:00 PM"
                  placeholderTextColor={Colors.TEXT_MUTED}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Location</Text>
          <View style={styles.iconInput}>
            <MapPin size={16} color={Colors.TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.iconInputField}
              placeholder="Enter location"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Event'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imagePlaceholderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    color: Colors.GRAY,
    fontSize: 14,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    marginBottom: 16,
  },
  galleryButton: {
    backgroundColor: Colors.PRIMARY,
  },
  cameraButton: {
    backgroundColor: Colors.WARNING,
  },
  pickerButtonText: {
    color: Colors.SECONDARY,
    fontWeight: '700',
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.TEXT,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  iconInputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.TEXT,
  },
  submitButton: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
});
