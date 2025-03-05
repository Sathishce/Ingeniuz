import { StyleSheet } from "react-native";

// Screen dimensions
//const { width, height } = Dimensions.get("window");

// Global color palette
export const Color = {
  bGNavy900: "#1A2A44", // Background navy
  wHITE: "#FFFFFF",     // White
  teal: "#2FFEE0",      // Teal accent
  blueGreen: "#2FEEB0", // Blue-green accent
  transparentGray50: "rgba(93, 93, 93, 0.2)", // Transparent gray
  colorGray_200: "#898989", // Gray border
} as const;

// Global font settings
export const FontFamily = {
  sourceSansPro: "SourceSansPro-Regular",
  podkovaBold: "Podkova-Bold",
} as const;

export const FontSize = {
  size_base: 16,
  size_xl: 20,
  size_5xl: 24,
} as const;

// Common padding and border settings
export const Padding = {
  p_xl: 20,
  p_5xl: 24,
} as const;

export const Border = {
  br_5xl: 24,
} as const;

// Global styles
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bGNavy900,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    padding: 16,
    borderRadius: Border.br_5xl,
    borderWidth: 1,
    borderColor: Color.teal,
    backgroundColor: "transparent",
    color: Color.wHITE,
    fontFamily: FontFamily.sourceSansPro,
    fontSize: FontSize.size_base,
    marginBottom: 10,
  },
  button: {
    width: "90%",
    paddingVertical: 12,
    backgroundColor: Color.teal,
    borderRadius: Border.br_5xl,
    borderWidth: 2,
    borderColor: Color.teal,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Color.bGNavy900,
    fontFamily: FontFamily.podkovaBold,
    fontSize: FontSize.size_xl,
  },
  text: {
    color: Color.wHITE,
    fontFamily: FontFamily.sourceSansPro,
    fontSize: FontSize.size_base,
  },
  headerText: {
    color: Color.blueGreen,
    fontFamily: FontFamily.podkovaBold,
    fontSize: FontSize.size_5xl,
    textAlign: "center",
  },
});//
