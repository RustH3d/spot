import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';

const JAMENDO_CLIENT_ID = '6679a78f';

export default function BuscarCancionesScreen({ navigation, route }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);
  const { user } = route.params;

  const buscarCanciones = async () => {
    if (!query.trim()) return;

    try {
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&namesearch=${encodeURIComponent(
        query
      )}&include=musicinfo&audioformat=mp31`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.results) {
        setResults(json.results);
      } else {
        Alert.alert('Error', 'No se encontraron resultados.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar a Jamendo.');
    }
  };

  const guardarCancion = async (song) => {
    try {
      const body = {
        title: song.name,
        artist: song.artist_name,
        genre: song.musicinfo?.tags?.genres?.[0] || 'Desconocido',
        duration: parseInt(song.duration),
        file_url: song.audio,
        uploaded_by: user.id,
      };

      const res = await fetch('http://10.125.217.144:3000/songs/fromJamendo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert('Error', data.message || 'Error al guardar canción.');
      }

      Alert.alert('Éxito', 'Canción guardada correctamente.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la canción.');
    }
  };

  const reproducirCancion = async (song) => {
    try {
      // Detener si ya hay una sonando
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Si se vuelve a presionar la misma, simplemente detenerla
      if (playingId === song.id) {
        setPlayingId(null);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.audio },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setPlayingId(song.id);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo reproducir la canción.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Buscar Canciones</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre de la canción o artista"
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity style={styles.button} onPress={buscarCanciones}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: 16 }}>
        {results.map((song) => (
          <View key={song.id} style={styles.resultCard}>
            <Text style={styles.songTitle}>{song.name}</Text>
            <Text style={styles.songInfo}>🎤 {song.artist_name}</Text>
            <Text style={styles.songInfo}>
              🎧 Género: {song.musicinfo?.tags?.genres?.[0] || 'Desconocido'}
            </Text>
            <Text style={styles.songInfo}>⏱️ {song.duration}s</Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, backgroundColor: '#2ecc71' }]}
                onPress={() => guardarCancion(song)}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>💾 Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, backgroundColor: '#e67e22' }]}
                onPress={() => reproducirCancion(song)}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  {playingId === song.id ? '⏹️ Detener' : '▶ Reproducir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  saveButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
