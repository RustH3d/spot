import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolUsuario, setRolUsuario] = useState('casual'); // 'casual' o 'critic'

  const API_URL = 'http://10.125.217.144:3000/users/register';

  const handleRegister = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Por favor completa todos los campos');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: email.split('@')[0],
        email,
        password,
        is_author: rolUsuario === 'critic',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('¡Registrado!', 'Usuario creado con éxito');
    } else {
      Alert.alert('Error al registrar', data.message || 'Intenta con otro correo');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    Alert.alert('Error', 'No se pudo conectar con el servidor');
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Tipo de usuario</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rolUsuario}
          onValueChange={(itemValue) => setRolUsuario(itemValue)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Casual" value="casual" />
          <Picker.Item label="Crítico" value="critic" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0f11',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1c1e22',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    borderColor: '#333',
    borderWidth: 1,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#ccc',
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: '#1c1e22',
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#333',
    borderWidth: 1,
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#22c55e',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
