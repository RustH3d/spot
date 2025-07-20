import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, Alert, ScrollView, TextInput,  KeyboardAvoidingView, 
  Platform             
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ReviewMoviesScreen({ route, navigation }) {
  const { movie, user } = route.params;

  const [rating, setRating]         = useState('5.0');
  const [comentario, setComentario] = useState('');
  const [commentId, setCommentId]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [otherComments, setOtherComments] = useState([]);

  const ratingOptions = [];
  for (let i = 1; i <= 10; i += 0.5) ratingOptions.push(i.toFixed(1));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `http://192.168.194.159:3000/comments/user/${user.id}/movie/${movie.id}`
        );
        if (res.status === 200) {
          const data = await res.json();
          setCommentId(data.id);
          setComentario(data.comentario);
          setRating((+data.puntaje).toFixed(1));
        }
      } catch (err) {
        console.error('Error al recuperar reseña:', err);
      } finally {
        setLoading(false);
      }
    })();

    // Obtener todos los comentarios de otros usuarios
    (async () => {
      try {
        const res = await fetch(`http://192.168.194.159:3000/comments/${movie.id}`);
        const data = await res.json();
        if (res.ok && data.comments) {
          setOtherComments(data.comments);
        }
      } catch (err) {
        console.error('Error al obtener comentarios:', err);
      }
    })();
  }, [user.id, movie.id]);

  const handleSubmitReview = async () => {
    if (!comentario.trim()) {
      return Alert.alert('Error', 'El comentario no puede estar vacío');
    }
    const payload = {
      user_id:   user.id,
      movie_id:  movie.id,
      comentario,
      puntaje:   parseFloat(rating),
    };
    const url    = commentId
      ? `http://192.168.194.159:3000/comments/${commentId}`
      : 'http://192.168.194.159:3000/comments';
    const method = commentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('¡Éxito!', commentId ? 'Reseña actualizada.' : 'Reseña enviada.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'No se pudo enviar la reseña');
      }
    } catch (err) {
      console.error('Error enviando reseña:', err);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#ccc' }}>Cargando reseña…</Text>
      </View>
    );
  }

return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: '#111' }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {movie.poster_url && (
        <Image source={{ uri: movie.poster_url }} style={styles.poster} />
      )}
      <Text style={styles.title}>{movie.titulo}</Text>
      <Text style={styles.date}>
        {movie.fecha_lanzamiento
          ? new Date(movie.fecha_lanzamiento).toLocaleDateString('es-ES', {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          : 'Sin fecha'}
      </Text>
      {movie.descripcion && (
        <Text style={styles.description}>{movie.descripcion}</Text>
      )}

      {otherComments.length > 0 && (
        <>
          <Text style={styles.label}>Reseñas:</Text>
          {otherComments.map((c, index) => (
            <View key={index} style={styles.commentBox}>
              <Text style={styles.commentUser}>
                👤 {c.user_name || c.user_id}
              </Text>
              <Text style={styles.commentText}>📝 {c.comentario}</Text>
              <Text style={styles.commentScore}>⭐ {parseFloat(c.puntaje).toFixed(1)}</Text>
            </View>
          ))}
        </>
      )}

      {!showForm && (
        <TouchableOpacity style={styles.toggleButton} onPress={() => setShowForm(true)}>
          <Text style={styles.buttonText}>
            {commentId ? 'Editar mi reseña' : 'Escribir una reseña'}
          </Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <>
          <Text style={styles.label}>Tu puntuación</Text>
          <Picker
            selectedValue={rating}
            onValueChange={setRating}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {ratingOptions.map(val => (
              <Picker.Item key={val} label={val} value={val} />
            ))}
          </Picker>

          <TextInput
            placeholder="Escribe un comentario…"
            style={styles.input}
            multiline
            value={comentario}
            onChangeText={setComentario}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
            <Text style={styles.buttonText}>
              {commentId ? 'Actualizar reseña' : 'Enviar reseña'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },
  picker: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    borderColor: '#444',
    borderWidth: 1,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    borderRadius: 8,
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  commentBox: {
    backgroundColor: '#222',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    width: '100%',
  },
  commentUser: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: '#ccc',
    marginBottom: 4,
  },
  commentScore: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
});
