import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function HomeScreen({ navigation, route }) {
  const [songsByGenre, setSongsByGenre] = useState([]);
  const [songsByArtist, setSongsByArtist] = useState([]);
  const [messageGenre, setMessageGenre] = useState('');
  const [messageArtist, setMessageArtist] = useState('');
  const { user } = route.params;

  useEffect(() => {
    fetchSongsByGenre();
    fetchSongsByArtist();
  }, []);

  const fetchSongsByGenre = async () => {
    try {
      const response = await fetch(`http://10.125.217.144:3000/songs/random`);
      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Error', data.message || 'Error al obtener canciones por género');
      }

      setSongsByGenre(data);
      setMessageGenre(`🎶 Canciones de un género aleatorio.`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  const fetchSongsByArtist = async () => {
    try {
      const response = await fetch(`http://10.125.217.144:3000/songs/random-artist`);
      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Error', data.message || 'Error al obtener canciones por artista');
      }

      setSongsByArtist(data);
      setMessageArtist(`🎙️ Canciones de un artista aleatorio.`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        onPress: () => navigation.replace('Login'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('BuscarCanciones', { user })}
      >
        <Text style={styles.searchText}>🔍 Buscar Canciones</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🎧 Recomendaciones Musicales</Text>

      {messageGenre ? <Text style={styles.message}>{messageGenre}</Text> : null}
      <ScrollView horizontal style={styles.scrollRow} showsHorizontalScrollIndicator={false}>
        {songsByGenre.map((song) => (
          <View key={`genre-${song.id}`} style={styles.songCard}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songInfo}>🎤 {song.artist}</Text>
            <Text style={styles.songInfo}>🎧 Género: {song.genre || 'N/A'}</Text>
            <Text style={styles.songInfo}>⏱️ Duración: {song.duration}s</Text>
            {song.uploaded_by_name && (
              <Text style={styles.songInfo}>📤 Subida por: {song.uploaded_by_name}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {messageArtist ? <Text style={styles.message}>{messageArtist}</Text> : null}
      <ScrollView horizontal style={styles.scrollRow} showsHorizontalScrollIndicator={false}>
        {songsByArtist.map((song) => (
          <View key={`artist-${song.id}`} style={styles.songCard}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songInfo}>🎤 {song.artist}</Text>
            <Text style={styles.songInfo}>🎧 Género: {song.genre || 'N/A'}</Text>
            <Text style={styles.songInfo}>⏱️ Duración: {song.duration}s</Text>
            {song.uploaded_by_name && (
              <Text style={styles.songInfo}>📤 Subida por: {song.uploaded_by_name}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#ff5c5c',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    color: '#555',
    marginBottom: 8,
    marginTop: 12,
  },
  searchButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#4caf50',
    borderRadius: 8,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollRow: {
    flexGrow: 0,
    marginBottom: 10,
  },
  songCard: {
    width: 220,
    backgroundColor: '#fff',
    padding: 14,
    marginRight: 12,
    borderRadius: 10,
    elevation: 2,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songInfo: {
    fontSize: 13,
    color: '#555',
  },
});
