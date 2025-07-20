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
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = route.params;

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('http://10.125.217.144:3000/songs');
      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Error', data.message || 'Error al obtener canciones');
      }

      setSongs(data);
      setMessage(`Se encontraron ${data.length} canciones.`);
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
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🎵 Canciones Disponibles</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <ScrollView style={{ marginTop: 10 }}>
        {songs.map((song) => (
          <View key={song.id} style={styles.songCard}>
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
    marginBottom: 10,
  },
  songCard: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songInfo: {
    fontSize: 14,
    color: '#555',
  },
});
