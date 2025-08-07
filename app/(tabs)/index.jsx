import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import styles from "../../assets/styles/home.style";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import { useLocalSearchParams } from "expo-router";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const params = useLocalSearchParams();

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books?page=1&limit=5`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 Add token here
        },
      });

      const data = await response.json();

      console.log("Fetched data:", data);

      // Ensure data.books is an array, else fallback to empty array
      setBooks(Array.isArray(data.books) ? data.books : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]); // fallback empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [params.refresh]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!books || books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books found</Text>
        <Text style={styles.emptySubtext}>
          Once books are created, they will appear here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.bookCard}>
          <View style={styles.bookImageContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Text>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        </View>
      )}
    />
  );
}
