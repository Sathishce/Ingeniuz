import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { AuthUseCases } from '../useCases/AuthUseCases';
import { AuthRepositoryImpl } from '../repositories/implementations/AuthRepositoryImpl';
import { LogRepositoryImpl } from '../repositories/implementations/LogRepositoryImpl';
import { LoginStyles } from '../styles/LoginStyles'; 

const authUseCases = new AuthUseCases(new AuthRepositoryImpl(), new LogRepositoryImpl());

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smsVerificationCode, setSmsVerificationCode] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [step, setStep] = useState(0); // 0: Email/Password, 1: MFA

  const handleSubmitPress = async () => {
    try {
      if (step === 0) {
        const requiresMFA = await authUseCases.login(email, password);
        if (requiresMFA) {
          Alert.alert('Success', 'Please enter the MFA codes sent to your email and phone.');
          setStep(1);
        } else {
          // If no MFA required, complete login here (unlikely in your case)
          Alert.alert('Success', 'Logged in successfully (No MFA required)');
          navigation.navigate('Main', { email });
        }
      } else if (step === 1) {
        const user = await authUseCases.completeTwoFactor(email, emailVerificationCode, smsVerificationCode);
        Alert.alert(user.email);
        const isFirst = await authUseCases.isFirstUser(email);
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate(isFirst ? 'WelcomeScreen' : 'Main', { email });
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={LoginStyles.container}>
      {step === 0 && (
        <>
          <TextInput
            style={LoginStyles.input}
            placeholder="Email Address"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            style={LoginStyles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </>
      )}
      {step === 1 && (
        <>
          <TextInput
            style={LoginStyles.input}
            placeholder="SMS Verification Code"
            onChangeText={setSmsVerificationCode}
            value={smsVerificationCode}
            keyboardType="numeric"
          />
          <TextInput
            style={LoginStyles.input}
            placeholder="Email Verification Code"
            onChangeText={setEmailVerificationCode}
            value={emailVerificationCode}
            keyboardType="numeric"
          />
        </>
      )}
      <Button title="Submit" onPress={handleSubmitPress} />
    </View>
  );
};

export default LoginScreen;
