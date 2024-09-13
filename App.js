// App.js

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Fonction utilitaire pour formater les montants avec des espaces
const formatMontant = (montant) => {
  return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function App() {
  // Variables d'état
  const [numerosInput, setNumerosInput] = useState(['', '', '', '', '']);
  const [numeroChanceInput, setNumeroChanceInput] = useState('');
  const [grilles, setGrilles] = useState([]);
  const [solde, setSolde] = useState(0);
  const [depot, setDepot] = useState('');
  const [resultat, setResultat] = useState('');
  const [totalGains, setTotalGains] = useState(0);
  const [nombreTours, setNombreTours] = useState(0);
  const [totalDepense, setTotalDepense] = useState(0);
  const [meilleurGain, setMeilleurGain] = useState(0);
  const [jackpot, setJackpot] = useState(2000000);
  const [numerosTirage, setNumerosTirage] = useState([]);
  const [numeroChanceTirage, setNumeroChanceTirage] = useState(null);
  const [numerosSecondTirage, setNumerosSecondTirage] = useState([]);
  const [displaySecondTirage, setDisplaySecondTirage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [grillesModalVisible, setGrillesModalVisible] = useState(false); // Nouvelle modal pour les grilles jouées

  // Références pour les animations
  const tirageAnim = useRef(new Animated.Value(0)).current;

  // Fonction pour lancer l'animation du tirage
  const lancerAnimationTirage = (callback) => {
    setIsAnimating(true);
    tirageAnim.setValue(0);
    Animated.timing(tirageAnim, {
      toValue: 1,
      duration: 3000, // Durée totale de l'animation (3 secondes)
      useNativeDriver: false,
    }).start(() => {
      setIsAnimating(false);
      callback();
    });
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
      setGrilles([...grilles, { numeros: numerosUtilisateur, chance: numeroChanceUtilisateur, secondTirage: false }]);

      // Réinitialiser les entrées
      setNumerosInput(['', '', '', '', '']);
      setNumeroChanceInput('');
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
    setSolde(solde - coutTotalGrilles);
    setTotalDepense(totalDepense + coutTotalGrilles);
    setNombreTours(nombreTours + 1);

    // Simuler le tirage
    const numerosTires = getRandomUniqueNumbers(5, 1, 49);
    const numeroChanceTire = getRandomNumber(1, 10);

    // Lancer l'animation du tirage
    lancerAnimationTirage(() => {
      setNumerosTirage(numerosTires);
      setNumeroChanceTirage(numeroChanceTire);

      // Gérer le second tirage si au moins une grille l'a choisi
      const anySecondTirage = grilles.some(grille => grille.secondTirage);
      if (anySecondTirage) {
        const numerosSecond = getRandomUniqueNumbers(5, 1, 49);
        setNumerosSecondTirage(numerosSecond);
        setDisplaySecondTirage(true);
      } else {
        setNumerosSecondTirage([]);
        setDisplaySecondTirage(false);
      }

      // Calculer les gains
      let gainTotalTour = 0;
      let newMeilleurGain = meilleurGain;
      let messageResultat = '';
      let jackpotGagne = false;

      grilles.forEach((grille, index) => {
        const gain = calculerGains(
          grille.numeros,
          grille.chance,
          numerosTirage,
          numeroChanceTire
        );
        const numerosTrouves = grille.numeros.filter(num =>
          numerosTirage.includes(num)
        );

        if (gain === 'Jackpot') {
          gainTotalTour += jackpot;
          jackpotGagne = true;
          setJackpot(2000000); // Réinitialiser le jackpot
          messageResultat += `🎉 JACKPOT ! Vous avez gagné à la grille ${index + 1}\n`;
        } else if (gain > 0) {
          gainTotalTour += gain;
          messageResultat += `✅ Grille ${index + 1}: Vous avez trouvé ${numerosTrouves.length} numéro(s): ${numerosTrouves.join(
            ', '
          )}. Gains: ${gain}€\n`;
        } else {
          messageResultat += `❌ Grille ${index + 1}: Aucun numéro trouvé.\n`;
        }

        if (gain > newMeilleurGain && typeof gain === 'number') {
          newMeilleurGain = gain;
        }

        // Gérer les gains du second tirage
        if (grille.secondTirage && numerosSecondTirage.length === 5) {
          const gainSecond = calculerGains(
            grille.numeros,
            0,
            numerosSecondTirage,
            0,
            true
          );
          gainTotalTour += gainSecond;
          if (gainSecond > 0) {
            messageResultat += `🎯 Grille ${index + 1}: Gains du second tirage: ${gainSecond}€\n`;
          }
        }
      });

      if (!jackpotGagne) {
        setJackpot(jackpot + 1000000); // Incrémenter le jackpot de 1 million
      }

      // Mettre à jour les états
      setMeilleurGain(newMeilleurGain);
      setTotalGains(totalGains + gainTotalTour);
      setSolde(solde + gainTotalTour);

      // Afficher les résultats
      setResultat(
        `🔔 Tour n°${nombreTours}\n\n💰 Gain de ce tour: ${formatMontant(
          gainTotalTour
        )}€\n🏆 Meilleur gain: ${formatMontant(
          newMeilleurGain
        )}€\n🎖️ Gains cumulés: ${formatMontant(
          totalGains + gainTotalTour
        )}€\n\n${messageResultat}`
      );

      // Réinitialiser les grilles
      setGrilles([]);

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
      setSolde(solde + montant);
      setDepot('');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  // Fonction pour réinitialiser les grilles
  const reinitialiserGrilles = () => {
    setGrilles([]);
  };

  // Fonction pour activer/désactiver le second tirage
  const toggleSecondTirage = (index) => {
    const newGrilles = [...grilles];
    newGrilles[index].secondTirage = !newGrilles[index].secondTirage;
    setGrilles(newGrilles);
  };

  // Fonctions utilitaires pour générer des nombres aléatoires
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

  // Fonction pour calculer les gains
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

  // Fonction pour générer des numéros aléatoires (Flash)
  const flashNumeros = () => {
    const numeros = getRandomUniqueNumbers(5, 1, 49);
    setNumerosInput(numeros.map(num => num.toString()));
  };

  const flashNumeroChance = () => {
    const numero = getRandomNumber(1, 10);
    setNumeroChanceInput(numero.toString());
  };

  return (
    <LinearGradient colors={['#0055A4', '#FFFFFF']} style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Simulateur de Loto</Text>

            {/* Afficher le jackpot */}
            <Text style={styles.jackpot}>Jackpot: {formatMontant(jackpot)}€</Text>

            {/* Entrée pour les numéros */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Numéros (1-49):</Text>
              <View style={styles.numerosContainer}>
                {numerosInput.map((num, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={2}
                    value={num}
                    onChangeText={(text) => {
                      const newNumeros = [...numerosInput];
                      newNumeros[index] = text.replace(/[^0-9]/g, '');
                      setNumerosInput(newNumeros);
                    }}
                  />
                ))}
                <TouchableOpacity style={styles.flashButton} onPress={flashNumeros}>
                  <Text style={styles.flashButtonText}>Flash</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Entrée pour le numéro chance */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Numéro Chance (1-10):</Text>
              <View style={styles.numerosContainer}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                  value={numeroChanceInput}
                  onChangeText={(text) => setNumeroChanceInput(text.replace(/[^0-9]/g, ''))}
                />
                <TouchableOpacity style={styles.flashButton} onPress={flashNumeroChance}>
                  <Text style={styles.flashButtonText}>Flash</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton pour ajouter la grille */}
            <TouchableOpacity style={styles.addButton} onPress={ajouterGrille}>
              <Text style={styles.buttonText}>Ajouter Grille</Text>
            </TouchableOpacity>

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

            {/* Afficher le solde et le total dépensé */}
            <View style={styles.soldeSection}>
              <Text style={styles.soldeText}>💳 Solde actuel: {formatMontant(solde)}€</Text>
              <Text style={styles.soldeText}>💸 Total dépensé: {formatMontant(totalDepense)}€</Text>
            </View>

            {/* Bouton pour jouer */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={jouer}
              disabled={isAnimating}
            >
              <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Modal pour afficher les grilles jouées */}
          <Modal
            visible={grillesModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setGrillesModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Bouton pour fermer la modal */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setGrillesModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>

                <ScrollView>
                  <Text style={styles.sectionTitle}>Grilles Jouées:</Text>
                  {grilles.map((grille, index) => (
                    <View key={index} style={styles.grille}>
                      <View style={styles.grilleNumeros}>
                        {grille.numeros.map((num, idx) => (
                          <View key={idx} style={styles.numeroBallGrille}>
                            <Text style={styles.numeroTextGrille}>{num}</Text>
                          </View>
                        ))}
                        <View style={[styles.numeroBallGrille, styles.chanceBallGrille]}>
                          <Text style={styles.numeroTextGrille}>{grille.chance}</Text>
                        </View>
                      </View>
                      <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Second Tirage:</Text>
                        <Switch
                          value={grille.secondTirage}
                          onValueChange={() => toggleSecondTirage(index)}
                          trackColor={{ false: '#767577', true: '#81b0ff' }}
                          thumbColor={grille.secondTirage ? '#f5dd4b' : '#f4f3f4'}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Modal pour afficher les résultats */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Bouton pour fermer la modal */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>

                <ScrollView>
                  {/* Afficher le tirage avec animation */}
                  {isAnimating && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitle}>Tirage en cours...</Text>
                      <Animated.View style={{ opacity: tirageAnim }}>
                        <Text style={styles.tirageText}>🎲 🎲 🎲 🎲 🎲</Text>
                      </Animated.View>
                    </View>
                  )}

                  {/* Afficher les numéros tirés */}
                  {!isAnimating && numerosTirage.length > 0 && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitle}>Numéros Tirés:</Text>
                      <View style={styles.tirageNumeros}>
                        {numerosTirage.map((num, index) => (
                          <View key={index} style={styles.numeroBallTirage}>
                            <Text style={styles.numeroText}>{num}</Text>
                          </View>
                        ))}
                        <View style={[styles.numeroBallTirage, styles.chanceBallTirage]}>
                          <Text style={styles.numeroText}>{numeroChanceTirage}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Afficher le second tirage */}
                  {displaySecondTirage && numerosSecondTirage.length === 5 && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitle}>Second Tirage:</Text>
                      <View style={styles.tirageNumeros}>
                        {numerosSecondTirage.map((num, index) => (
                          <View key={index} style={styles.numeroBallTirage}>
                            <Text style={styles.numeroText}>{num}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Afficher les résultats */}
                  {resultat !== '' && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultText}>{resultat}</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

// Styles pour l'application
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    marginTop: 100,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1, // Permet au contenu de prendre toute la hauteur disponible
  },
  title: {
    fontSize: 24, // Taille uniforme
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  jackpot: {
    fontSize: 20, // Taille uniforme
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16, // Taille uniforme
    marginBottom: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
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
    width: 45, // Taille uniforme
    margin: 3,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 16, // Taille uniforme
  },
  flashButton: {
    backgroundColor: '#E50000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  flashButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, // Taille uniforme
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
    fontSize: 16, // Taille uniforme
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
  soldeSection: {
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
  grille: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '90%',
    alignItems: 'center',
  },
  grilleNumeros: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numeroBallGrille: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4', // Bleu pour les numéros principaux
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#0055A4',
  },
  chanceBallGrille: {
    backgroundColor: '#E50000', // Rouge pour le numéro chance
    borderColor: '#E50000',
  },
  numeroTextGrille: {
    color: '#FFFFFF', // Texte en blanc pour le numéro chance
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  tirageSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  tirageText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  tirageNumeros: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numeroBallTirage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0055A4', // Bleu pour les numéros tirés
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  chanceBallTirage: {
    backgroundColor: '#E50000', // Rouge pour le numéro chance
  },
  numeroText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 14,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
});