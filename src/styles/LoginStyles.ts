import { StyleSheet } from 'react-native';
import { Color, FontSize, GlobalStyles } from './GlobalStyles';

export const LoginStyles = StyleSheet.create({
  // Extend global container with screen-specific tweaks
  container: {
    ...GlobalStyles.container,
    paddingHorizontal: 20,
  },
  // Customize input for login screen
  input: {
    ...GlobalStyles.input,
    marginBottom: 15, // Slightly larger spacing
  },
  // MFA-specific text
  mfaText: {
    ...GlobalStyles.text,
    fontSize: FontSize.size_xl,
    textAlign: 'center',
    marginBottom: 20,
    color: Color.blueGreen,
  },
  // Back button (if needed)
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
