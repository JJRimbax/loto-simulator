// screens/LotoScreen.js

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
  Text, // Importé
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Importation des composants
import Header from '../components/Header';
import JackpotDisplay from '../components/JackpotDisplay';
import NumberInput from '../components/NumberInput';
import ChanceNumberInput from '../components/ChanceNumberInput';
import GrillesList from '../components/GrillesList';
import BalanceDisplay from '../components/BalanceDisplay';
import AnimatedCircles from '../components/AnimatedCircles';

// Importation des modals
import InfoModal from '../components/Modals/InfoModal';
import GenerateGrillesModal from '../components/Modals/GenerateGrillesModal';
import GrillesModal from '../components/Modals/GrillesModal';
import ResultsModal from '../components/Modals/ResultsModal';

// Importation des utilitaires
import { formatMontant } from '../utils/formatMontant';

// Fonctions utilitaires
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
  // Variables d'état
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

  // Références pour les animations
  const circleAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Animation pour le jackpot
  const [jackpotAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animation du jackpot
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
      ]),
    ).start();
  }, []);

  // Fonction pour lancer l'animation du tirage
  const lancerAnimationTirage = (callback) => {
    setIsAnimating(true);

    // Réinitialiser les animations des cercles
    circleAnimations.forEach((anim) => anim.setValue(0));

    // Créer les animations pour chaque cercle
    const animations = circleAnimations.map((anim) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500, // Durée pour chaque cercle
        useNativeDriver: false,
      });
    });

    // Animer les cercles les uns après les autres
    Animated.sequence(animations).start(() => {
      setIsAnimating(false);
      callback();
    });
  };

  // Fonction pour générer des numéros aléatoires (Flash) avec animation
  const flashNumeros = () => {
    let iterations = 10;
    let count = 0;

    const interval = setInterval(() => {
      const randomNumbers = getRandomUniqueNumbers(5, 1, 49);
      setNumerosInput(randomNumbers.map(num => num.toString()));

      count++;
      if (count >= iterations) {
        clearInterval(interval);
        // Définir les numéros finaux
        const numeros = getRandomUniqueNumbers(5, 1, 49);
        setNumerosInput(numeros.map(num => num.toString()));
      }
    }, 100);
  };

  const flashNumeroChance = () => {
    let iterations = 10;
    let count = 0;

    const interval = setInterval(() => {
      const randomNumber = getRandomNumber(1, 10);
      setNumeroChanceInput(randomNumber.toString());

      count++;
      if (count >= iterations) {
        clearInterval(interval);
        // Définir le numéro final
        const numero = getRandomNumber(1, 10);
        setNumeroChanceInput(numero.toString());
      }
    }, 100);
  };

  // Fonction pour ajouter une grille
  const ajouterGrille = () => {
    try {
      // Convertir les entrées en nombres entiers et supprimer les doublons
      const numerosUtilisateur = [...new Set(numerosInput.map(num => parseInt(num)))];
      const numeroChanceUtilisateur = parseInt(numeroChanceInput);

      // Valider les entrées
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

      // Ajouter la grille à la liste
      setGrilles((prevGrilles) => [
        ...prevGrilles,
        { numeros: numerosUtilisateur, chance: numeroChanceUtilisateur, secondTirage: false }
      ]);

      // Réinitialiser les entrées
      setNumerosInput(['', '', '', '', '']);
      setNumeroChanceInput('');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  // Fonction pour générer des grilles aléatoirement
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

  // Fonction pour simuler le tirage avec animation
  const jouer = () => {
    if (grilles.length === 0) {
      Alert.alert('Info', 'Veuillez ajouter au moins une grille avant de jouer.');
      return;
    }

    // Calculer le coût total
    const coutTotalGrilles = grilles.reduce(
      (acc, grille) => acc + 2 + (grille.secondTirage ? 1 : 0),
      0
    );

    if (solde < coutTotalGrilles) {
      Alert.alert('Erreur', 'Solde insuffisant pour jouer.');
      return;
    }

    // Déduire le coût du solde
    setSolde((prevSolde) => prevSolde - coutTotalGrilles);
    setTotalDepense((prevTotalDepense) => prevTotalDepense + coutTotalGrilles);
    setNombreTours((prevNombreTours) => prevNombreTours + 1);

    // Simuler le tirage principal
    const numerosTires = getRandomUniqueNumbers(5, 1, 49);
    const numeroChanceTire = getRandomNumber(1, 10);

    // Simuler le second tirage s'il y a au moins une grille avec le second tirage activé
    let numerosSecondTirage = [];
    const anySecondTirage = grilles.some(grille => grille.secondTirage);
    if (anySecondTirage) {
      numerosSecondTirage = getRandomUniqueNumbers(5, 1, 49);
    }

    // Lancer l'animation du tirage
    lancerAnimationTirage(() => {
      setNumerosTirage(numerosTires);
      setNumeroChanceTirage(numeroChanceTire);
      setNumerosSecondTirage(numerosSecondTirage);

      // Calculer les gains et préparer les résultats détaillés
      let gainTotalTour = 0;
      let newMeilleurGain = meilleurGain;
      let jackpotGagne = false;
      const tempResultatsGrilles = [];

      grilles.forEach((grille, index) => {
        // Calcul des gains principaux
        const gain = calculerGains(
          grille.numeros,
          grille.chance,
          numerosTirage,
          numeroChanceTirage
        );
        const numerosTrouves = grille.numeros.filter(num =>
          numerosTirage.includes(num)
        );

        // Vérifier si le numéro chance est trouvé
        const chanceTrouve = grille.chance === numeroChanceTirage;

        // Initialiser les variables pour le second tirage
        let gainSecond = 0;
        let numerosSecondTrouves = [];

        if (grille.secondTirage && numerosSecondTirage.length === 5) {
          // Comparer avec le second tirage global
          gainSecond = calculerGains(
            grille.numeros,
            0,
            numerosSecondTirage,
            0,
            true
          );
          numerosSecondTrouves = grille.numeros.filter(num =>
            numerosSecondTirage.includes(num)
          );
        }

        let gainTotalGrille = 0;

        // Calcul des gains
        if (gain === 'Jackpot') {
          gainTotalGrille += jackpot;
          jackpotGagne = true;
          setJackpot(2000000); // Réinitialiser le jackpot
        } else if (gain > 0) {
          gainTotalGrille += gain;
        }

        if (gainSecond > 0) {
          gainTotalGrille += gainSecond;
        }

        if (gainTotalGrille > 0) {
          gainTotalTour += gainTotalGrille;
          if (gainTotalGrille > newMeilleurGain) {
            newMeilleurGain = gainTotalGrille;
          }
        }

        // Ajout des propriétés `chance` et `secondTirage` au résultat
        tempResultatsGrilles.push({
          numeros: grille.numeros,
          chance: grille.chance, // Ajouté
          secondTirage: grille.secondTirage, // Ajouté
          numerosTrouves: numerosTrouves,
          chanceTrouve: chanceTrouve,
          gain: gain > 0 ? gain : null,
          numerosSecondTrouves: numerosSecondTrouves,
          gainSecond: gainSecond > 0 ? gainSecond : null,
        });
      });

      if (!jackpotGagne) {
        setJackpot((prevJackpot) => prevJackpot + 1000000); // Incrémenter le jackpot
      }

      // Mettre à jour les états
      setMeilleurGain((prevMeilleurGain) => (gainTotalTour > prevMeilleurGain && typeof gainTotalTour === 'number' ? gainTotalTour : prevMeilleurGain));
      setTotalGains((prevTotalGains) => prevTotalGains + gainTotalTour);
      setSolde((prevSolde) => prevSolde + gainTotalTour);
      setResultatsGrilles(tempResultatsGrilles);

      // Mise à jour du gain du dernier tirage
      setGainDernierTour(gainTotalTour);

      // Afficher la modal avec les résultats
      setModalVisible(true);
    });
  };

  // Fonction pour déposer de l'argent
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

  // Fonction pour réinitialiser les grilles
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
            setResultatsGrilles([]); // Réinitialiser les résultats
          },
        },
      ]
    );
  };

  // Fonction pour activer/désactiver le second tirage pour une grille individuelle
  const toggleSecondTirage = (index) => {
    setGrilles((prevGrilles) => {
      const newGrilles = [...prevGrilles];
      newGrilles[index].secondTirage = !newGrilles[index].secondTirage;
      return newGrilles;
    });
  };

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            {/* Header avec le titre et le bouton d'information */}
            <Header onInfoPress={() => setModalInfoVisible(true)} />

            {/* Afficher le jackpot avec animation */}
            <JackpotDisplay jackpot={jackpot} jackpotAnimation={jackpotAnimation} />

            {/* Section pour créer une grille */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Créer une Grille:</Text>

              {/* Entrée pour les numéros */}
              <NumberInput
                numeros={numerosInput}
                onChangeNumero={(index, text) => {
                  const newNumeros = [...numerosInput];
                  newNumeros[index] = text.replace(/[^0-9]/g, '');
                  setNumerosInput(newNumeros);
                }}
                onFlashPress={flashNumeros} // Passage de la fonction
              />

              {/* Entrée pour le numéro chance */}
              <ChanceNumberInput
                numeroChance={numeroChanceInput}
                onChangeChance={(text) => setNumeroChanceInput(text.replace(/[^0-9]/g, ''))}
                onFlashPress={flashNumeroChance} // Passage de la fonction
              />

              {/* Bouton pour ajouter la grille */}
              <TouchableOpacity style={styles.addButton} onPress={ajouterGrille}>
                <Text style={styles.buttonText}>Ajouter Grille</Text>
              </TouchableOpacity>

              {/* Bouton "Générer des Grilles" */}
              <TouchableOpacity
                style={styles.genererButton}
                onPress={() => setModalGenererVisible(true)}
              >
                <Text style={styles.genererButtonText}>Générer des Grilles</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton pour afficher les grilles jouées */}
            {grilles.length > 0 && (
              <TouchableOpacity
                style={styles.grillesButton}
                onPress={() => setGrillesModalVisible(true)}
              >
                <Text style={styles.buttonText}>Grilles Jouées ({grilles.length})</Text>
              </TouchableOpacity>
            )}

            {/* Bouton pour réinitialiser les grilles */}
            {grilles.length > 0 && (
              <TouchableOpacity style={styles.resetButton} onPress={reinitialiserGrilles}>
                <Text style={styles.buttonText}>Réinitialiser les Grilles</Text>
              </TouchableOpacity>
            )}

            {/* Dépôt de solde */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Déposer Solde:</Text>
              <View style={styles.numerosContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={depot}
                  onChangeText={(text) => setDepot(text.replace(/[^0-9.]/g, ''))}
                  placeholder="Montant"
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity style={styles.depotButton} onPress={deposerSolde}>
                  <Text style={styles.buttonText}>Déposer</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Afficher le solde actuel */}
            <BalanceDisplay solde={solde} />

            {/* Bouton pour jouer */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={jouer}
              disabled={isAnimating}
            >
              <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>

            {/* Animation pendant le tirage */}
            {isAnimating && (
              <AnimatedCircles circleAnimations={circleAnimations} />
            )}
          </ScrollView>

          {/* Modals */}
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
    width: 45, 
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
  grillesButton: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 5,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16, 
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#E50000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  depotButton: {
    backgroundColor: '#E50000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
});
