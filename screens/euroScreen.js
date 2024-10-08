import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EuroHeader from "../components/euroHeader";
import EuroSoldeDisplay from "../components/EuroSoldeDisplay";
import EuroJackpot from "../components/euroJackpot";
import EuroInputSection from "../components/euroInputSection";
import EuroAnimation from "../components/EuroAnimation";
import EuroResultModal from "../components/EuroResultModal";
import EuroGrillesModal from "../components/EuroGrillesModal";
import EuroGenererModal from "../components/EuroGenererModal";
import EuroInfoModal from "../components/EuroInfoModal";
import EuroMillionsHistoriqueModal from "../components/EuroMillionsHistoriqueModal";
import StatModal from "../components/StatModal";
import LottieView from "lottie-react-native";

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUniqueNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(getRandomNumber(min, max));
  }
  return Array.from(numbers);
};

const EuroScreen = () => {
  const [grilles, setGrilles] = useState([]);
  const [solde, setSolde] = useState(0);
  const [depot, setDepot] = useState("");
  const [resultatsGrilles, setResultatsGrilles] = useState([]);
  const [totalGains, setTotalGains] = useState(0);
  const [nombreTours, setNombreTours] = useState(0);
  const [totalDepense, setTotalDepense] = useState(0);
  const [meilleurGain, setMeilleurGain] = useState(0);
  const [jackpot, setJackpot] = useState(17000000);
  const [numerosTirage, setNumerosTirage] = useState([]);
  const [etoilesTirage, setEtoilesTirage] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [etoilePlus, setEtoilePlus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [grillesModalVisible, setGrillesModalVisible] = useState(false);
  const [modalGenererVisible, setModalGenererVisible] = useState(false);
  const [nombreGrillesAGenerer, setNombreGrillesAGenerer] = useState("");
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [gainDernierTour, setGainDernierTour] = useState(0);
  const [historiqueModalVisible, setHistoriqueModalVisible] = useState(false);
  const [statModalVisible, setStatModalVisible] = useState(false); // Visible pour la modal de statistiques
  const [historiqueEuro, setHistoriqueEuro] = useState([]);
  const [ajouterModalVisible, setAjouterModalVisible] = useState(false);
  const [stats, setStats] = useState({
    numeros: Array.from({ length: 50 }, (_, i) => ({ number: i + 1, count: 0 })),
    etoiles: Array.from({ length: 12 }, (_, i) => ({ number: i + 1, count: 0 })),
  });

  const circleAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const [jackpotAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jackpotAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(jackpotAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const ajouterGrille = (numeros, etoiles) => {
    setGrilles((prevGrilles) => [
      ...prevGrilles,
      {
        numeros,
        etoiles,
        etoilePlus,
      },
    ]);
  };

  const genererGrillesAleatoires = () => {
    try {
      const nombre = parseInt(nombreGrillesAGenerer);
      if (isNaN(nombre) || nombre < 1 || nombre > 1000) {
        throw new Error("Veuillez entrer un nombre entre 1 et 1000.");
      }

      const nouvellesGrilles = [];
      for (let i = 0; i < nombre; i++) {
        const numeros = getRandomUniqueNumbers(5, 1, 50);
        const etoiles = getRandomUniqueNumbers(2, 1, 12);
        nouvellesGrilles.push({
          numeros: numeros,
          etoiles: etoiles,
          etoilePlus,
        });
      }

      setGrilles((prevGrilles) => [...prevGrilles, ...nouvellesGrilles]);
      setModalGenererVisible(false);
      setNombreGrillesAGenerer("");
      setEtoilePlus(false);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const jouer = () => {
    if (grilles.length === 0) {
      Alert.alert(
        "Info",
        "Veuillez ajouter au moins une grille avant de jouer."
      );
      return;
    }

    const coutTotalGrilles = grilles.reduce(
      (acc, grille) => acc + 2.5 + (grille.etoilePlus ? 1 : 0),
      0
    );

    if (solde < coutTotalGrilles) {
      Alert.alert("Erreur", "Solde insuffisant pour jouer.");
      return;
    }

    setSolde((prevSolde) => prevSolde - coutTotalGrilles);
    setTotalDepense((prevTotalDepense) => prevTotalDepense + coutTotalGrilles);
    setNombreTours((prevNombreTours) => prevNombreTours + 1);

    const numerosTires = getRandomUniqueNumbers(5, 1, 50);
    const etoilesTires = getRandomUniqueNumbers(2, 1, 12);

    lancerAnimationTirage(() => {
      setNumerosTirage(numerosTires);
      setEtoilesTirage(etoilesTires);

      let gainTotalTour = 0;
      let newMeilleurGain = meilleurGain;
      let jackpotGagne = false;
      const tempResultatsGrilles = [];

      // Ajouter le tirage à l'historique
      setHistoriqueEuro((prevHistorique) => [
        ...prevHistorique,
        { numerosTires, etoilesTires },
      ]);

      grilles.forEach((grille) => {
        const gain = calculerGains(
          grille.numeros,
          grille.etoiles,
          numerosTires,
          etoilesTires,
          grille.etoilePlus
        );
        const numerosTrouves = grille.numeros.filter((num) =>
          numerosTires.includes(num)
        );
        const etoilesTrouvees = grille.etoiles.filter((etoile) =>
          etoilesTires.includes(etoile)
        );

        let gainTotalGrille = 0;
        if (gain === "Jackpot") {
          gainTotalGrille += jackpot;
          jackpotGagne = true;
          setJackpot(17000000);
        } else if (gain > 0) {
          gainTotalGrille += gain;
        }

        if (gainTotalGrille > 0) {
          gainTotalTour += gainTotalGrille;
          if (gainTotalGrille > newMeilleurGain) {
            newMeilleurGain = gainTotalGrille;
          }
        }

        tempResultatsGrilles.push({
          numeros: grille.numeros,
          etoiles: grille.etoiles,
          etoilePlus: grille.etoilePlus,
          numerosTrouves: numerosTrouves,
          etoilesTrouvees: etoilesTrouvees,
          gain: gainTotalGrille > 0 ? gainTotalGrille : null,
        });
      });

      if (!jackpotGagne) {
        setJackpot((prevJackpot) => prevJackpot + 7000000);
      }

      setMeilleurGain(newMeilleurGain);
      setTotalGains((prevTotalGains) => prevTotalGains + gainTotalTour);
      setSolde((prevSolde) => prevSolde + gainTotalTour);
      setResultatsGrilles(tempResultatsGrilles);
      setGainDernierTour(gainTotalTour);
      setModalVisible(true);

      // Mettre à jour les statistiques
      updateStats(numerosTires, etoilesTires);
    });
  };

  const deposerSolde = () => {
    try {
      const montant = parseFloat(depot);
      if (isNaN(montant) || montant <= 0) {
        throw new Error("Veuillez entrer un montant valide.");
      }
      setSolde((prevSolde) => prevSolde + montant);
      setDepot("");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const reinitialiserGrilles = () => {
    Alert.alert(
      "Confirmer",
      "Voulez-vous vraiment réinitialiser toutes les grilles?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          onPress: () => {
            setGrilles([]);
            setResultatsGrilles([]);
          },
        },
      ]
    );
  };

  const calculerGains = (
    numerosJoueur,
    etoilesJoueur,
    numerosTirage,
    etoilesTirage,
    etoilePlus
  ) => {
    const nbNumerosCorrects = numerosJoueur.filter((num) =>
      numerosTirage.includes(num)
    ).length;
    const nbEtoilesCorrectes = etoilesJoueur.filter((etoile) =>
      etoilesTirage.includes(etoile)
    ).length;

    const gains = {
      50: "Jackpot",
      51: 250000,
      52: 35000,
      42: 2500,
      41: 150,
      32: 80,
      40: 35,
      22: 18,
      31: 11,
      30: 8,
      12: 7,
      21: 5,
      20: 3,
    };

    const key = `${nbNumerosCorrects}${nbEtoilesCorrectes}`;
    let gain = gains[key] || 0;

    if (etoilePlus && gain !== "Jackpot") {
      gain = Math.floor(gain * 1.12);
    }

    return gain;
  };

  const updateStats = (numerosTires, etoilesTires) => {
    setStats((prevStats) => {
      const updatedNumeros = prevStats.numeros.map((stat) => ({
        ...stat,
        count: stat.count + (numerosTires.includes(stat.number) ? 1 : 0),
      }));

      const updatedEtoiles = prevStats.etoiles.map((stat) => ({
        ...stat,
        count: stat.count + (etoilesTires.includes(stat.number) ? 1 : 0),
      }));

      return {
        numeros: updatedNumeros,
        etoiles: updatedEtoiles,
      };
    });
  };

  const lancerAnimationTirage = (callback) => {
    setIsAnimating(true);
    circleAnimations.forEach((anim) => anim.setValue(0));
    const animations = circleAnimations.map((anim) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      });
    });
    Animated.sequence(animations).start(() => {
      setIsAnimating(false);
      callback();
    });
  };

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <LottieView
              source={require("../assets/stars.json")}
              autoPlay
              loop
              style={styles.lottieBackground}
            />
            {/* Header */}
            <EuroHeader onInfoPress={() => setModalInfoVisible(true)} />

            {/* Jackpot */}
            <EuroJackpot jackpotAnimation={jackpotAnimation} jackpot={jackpot} />

            {/* Bouton pour ajouter une grille */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAjouterModalVisible(true)}
            >
              <Text style={styles.buttonText}>Ajouter Grille</Text>
            </TouchableOpacity>

            {/* Bouton pour générer des grilles */}
            <TouchableOpacity
              style={styles.genererButton}
              onPress={() => setModalGenererVisible(true)}
            >
              <Text style={styles.genererButtonText}>Générer des Grilles</Text>
            </TouchableOpacity>

            {/* Boutons pour les grilles (si au moins une grille est ajoutée) */}
            {grilles.length > 0 && (
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.grillesButton}
                  onPress={() => setGrillesModalVisible(true)}
                >
                  <Text style={styles.buttonText}>({grilles.length})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={reinitialiserGrilles}
                >
                  <FontAwesome name="refresh" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            {/* Dépôt du solde */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Déposer Solde:</Text>
              <View style={styles.depotRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={depot}
                  onChangeText={(text) => setDepot(text.replace(/[^0-9.]/g, ""))}
                  placeholder="Montant"
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity style={styles.depotButton} onPress={deposerSolde}>
                  <Text style={styles.buttonText}>€</Text>
                </TouchableOpacity>
              </View>
            </View>

            <EuroSoldeDisplay solde={solde} />

            {isAnimating ? (
              <EuroAnimation circleAnimations={circleAnimations} isAnimating={isAnimating} />
            ) : (
              <TouchableOpacity style={styles.playButton} onPress={jouer} disabled={isAnimating}>
                <Text style={styles.buttonText}>Jouer</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.historiqueButton} onPress={() => setHistoriqueModalVisible(true)}>
              <FontAwesome name="book" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Bouton pour ouvrir la modal des statistiques */}
            <TouchableOpacity style={styles.statButton} onPress={() => setStatModalVisible(true)}>
              <FontAwesome name="bar-chart" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>

          {/* Modals */}
          <EuroInputSection
            visible={ajouterModalVisible}
            onClose={() => setAjouterModalVisible(false)}
            onAddGrille={ajouterGrille}
          />

          <EuroGrillesModal
            grillesModalVisible={grillesModalVisible}
            setGrillesModalVisible={setGrillesModalVisible}
            grilles={grilles}
          />

          <EuroGenererModal
            modalGenererVisible={modalGenererVisible}
            setModalGenererVisible={setModalGenererVisible}
            nombreGrillesAGenerer={nombreGrillesAGenerer}
            setNombreGrillesAGenerer={setNombreGrillesAGenerer}
            etoilePlus={etoilePlus}
            setEtoilePlus={setEtoilePlus}
            genererGrillesAleatoires={genererGrillesAleatoires}
          />

          <EuroResultModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            resultatsGrilles={resultatsGrilles}
            gainDernierTour={gainDernierTour}
            totalGains={totalGains}
            meilleurGain={meilleurGain}
            totalDepense={totalDepense}
            nombreTours={nombreTours}
            numerosTirage={numerosTirage}
            etoilesTirage={etoilesTirage}
          />

          <EuroInfoModal modalInfoVisible={modalInfoVisible} setModalInfoVisible={setModalInfoVisible} />

          <EuroMillionsHistoriqueModal
            modalVisible={historiqueModalVisible}
            setModalVisible={setHistoriqueModalVisible}
            historiqueEuroMillions={historiqueEuro || []}
          />

          <StatModal
            visible={statModalVisible}
            onClose={() => setStatModalVisible(false)}
            numeroStats={stats.numeros}
            etoileStats={stats.etoiles}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#2C77AF",
  },
  container: {
    marginTop: 30,
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginVertical: 10,
  },
  grillesButton: {
    backgroundColor: "#0055A4",
    flex: 1,
    marginRight: 5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: "#FFC107",
    flex: 1,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#0055A4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: "60%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  genererButton: {
    backgroundColor: "#0055A4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: "60%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  genererButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  playButton: {
    backgroundColor: "#0055A4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: "60%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  historiqueButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0055A4",
    padding: 10,
    borderRadius: 50,
  },
  statButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#0055A4",
    padding: 10,
    borderRadius: 50,
  },
  lottieBackground: {
    position: "absolute",
    width: 800,
    height: 800,
    top: "5%",
  },
  depotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 8,
    width: 150,
    textAlign: "center",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  depotButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    height: 45,
    justifyContent: "center",
  },
});

export default EuroScreen;
