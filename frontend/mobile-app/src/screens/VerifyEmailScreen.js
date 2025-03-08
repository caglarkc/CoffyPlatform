import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import authService from '../services/api';

const VerifyEmailScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Send verification email when component mounts
    sendVerificationEmail();
  }, []);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationEmail = async () => {
    try {
      setSendingEmail(true);
      const response = await authService.sendVerificationEmail(email);
      setSendingEmail(false);
      
      // Set countdown for resend button (5 minutes)
      if (response.expiresAt) {
        const expiresAt = new Date(response.expiresAt).getTime();
        const now = new Date().getTime();
        const timeLeft = Math.floor((expiresAt - now) / 1000);
        setCountdown(timeLeft > 0 ? timeLeft : 300);
      } else {
        setCountdown(300); // Default 5 minutes
      }
      
      Alert.alert(
        'E-posta Gönderildi',
        'Doğrulama kodu e-posta adresinize gönderildi.'
      );
    } catch (error) {
      setSendingEmail(false);
      setError(error.message || 'E-posta gönderilirken bir hata oluştu.');
    }
  };

  const handleVerify = async () => {
    // Reset error
    setError('');

    // Validate input
    if (!verificationCode) {
      setError('Doğrulama kodunu giriniz.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifyEmail(email, verificationCode);
      setLoading(false);
      
      Alert.alert(
        'Doğrulama Başarılı',
        'E-posta adresiniz başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.',
        [
          {
            text: 'Giriş Yap',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Doğrulama sırasında bir hata oluştu.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        E-posta Doğrulama
      </Text>

      <Text style={styles.subtitle}>
        {email} adresine gönderilen doğrulama kodunu giriniz.
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Input
        placeholder="Doğrulama Kodu"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button
        title="Doğrula"
        onPress={handleVerify}
        loading={loading}
        buttonStyle={styles.button}
      />

      <Button
        title={
          countdown > 0
            ? `Yeniden Gönder (${formatTime(countdown)})`
            : 'Yeniden Gönder'
        }
        type="outline"
        onPress={sendVerificationEmail}
        loading={sendingEmail}
        disabled={countdown > 0}
        buttonStyle={styles.resendButton}
        containerStyle={styles.resendButtonContainer}
      />

      <Button
        title="Giriş Ekranına Dön"
        type="clear"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButtonContainer}
      />
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4A6572',
  },
  resendButton: {
    marginTop: 10,
  },
  resendButtonContainer: {
    marginTop: 20,
  },
  backButtonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default VerifyEmailScreen; 