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

const HomeScreen = () => {
  const navigation = useNavigation();
  const logoAnimation = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false); 

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

  return (
    <View style={styles.container}>
      {/* Bouton d'information en haut à droite */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setModalVisible(true)} 
      >
        <FontAwesome name="info-circle" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Logo animé */}
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.mainLogo, { transform: [{ scale: logoAnimation }] }]}
        resizeMode="contain"
      />

      <Text style={styles.title}>Choisissez un jeu :</Text>

      <TouchableOpacity
        style={styles.lotoButton}
        onPress={() => navigation.navigate("LotoScreen")}
      >
        <Image
          source={require("../assets/Nouveau_logo_loto.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.euroButton}
        onPress={() => navigation.navigate("EuroScreen")}
      >
        <Image
          source={require("../assets/Euromillions.png")}
          style={styles.euroLogo}
          resizeMode="contain"
        />
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
    top: 60,
    right: 20,
  },
  mainLogo: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  lotoButton: {
    backgroundColor: "#0055A4",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  euroButton: {
    backgroundColor: "#0055A4",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
