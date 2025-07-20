import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function UserMoviesScreen({ navigation, route }) {
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = route.params;

  useEffect(() => {
    const fetchUserMovies = async () => {
      try {
        const response = await fetch(`http://192.168.194.159:3000/comments/user/${user.id}`);
        const data = await response.json();
        setUserMovies(data || []);
      } catch (error) {
        console.error('Error al obtener películas del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMovies();
  }, [user.id]);

 const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.movieItem}
    onPress={() => navigation.navigate('ReviewMovies', { movie: item.movie, user })}
  >
    <View style={styles.row}>
      {item.movie.poster_url ? (
        <Image source={{ uri: item.movie.poster_url }} style={styles.poster} />
      ) : null}
      <View style={styles.info}>
        <Text style={styles.title}>{item.movie.titulo}</Text>
       <Text style={styles.date}>
  {item.movie.fecha_lanzamiento
    ? new Date(item.movie.fecha_lanzamiento).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Sin fecha'}
</Text>

        <Text style={styles.rating}>⭐ Calificación: {item.puntaje}/10</Text>
        {item.comentario ? (
          <Text style={styles.comment}>📝 {item.comentario}</Text>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tus Películas Calificadas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e50914" />
      ) : userMovies.length === 0 ? (
        <Text style={styles.noMovies}>Aún no calificaste ninguna película.</Text>
      ) : (
        <FlatList
          data={userMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  header: { color: '#fff', fontSize: 22, marginBottom: 15 },
  movieItem: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  comment: {
  color: '#ccc',
  fontStyle: 'italic',
  marginTop: 5,
  fontSize: 13,
},

  row: { flexDirection: 'row' },
  poster: { width: 80, height: 120, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'space-between' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  date: { color: '#bbb', fontSize: 14 },
  rating: { color: '#ffc107', fontSize: 14 },
  noMovies: { color: '#aaa', textAlign: 'center', marginTop: 30 },
});
