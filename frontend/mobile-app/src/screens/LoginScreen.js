import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import authService from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('E-posta ve şifre giriniz.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setLoading(false);
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      setLoading(false);
      
      if (error.message === 'ACCOUNT_NOT_ACTIVE') {
        Alert.alert(
          'Hesap Doğrulanmadı',
          'Hesabınız henüz doğrulanmamış. E-posta doğrulama ekranına yönlendiriliyorsunuz.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('VerifyEmail', { email }),
            },
          ]
        );
      } else {
        setError(error.message || 'Giriş sırasında bir hata oluştu.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Giriş Yap
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Input
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        secureTextEntry
      />

      <Button
        title="Giriş Yap"
        onPress={handleLogin}
        loading={loading}
        buttonStyle={styles.button}
      />

      <View style={styles.registerContainer}>
        <Text>Hesabınız yok mu?</Text>
        <Button
          title="Kayıt Ol"
          type="clear"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default LoginScreen; 