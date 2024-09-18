import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LotoHistoriqueModal from '../components/LotoHistoriqueModal';
import Header from '../components/Header';
import JackpotDisplay from '../components/JackpotDisplay';
import AjouterModal from '../components/AjouterModal';
import BalanceDisplay from '../components/BalanceDisplay';
import AnimatedCircles from '../components/AnimatedCircles';
import InfoModal from '../components/InfoModal';
import GenerateGrillesModal from '../components/GenerateGrillesModal';
import GrillesModal from '../components/GrillesModal';
import ResultsModal from '../components/ResultsModal';
import LottieView from 'lottie-react-native';

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomUniqueNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(getRandomNumber(min, max));
  }
  return Array.from(numbers);
};

// Fonction calculerGains manquante
const calculerGains = (
  numerosJoueur,
  numeroChanceJoueur,
  numerosTirage,
  numeroChanceTirage,
  secondTirage = false
) => {
  const nbNumerosCorrects = numerosJoueur.filter(num =>
    numerosTirage.includes(num)
  ).length;
  const chanceCorrecte = numeroChanceJoueur === numeroChanceTirage;

  if (secondTirage) {
    const gainsSecond = {
      2: 2,
      3: 10,
      4: 1000,
      5: 100000,
    };
    return gainsSecond[nbNumerosCorrects] || 0;
  } else {
    const gains = {
      '0true': 2,
      '1true': 2,
      '2false': 4,
      '2true': 10,
      '3false': 20,
      '3true': 50,
      '4false': 400,
      '4true': 1000,
      '5false': 100000,
      '5true': 'Jackpot',
    };
    const key = `${nbNumerosCorrects}${chanceCorrecte}`;
    return gains[key] || 0;
  }
};

export default function LotoScreen() {
  const [grilles, setGrilles] = useState([]);
  const [solde, setSolde] = useState(0);
  const [depot, setDepot] = useState('');
  const [resultatsGrilles, setResultatsGrilles] = useState([]);
  const [totalGains, setTotalGains] = useState(0);
  const [nombreTours, setNombreTours] = useState(0);
  const [totalDepense, setTotalDepense] = useState(0);
  const [meilleurGain, setMeilleurGain] = useState(0);
  const [jackpot, setJackpot] = useState(2000000);
  const [numerosTirage, setNumerosTirage] = useState([]);
  const [numeroChanceTirage, setNumeroChanceTirage] = useState(null);
  const [numerosSecondTirage, setNumerosSecondTirage] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [grillesModalVisible, setGrillesModalVisible] = useState(false);
  const [modalGenererVisible, setModalGenererVisible] = useState(false); 
  const [nombreGrillesAGenerer, setNombreGrillesAGenerer] = useState('');
  const [secondTirageGenerer, setSecondTirageGenerer] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [gainDernierTour, setGainDernierTour] = useState(0);
  const [historiqueModalVisible, setHistoriqueModalVisible] = useState(false);
  const [historiqueLoto, setHistoriqueLoto] = useState([]);

  const [ajouterModalVisible, setAjouterModalVisible] = useState(false);

  const circleAnimations = useRef([
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

  const toggleSecondTirage = (index) => {
    setGrilles((prevGrilles) => {
      const newGrilles = [...prevGrilles];
      newGrilles[index].secondTirage = !newGrilles[index].secondTirage;
      return newGrilles;
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

  const jouer = () => {
    if (grilles.length === 0) {
      Alert.alert('Info', 'Veuillez ajouter au moins une grille avant de jouer.');
      return;
    }
  
    const coutTotalGrilles = grilles.reduce(
      (acc, grille) => acc + 2 + (grille.secondTirage ? 1 : 0),
      0
    );
  
    if (solde < coutTotalGrilles) {
      Alert.alert('Erreur', 'Solde insuffisant pour jouer.');
      return;
    }
  
    setSolde((prevSolde) => prevSolde - coutTotalGrilles);
    setTotalDepense((prevTotalDepense) => prevTotalDepense + coutTotalGrilles);
    setNombreTours((prevNombreTours) => prevNombreTours + 1);
  
    const numerosTires = getRandomUniqueNumbers(5, 1, 49);
    const numeroChanceTire = getRandomNumber(1, 10);
    const numerosSecondTires = getRandomUniqueNumbers(5, 1, 49);
  
    lancerAnimationTirage(() => {
      setNumerosTirage(numerosTires);
      setNumeroChanceTirage(numeroChanceTire);
      setNumerosSecondTirage(numerosSecondTires);
  
      setHistoriqueLoto((prevHistorique) => [
        ...prevHistorique,
        { numerosTires, numeroChanceTire }
      ]);
  
      let gainTotalTour = 0;
      let newMeilleurGain = meilleurGain;
      const tempResultatsGrilles = [];
  
      grilles.forEach((grille) => {
        const gain = calculerGains(grille.numeros, grille.chance, numerosTires, numeroChanceTire);
        const numerosTrouves = grille.numeros.filter(num => numerosTires.includes(num));
        const chanceTrouve = grille.chance === numeroChanceTire;
  
        let gainSecond = 0;
        let numerosSecondTrouves = [];
  
        if (grille.secondTirage) {
          gainSecond = calculerGains(grille.numeros, 0, numerosSecondTires, 0, true);
          numerosSecondTrouves = grille.numeros.filter(num => numerosSecondTires.includes(num));
        }
  
        let gainTotalGrille = gain > 0 ? gain : 0;
        gainTotalGrille += gainSecond > 0 ? gainSecond : 0;
  
        if (gainTotalGrille > newMeilleurGain) {
          newMeilleurGain = gainTotalGrille;
        }
        gainTotalTour += gainTotalGrille;
  
        tempResultatsGrilles.push({
          numeros: grille.numeros,
          chance: grille.chance,
          secondTirage: grille.secondTirage,
          numerosTrouves,
          chanceTrouve,
          gain: gain > 0 ? gain : null,
          numerosSecondTrouves,
          gainSecond: gainSecond > 0 ? gainSecond : null,
        });
      });
  
      setMeilleurGain(newMeilleurGain);
      setTotalGains((prevTotalGains) => prevTotalGains + gainTotalTour);
      setSolde((prevSolde) => prevSolde + gainTotalTour);
      setResultatsGrilles(tempResultatsGrilles);
      

      setJackpot((prevJackpot) => prevJackpot + 1000000);
  
      setGainDernierTour(gainTotalTour);
      setModalVisible(true);
    });
  };
  

  const deposerSolde = () => {
    try {
      const montant = parseFloat(depot);
      if (isNaN(montant) || montant <= 0) {
        throw new Error('Veuillez entrer un montant valide.');
      }
      setSolde((prevSolde) => prevSolde + montant);
      setDepot('');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const ajouterGrille = (numeros, numeroChance) => {
    setGrilles([...grilles, { numeros, chance: numeroChance, secondTirage: false }]);
  };

  const genererGrillesAleatoires = () => {
    const nouvellesGrilles = [];
    for (let i = 0; i < parseInt(nombreGrillesAGenerer); i++) {
      const numeros = getRandomUniqueNumbers(5, 1, 49);
      const chance = getRandomNumber(1, 10);
      nouvellesGrilles.push({ numeros, chance, secondTirage: secondTirageGenerer });
    }
    setGrilles([...grilles, ...nouvellesGrilles]);
    setModalGenererVisible(false);
  };

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <LottieView
              source={require('../assets/stars.json')}
              autoPlay
              loop
              style={styles.lottieBackground}
            />
            <Header onInfoPress={() => setModalInfoVisible(true)} />
            <JackpotDisplay jackpot={jackpot} jackpotAnimation={jackpotAnimation} />

            <View style={styles.inputSection}>
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAjouterModalVisible(true)}
              >
                <Text style={styles.buttonText}>Ajouter une Grille</Text>
              </TouchableOpacity>

              {/* Bouton pour générer des grilles */}
              <TouchableOpacity
                style={styles.genererButton}
                onPress={() => setModalGenererVisible(true)}
              >
                <Text style={styles.genererButtonText}>Générer des Grilles</Text>
              </TouchableOpacity>
            </View>

            {grilles.length > 0 && (
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.grillesButton}
                  onPress={() => setGrillesModalVisible(true)}
                >
                  <Text style={styles.buttonText}>({grilles.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={() => setGrilles([])}>
                  <FontAwesome name="refresh" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Déposer Solde:</Text>
              <View style={styles.depotRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={depot}
                  onChangeText={(text) => setDepot(text.replace(/[^0-9.]/g, ''))}
                  placeholder="Montant"
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity style={styles.depotButton} onPress={deposerSolde}>
                  <Text style={styles.buttonText}>€</Text>
                </TouchableOpacity>
              </View>
            </View>

            <BalanceDisplay solde={solde} />

            {isAnimating ? (
              <AnimatedCircles circleAnimations={circleAnimations} />
            ) : (
              <TouchableOpacity
                style={styles.playButton}
                onPress={jouer}
                disabled={isAnimating}
              >
                <Text style={styles.buttonText}>Jouer</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.historiqueButton}
              onPress={() => setHistoriqueModalVisible(true)}
            >
              <FontAwesome name="book" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>

          <AjouterModal
            visible={ajouterModalVisible}
            onClose={() => setAjouterModalVisible(false)}
            onAddGrille={ajouterGrille}
          />

          <InfoModal
            visible={modalInfoVisible}
            onClose={() => setModalInfoVisible(false)}
          />

          <GenerateGrillesModal
            visible={modalGenererVisible}
            onClose={() => setModalGenererVisible(false)}
            nombreGrillesAGenerer={nombreGrillesAGenerer}
            setNombreGrillesAGenerer={setNombreGrillesAGenerer}
            secondTirageGenerer={secondTirageGenerer}
            setSecondTirageGenerer={setSecondTirageGenerer}
            onGeneratePress={genererGrillesAleatoires}
          />

          <GrillesModal
            visible={grillesModalVisible}
            onClose={() => setGrillesModalVisible(false)}
            grilles={grilles}
            toggleSecondTirage={toggleSecondTirage}
          />

          <ResultsModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            isAnimating={isAnimating}
            gainDernierTour={gainDernierTour}
            totalGains={totalGains}
            meilleurGain={meilleurGain}
            totalDepense={totalDepense}
            nombreTours={nombreTours}
            numerosTirage={numerosTirage}
            numeroChanceTirage={numeroChanceTirage}
            numerosSecondTirage={numerosSecondTirage}
            resultatsGrilles={resultatsGrilles}
          />

          <LotoHistoriqueModal
            modalVisible={historiqueModalVisible}
            setModalVisible={setHistoriqueModalVisible}
            historiqueLoto={historiqueLoto}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#2C77AF',
  },
  container: {
    marginTop: 30,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 10,
  },
  grillesButton: {
    backgroundColor: '#0055A4',
    flex: 1,
    marginRight: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: '#E50000',
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  depotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 8,
    width: 150,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  depotButton: {
    backgroundColor: '#E50000',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    height: 45,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genererButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genererButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historiqueButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0055A4',
    padding: 10,
    borderRadius: 50,
  },
  lottieBackground: {
    position: 'absolute',
    width: 800,
    height: 800,
    top: '5%',
  },
});
