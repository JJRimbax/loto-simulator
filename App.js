// App.js

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

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
          numerosTires,
          numeroChanceTire
        );
        const numerosTrouves = grille.numeros.filter(num =>
          numerosTires.includes(num)
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
        if (grille.secondTirage && displaySecondTirage) {
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
    <ScrollView contentContainerStyle={styles.container}>
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
              keyboardType='numeric'
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
            keyboardType='numeric'
            maxLength={2}
            value={numeroChanceInput}
            onChangeText={(text) =>
              setNumeroChanceInput(text.replace(/[^0-9]/g, ''))
            }
          />
          <TouchableOpacity
            style={styles.flashButton}
            onPress={flashNumeroChance}
          >
            <Text style={styles.flashButtonText}>Flash</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton pour ajouter la grille */}
      <TouchableOpacity style={styles.addButton} onPress={ajouterGrille}>
        <Text style={styles.addButtonText}>Ajouter Grille</Text>
      </TouchableOpacity>

      {/* Afficher les grilles */}
      <View style={styles.grillesSection}>
        <Text style={styles.sectionTitle}>Vos Grilles:</Text>
        {grilles.map((grille, index) => (
          <View key={index} style={styles.grille}>
            <Text style={styles.grilleText}>Grille {index + 1}:</Text>
            <Text style={styles.grilleText}>
              {grille.numeros.join(', ')} | Chance: {grille.chance}
            </Text>
            <TouchableOpacity
              onPress={() => toggleSecondTirage(index)}
              style={styles.secondTirageButton}
            >
              <Text style={styles.secondTirageText}>
                {grille.secondTirage
                  ? 'Second Tirage: Oui'
                  : 'Second Tirage: Non'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        {grilles.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={reinitialiserGrilles}
          >
            <Text style={styles.resetButtonText}>Réinitialiser les Grilles</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dépôt de solde */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Déposer Solde:</Text>
        <View style={styles.numerosContainer}>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={depot}
            onChangeText={(text) => setDepot(text.replace(/[^0-9.]/g, ''))}
          />
          <TouchableOpacity style={styles.depotButton} onPress={deposerSolde}>
            <Text style={styles.depotButtonText}>Déposer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Afficher le solde et le total dépensé */}
      <View style={styles.soldeSection}>
        <Text style={styles.soldeText}>
          💳 Solde actuel: {formatMontant(solde)}€
        </Text>
        <Text style={styles.soldeText}>
          💸 Total dépensé: {formatMontant(totalDepense)}€
        </Text>
      </View>

      {/* Bouton pour jouer */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={jouer}
        disabled={isAnimating}
      >
        <Text style={styles.playButtonText}>Jouer</Text>
      </TouchableOpacity>

      {/* Afficher les résultats */}
      {resultat !== '' && (
        <View style={styles.resultSection}>
          <Text style={styles.resultText}>{resultat}</Text>
        </View>
      )}

      {/* Afficher le tirage avec animation */}
      {isAnimating && (
        <View style={styles.tirageSection}>
          <Text style={styles.sectionTitle}>Tirage en cours...</Text>
          <Animated.View style={{ opacity: tirageAnim }}>
            <Text style={styles.tirageText}>🎲 🎲 🎲 🎲 🎲</Text>
          </Animated.View>
        </View>
      )}

      {!isAnimating && numerosTirage.length > 0 && (
        <View style={styles.tirageSection}>
          <Text style={styles.sectionTitle}>Numéros Tirés:</Text>
          <View style={styles.tirageNumeros}>
            {numerosTirage.map((num, index) => (
              <View key={index} style={styles.numeroBall}>
                <Text style={styles.numeroText}>{num}</Text>
              </View>
            ))}
            <View style={[styles.numeroBall, styles.chanceBall]}>
              <Text style={styles.numeroText}>{numeroChanceTirage}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Afficher le second tirage */}
      {displaySecondTirage && !isAnimating && (
        <View style={styles.tirageSection}>
          <Text style={styles.sectionTitle}>Second Tirage:</Text>
          <View style={styles.tirageNumeros}>
            {numerosSecondTirage.map((num, index) => (
              <View key={index} style={styles.numeroBall}>
                <Text style={styles.numeroText}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Styles pour l'application
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  jackpot: {
    fontSize: 22,
    color: '#E67E22',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2C3E50',
  },
  numerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2980B9',
    padding: 5,
    width: 50,
    marginRight: 5,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#ECF0F1',
    fontSize: 16,
  },
  flashButton: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 5,
  },
  flashButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2980B9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  grillesSection: {
    marginBottom: 20,
  },
  grille: {
    borderWidth: 1,
    borderColor: '#95A5A6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#F2F3F4',
  },
  grilleText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  secondTirageButton: {
    marginTop: 5,
  },
  secondTirageText: {
    color: '#16A085',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#C0392B',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  depotButton: {
    backgroundColor: '#8E44AD',
    padding: 10,
    borderRadius: 5,
  },
  depotButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  soldeSection: {
    marginBottom: 20,
  },
  soldeText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 5,
  },
  playButton: {
    backgroundColor: '#E67E22',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultSection: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ECF0F1',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  tirageSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  tirageText: {
    fontSize: 24,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  tirageNumeros: {
    flexDirection: 'row',
    marginTop: 10,
  },
  numeroBall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  chanceBall: {
    backgroundColor: '#E74C3C',
  },
  numeroText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});