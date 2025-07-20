import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function UserSettingsScreen({ route, navigation }) {
  const { user } = route.params;

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const body = password ? { name, email, password } : { name, email };

     const response = await fetch(`http://192.168.194.159:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Fallo al actualizar');

      Alert.alert('Éxito', 'Tu información fue actualizada');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`http://192.168.194.159:3000/users/${user.id}`, {
           // await fetch(`https://recets-production.up.railway.app/users/${user.id}`, {
                method: 'DELETE',
              });
              Alert.alert('Cuenta eliminada');
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'No se pudo eliminar la cuenta');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Tu correo"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Nueva contraseña (opcional)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nueva contraseña"
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Eliminar Cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#111', // fondo oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // texto claro
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#ccc', // gris claro
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#fff', // texto claro
  },
  button: {
    backgroundColor: '#3b82f6', // azul moderno como en otros botones
    marginTop: 32,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#f1696c',
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
