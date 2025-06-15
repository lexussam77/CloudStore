import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");

  const handleSmartLogin = () => {
    Alert.alert("Smart Login", "Biometric authentication would be implemented here");
  };
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('loggedIn', 'true');
        // Save only the user's name to AsyncStorage for profile
        if (data.name) {
          await AsyncStorage.setItem('user', JSON.stringify({ name: data.name }));
        }
        setIsLoggedIn(true);
        Alert.alert('Success', 'Login successful!');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password || (isSignUp && !fullName)) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const payload = isSignUp
      ? { username: email, name: fullName, email, password }
      : { username: email, password };

    const url = isSignUp
      ? 'http://localhost:8081/api/auth/register'
      : 'http://localhost:8081/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || data.message || "Authentication failed");
        return;
      }

      if (isSignUp) {
        Alert.alert("Success", "Account created!", [
          { text: "OK", onPress: () => setIsSignUp(false) }
        ]);
      } else {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('loggedIn', 'true');
        // Save only the user's name to AsyncStorage for profile
        if (data.name) {
          await AsyncStorage.setItem('user', JSON.stringify({ name: data.name }));
        }
        Alert.alert("Success", "Logged in!");
        setIsLoggedIn(true);
        navigation.replace("MainTabs", { user: data.name || fullName });
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Try again later.");
      console.error(error);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F2" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.upperElements}>
            <Image 
              resizeMethod="resize" 
              resizeMode="contain"
              source={require("../assets/images/SignUppic.png")}
              style={styles.signUpPic}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcome}>
                {isSignUp ? "Join" : "Welcome to"}
              </Text>
              <Text style={styles.cloudStore}>CloudStore</Text>
              <Text style={styles.subtitle}>
                {isSignUp 
                  ? "Create your account to get started" 
                  : "Your digital storage solution"
                }
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#999"
                />
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.smartButton}
              onPress={handleSmartLogin}
              activeOpacity={0.8}
            >
              <Image 
                source={require("../assets/images/fingerprint.png")} 
                style={styles.fingerprintIcon}
              />
              <Text style={styles.smartButtonText}>Smart Login</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleLink}>
                {isSignUp ? "Sign In" : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  upperElements: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  signUpPic: {
    width: 280,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    alignItems: "center",
  },
  welcome: {
    fontSize: 28,
    fontWeight: "300",
    color: "#2C3E50",
    marginBottom: 5,
  },
  cloudStore: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    color: "#2C3E50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E1E8ED",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "500",
  },
  smartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#6C63FF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fingerprintIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: "#6C63FF",
  },
  smartButtonText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  toggleText: {
    color: "#7F8C8D",
    fontSize: 16,
    marginRight: 8,
  },
  toggleLink: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "600",
  },
});