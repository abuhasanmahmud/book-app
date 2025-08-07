import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../assets/styles/create.style";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore"; // Assuming you have an auth store for token management

export default function Create() {
  const { token } = useAuthStore();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [rating, setRating] = useState(2);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera roll permissions are required."
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });

      if (!image.canceled) {
        const selected = image.assets[0];
        const base64WithPrefix = `data:image/jpeg;base64,${selected.base64}`;
        setImageBase64(base64WithPrefix);
        setImageUri(selected.uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64) {
      Alert.alert(
        "Missing Fields",
        "Please fill all fields and select an image."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating,
          image: imageBase64,
        }),
      });

      const contentType = response.headers.get("content-type");
      const text = await response.text(); // read as raw text

      // console.log("Raw response text:", text);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(text); // safely parse after check
        // console.log("Parsed JSON:", data);
        Alert.alert("Success", "Book submitted successfully!");

        // Reset form
        setTitle("");
        setCaption("");
        setRating(3);
        setImageBase64(null);
        setImageUri(null);
        router.push({ pathname: "/", params: { refresh: true } });
      } else {
        throw new Error("Unexpected response content type. Not JSON.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.scrollViewStyle}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Post</Text>
            <Text style={styles.subtitle}>Fill the form to submit a post</Text>
          </View>

          <View style={styles.form}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter title"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write something..."
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={styles.starButton}
                    onPress={() => handleRatingPress(val)}
                  >
                    <Ionicons
                      name={val <= rating ? "star" : "star-outline"}
                      size={28}
                      color={val <= rating ? "#FFD700" : "#ccc"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Image Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color="#999" />
                    <Text style={styles.placeholderText}>
                      Tap to pick image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
