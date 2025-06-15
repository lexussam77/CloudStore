import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const AddAccount = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Registration successful! Please login.');
        setUsername('');
        setEmail('');
        setPassword('');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', data.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View>
        <Image
          source={require("../assets/images/CloudStore.png")}
          style={styles.Logo}
        />
      </View>
      <View style={styles.LowerPage}>
        <Text style={styles.Welcometxt}>Create Account</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.emailbox}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.emailbox}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.emailbox}
        />
        <TouchableOpacity style={styles.ContinueButton} onPress={handleRegister} disabled={loading}>
          <Text>{loading ? 'Registering...' : 'Continue'}</Text>
        </TouchableOpacity>
        <Text style={{marginTop: 16, color: '#007bff'}} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
    Logo : {
        width: 389,
        height: 480,

    },
    LowerPage: {
        width: '100%',
        height: 300,
        backgroundColor: '#3C3B39',
        alignItems: 'center',
    },
    Welcometxt: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '400',
        marginTop: 20,
        marginBottom: 20,
    },
    GoogleLogin: {
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#666362',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        
        
        
    },
    Googletxt: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 10,
    },
    emailbox: {
        width: '80%',
        height: 50,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
    },
    ContinueButton: {
        width: '80%',
        height: 50,
        borderRadius: 5,
        backgroundColor: '#0571FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

})
