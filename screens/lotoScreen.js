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
  TextInput,
  Text
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import pour utiliser l'icône

import Header from '../components/Header';
import JackpotDisplay from '../components/JackpotDisplay';
import NumberInput from '../components/NumberInput';
import ChanceNumberInput from '../components/ChanceNumberInput';
import BalanceDisplay from '../components/BalanceDisplay';
import AnimatedCircles from '../components/AnimatedCircles';
import InfoModal from '../components/InfoModal';
import GenerateGrillesModal from '../components/GenerateGrillesModal';
import GrillesModal from '../components/GrillesModal';
import ResultsModal from '../components/ResultsModal';

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
  const [numerosInput, setNumerosInput] = useState(['', '', '', '', '']);
  const [numeroChanceInput, setNumeroChanceInput] = useState('');
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

  const ajouterGrille = () => {
    try {
      const numerosUtilisateur = [...new Set(numerosInput.map(num => parseInt(num)))];
      const numeroChanceUtilisateur = parseInt(numeroChanceInput);

      if (
        numerosUtilisateur.length !== 5 ||
        numerosUtilisateur.some(num => isNaN(num) || num < 1 || num > 49)
      ) {
        throw new Error('Veuillez entrer 5 numéros uniques entre 1 et 49.');
      }
      if (
        isNaN(numeroChanceUtilisateur) ||
        numeroChanceUtilisateur < 1 ||
        numeroChanceUtilisateur > 10
      ) {
        throw new Error('Veuillez entrer un numéro chance entre 1 et 10.');
      }

      setGrilles((prevGrilles) => [
        ...prevGrilles,
        { numeros: numerosUtilisateur, chance: numeroChanceUtilisateur, secondTirage: false }
      ]);

      setNumerosInput(['', '', '', '', '']);
      setNumeroChanceInput('');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const genererGrillesAleatoires = () => {
    try {
      const nombre = parseInt(nombreGrillesAGenerer);
      if (isNaN(nombre) || nombre < 1 || nombre > 1000) {
        throw new Error('Veuillez entrer un nombre entre 1 et 1000.');
      }

      const nouvellesGrilles = [];
      for (let i = 0; i < nombre; i++) {
        const numeros = getRandomUniqueNumbers(5, 1, 49);
        const chance = getRandomNumber(1, 10);
        nouvellesGrilles.push({
          numeros: numeros,
          chance: chance,
          secondTirage: secondTirageGenerer,
        });
      }

      setGrilles((prevGrilles) => [...prevGrilles, ...nouvellesGrilles]);
      setModalGenererVisible(false);
      setNombreGrillesAGenerer('');
      setSecondTirageGenerer(false);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
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

      let gainTotalTour = 0;
      let newMeilleurGain = meilleurGain;
      let jackpotGagne = false;
      const tempResultatsGrilles = [];

      grilles.forEach((grille) => {
        const gain = calculerGains(grille.numeros, grille.chance, numerosTires, numeroChanceTire);
        const numerosTrouves = grille.numeros.filter(num => numerosTires.includes(num));
        const chanceTrouve = grille.chance === numeroChanceTire;

        let gainSecond = 0;
        let numerosSecondTrouves = [];

        if (grille.secondTirage) {
          gainSecond = calculerGains(
            grille.numeros,
            0,
            numerosSecondTires,
            0,
            true
          );
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

      if (!jackpotGagne) {
        setJackpot((prevJackpot) => prevJackpot + 1000000);
      }

      setMeilleurGain(newMeilleurGain);
      setTotalGains((prevTotalGains) => prevTotalGains + gainTotalTour);
      setSolde((prevSolde) => prevSolde + gainTotalTour);
      setResultatsGrilles(tempResultatsGrilles);

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

  const reinitialiserGrilles = () => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous vraiment réinitialiser toutes les grilles?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          onPress: () => {
            setGrilles([]);
            setResultatsGrilles([]);
          },
        },
      ]
    );
  };

  const toggleSecondTirage = (index) => {
    setGrilles((prevGrilles) => {
      const newGrilles = [...prevGrilles];
      newGrilles[index].secondTirage = !newGrilles[index].secondTirage;
      return newGrilles;
    });
  };

  const flashNumeros = () => {
    const numerosAleatoires = getRandomUniqueNumbers(5, 1, 49).map(num => num.toString());
    setNumerosInput(numerosAleatoires);
  };

  const flashNumeroChance = () => {
    const numeroAleatoire = getRandomNumber(1, 10).toString();
    setNumeroChanceInput(numeroAleatoire);
  };

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Header onInfoPress={() => setModalInfoVisible(true)} />
            <JackpotDisplay jackpot={jackpot} jackpotAnimation={jackpotAnimation} />

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Créer une Grille:</Text>
              <NumberInput
                numeros={numerosInput}
                onChangeNumero={(index, text) => {
                  const newNumeros = [...numerosInput];
                  newNumeros[index] = text.replace(/[^0-9]/g, '');
                  setNumerosInput(newNumeros);
                }}
                onFlashPress={flashNumeros}
              />
              <ChanceNumberInput
                numeroChance={numeroChanceInput}
                onChangeChance={(text) => setNumeroChanceInput(text.replace(/[^0-9]/g, ''))}
                onFlashPress={flashNumeroChance}
              />
              <TouchableOpacity style={styles.addButton} onPress={ajouterGrille}>
                <Text style={styles.buttonText}>Ajouter Grille</Text>
              </TouchableOpacity>
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
                  <Text style={styles.buttonText}>Grilles Jouées ({grilles.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={reinitialiserGrilles}>
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
          </ScrollView>

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
  gainsTextHighlight: {
    fontSize: 16,
    color: '#28a745',
    marginVertical: 2,
    fontWeight: 'bold',
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
  depotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  numerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 8,
    width: 150,
    margin: 3,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#E50000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  genererButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  genererButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 10,
  },
  grillesButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 15, // Réduit la largeur
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#E50000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  depotButton: {
    backgroundColor: '#E50000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  soldeSectionMain: {
    alignItems: 'center',
    marginVertical: 10,
  },
  soldeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  playButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
});
