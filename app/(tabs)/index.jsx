import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import styles from "../../assets/styles/home.style"; // ✅ Import shared styles

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/books?page=1&limit=5"
      );
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (books.length === 0) {
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
          {/* Optional: user avatar or username can go here */}
          <View style={styles.bookImageContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Text>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            {/* Optional: createdAt or username */}
          </View>
        </View>
      )}
    />
  );
}
