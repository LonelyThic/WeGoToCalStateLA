import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useThreads } from "./threadStore";
import { Colors } from "../../constant/Colors";

export default function Composer() {
  const { actions } = useThreads();
  const router = useRouter();

  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  async function pickFrom(kind) {
    try {
      if (kind === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Camera access is required.");
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Photo library access is required.");
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Unable to open picker.");
    }
  }

  async function submit() {
    if (!imageUri && !caption.trim()) {
      Alert.alert("Add something", "Please add a photo or a caption.");
      return;
    }

    await actions.addThread({
      caption,
      imageUri,
      date,
      time,
      location,
      createdAt: Date.now(),
    });

    setImageUri(null);
    setCaption("");
    setDate("");
    setTime("");
    setLocation("");

    router.replace("/threads/feed");
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        maxWidth: 760,
        alignSelf: "center",
        width: "100%",
      }}
    >
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.replace("/threads/feed")}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Share an Event</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.card}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: Colors.TEXT_MUTED }}>No image selected</Text>
          </View>
        )}

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.PRIMARY }]}
            onPress={() => pickFrom("library")}
          >
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.SECONDARY }]}
            onPress={() => pickFrom("camera")}
          >
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Caption..."
          placeholderTextColor={Colors.TEXT_MUTED}
          value={caption}
          onChangeText={setCaption}
          style={styles.inputMultiline}
          multiline
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Date (e.g., 2025-11-14)"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={date}
            onChangeText={setDate}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="Time (e.g., 7:30 PM)"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={time}
            onChangeText={setTime}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Location (optional)"
          placeholderTextColor={Colors.TEXT_MUTED}
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <TouchableOpacity style={styles.postButton} onPress={submit}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  title: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 14,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
  },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontWeight: "600",
  },
  inputMultiline: {
    marginTop: 12,
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    minHeight: 80,
    textAlignVertical: "top",
  },
  input: {
    marginTop: 10,
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  postButton: {
    marginTop: 16,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  postButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
});
