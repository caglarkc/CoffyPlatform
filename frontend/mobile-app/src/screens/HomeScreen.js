import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import authService from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from storage
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Hoş Geldiniz!
      </Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            <Text style={styles.label}>Ad Soyad:</Text> {user.name} {user.surname}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.label}>E-posta:</Text> {user.email}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.label}>Telefon:</Text> {user.phone}
          </Text>
        </View>
      )}

      <Text style={styles.message}>
        Başarıyla giriş yaptınız. Bu ekran sadece giriş yapan kullanıcılar için görünür.
      </Text>

      <Button
        title="Çıkış Yap"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
  },
  userInfo: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#E57373',
  },
  buttonContainer: {
    width: '80%',
  },
});

export default HomeScreen; 