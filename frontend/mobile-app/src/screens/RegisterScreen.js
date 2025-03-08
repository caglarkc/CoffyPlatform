import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import authService from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!name || !surname || !email || !phone || !password || !confirmPassword) {
      setError('Tüm alanları doldurunuz.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Geçerli bir telefon numarası giriniz (10 haneli).');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        name,
        surname,
        email,
        phone,
        password,
      });

      setLoading(false);
      Alert.alert(
        'Kayıt Başarılı',
        'Hesabınız oluşturuldu. E-posta adresinizi doğrulamak için bir kod gönderilecek.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('VerifyEmail', { email }),
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h3 style={styles.title}>
        Hesap Oluştur
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Input
        placeholder="Ad"
        value={name}
        onChangeText={setName}
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        autoCapitalize="words"
      />

      <Input
        placeholder="Soyad"
        value={surname}
        onChangeText={setSurname}
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        autoCapitalize="words"
      />

      <Input
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Telefon"
        value={phone}
        onChangeText={setPhone}
        leftIcon={{ type: 'font-awesome', name: 'phone' }}
        keyboardType="phone-pad"
      />

      <Input
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        secureTextEntry
      />

      <Input
        placeholder="Şifre Tekrar"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        secureTextEntry
      />

      <Button
        title="Kayıt Ol"
        onPress={handleRegister}
        loading={loading}
        buttonStyle={styles.button}
      />

      <View style={styles.loginContainer}>
        <Text>Zaten hesabınız var mı?</Text>
        <Button
          title="Giriş Yap"
          type="clear"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4A6572',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen; 