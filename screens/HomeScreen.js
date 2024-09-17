import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importer LinearGradient

const HomeScreen = () => {
  const navigation = useNavigation();
  const logoAnimation = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnimation, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoAnimation]);

  const handleGamePress = (screenName) => {
    setAnimating(true);  
    setTimeout(() => {
      navigation.navigate(screenName); 
      setAnimating(false);
    }, 1000); 
  };

  return (
    <View style={styles.container}>
      {/* Bouton d'information */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="info-circle" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Animation Lottie en arrière-plan */}
      <LottieView
        source={require('../assets/stars.json')}
        autoPlay
        loop
        style={styles.lottieBackground}
      />

      {/* Logo animé */}
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.mainLogo, { transform: [{ scale: logoAnimation }] }]}
        resizeMode="contain"
      />

      <Text style={styles.title}>Choisissez un jeu :</Text>

      {/* Loto button avec dégradé */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => handleGamePress("LotoScreen")}
        disabled={animating}  
      >
        <LinearGradient
          colors={['#3A73C2', '#4D9CEB', '#0055A4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Image
            source={require("../assets/Nouveau_logo_loto.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* EuroMillions button avec dégradé */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => handleGamePress("EuroScreen")}
        disabled={animating}  
      >
        <LinearGradient
          colors={['#3A73C2', '#4D9CEB', '#0055A4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Image
            source={require("../assets/Euromillions.png")}
            style={styles.euroLogo}
            resizeMode="contain"
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal pour les informations */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Informations du Jeu</Text>
            <Text style={styles.modalText}>
              Bienvenue sur LOTTO GAME. Ici, vous trouverez des simulateurs de
              loterie que vous connaissez sûrement. Vous pourrez ainsi vous
              sensibiliser aux jeux d'argent et à ce qu'ils impliquent. Vous
              verrez surtout que vous ne gagnerez pas toujours, voire même très
              rarement... C'est le but. Cela vous permettra de mieux comprendre
              l'impact que ce type de jeu peut avoir sur vous, et sur votre
              portefeuille. Amusez-vous tout de même !
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C77AF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  infoButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 2,  
  },
  lottieBackground: {
    position: "absolute",
    width: 600,
    height: 600,
    top: "-5%",
  },
  mainLogo: {
    width: 350,
    height: 350,
    marginBottom: 20,
    zIndex: 1, 
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    zIndex: 2,
  },
  buttonContainer: {
    width: "80%",
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 8.3,
    elevation: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  euroLogo: {
    width: 230,
    height: 90,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default HomeScreen;
