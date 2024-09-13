// App.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';

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

  // Fonction pour ajouter une grille
  const ajouterGrille = () => {
    try {
      // Convertir les entrées en nombres entiers et supprimer les doublons
      const numerosUtilisateur = [...new Set(numerosInput.map(num => parseInt(num)))];
      const numeroChanceUtilisateur = parseInt(numeroChanceInput);

      // Valider les entrées
      if (numerosUtilisateur.length !== 5 || numerosUtilisateur.some(num => isNaN(num) || num < 1 || num > 49)) {
        throw new Error('Veuillez entrer 5 numéros uniques entre 1 et 49.');
      }
      if (isNaN(numeroChanceUtilisateur) || numeroChanceUtilisateur < 1 || numeroChanceUtilisateur > 10) {
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

  // Fonction pour simuler le tirage
  const jouer = () => {
    if (grilles.length === 0) {
      Alert.alert('Info', 'Veuillez ajouter au moins une grille avant de jouer.');
      return;
    }

    // Calculer le coût total
    const coutTotalGrilles = grilles.reduce((acc, grille) => acc + 2 + (grille.secondTirage ? 1 : 0), 0);

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
      const gain = calculerGains(grille.numeros, grille.chance, numerosTires, numeroChanceTire);
      const numerosTrouves = grille.numeros.filter(num => numerosTires.includes(num));

      if (gain === 'Jackpot') {
        gainTotalTour += jackpot;
        jackpotGagne = true;
        setJackpot(2000000); // Réinitialiser le jackpot
        messageResultat += `JACKPOT! Vous avez gagné à la grille ${index + 1}\n`;
      } else if (gain > 0) {
        gainTotalTour += gain;
        messageResultat += `Bravo! Vous avez trouvé ${numerosTrouves.length} numéros: ${numerosTrouves.join(', ')} à la grille ${index + 1}. Vos gains s'élèvent à ${gain}€\n`;
      } else {
        messageResultat += `Vous n'avez pas trouvé de numéros à la grille ${index + 1}\n`;
      }

      if (gain > newMeilleurGain) {
        newMeilleurGain = gain;
      }

      // Gérer les gains du second tirage
      if (grille.secondTirage && displaySecondTirage) {
        const gainSecond = calculerGains(grille.numeros, 0, numerosSecondTirage, 0, true);
        gainTotalTour += gainSecond;
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
    setResultat(`Tour n°${nombreTours}\nGain de ce tour: ${formatMontant(gainTotalTour)}€\nMeilleur gain: ${formatMontant(newMeilleurGain)}€\nGains cumulés: ${formatMontant(totalGains + gainTotalTour)}€\n\nRésultats:\n${messageResultat}`);

    // Réinitialiser les grilles
    setGrilles([]);
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
  const calculerGains = (numerosJoueur, numeroChanceJoueur, numerosTirage, numeroChanceTirage, secondTirage = false) => {
    const nbNumerosCorrects = numerosJoueur.filter(num => numerosTirage.includes(num)).length;
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
          <Button title='Flash' onPress={flashNumeros} />
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
            onChangeText={(text) => setNumeroChanceInput(text.replace(/[^0-9]/g, ''))}
          />
          <Button title='Flash' onPress={flashNumeroChance} />
        </View>
      </View>

      {/* Bouton pour ajouter la grille */}
      <Button title='Ajouter Grille' onPress={ajouterGrille} />

      {/* Afficher les grilles */}
      <View style={styles.grillesSection}>
        <Text style={styles.sectionTitle}>Vos Grilles:</Text>
        {grilles.map((grille, index) => (
          <View key={index} style={styles.grille}>
            <Text>Grille {index + 1}:</Text>
            <Text>{grille.numeros.join(', ')} | Chance: {grille.chance}</Text>
            <TouchableOpacity onPress={() => toggleSecondTirage(index)}>
              <Text style={styles.secondTirage}>{grille.secondTirage ? 'Second Tirage: Oui' : 'Second Tirage: Non'}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Button title='Réinitialiser les Grilles' onPress={reinitialiserGrilles} />
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
          <Button title='Déposer' onPress={deposerSolde} />
        </View>
      </View>

      {/* Afficher le solde et le total dépensé */}
      <Text>Solde actuel: {formatMontant(solde)}€</Text>
      <Text>Total dépensé: {formatMontant(totalDepense)}€</Text>

      {/* Bouton pour jouer */}
      <Button title='Jouer' onPress={jouer} />

      {/* Afficher les résultats */}
      {resultat !== '' && (
        <View style={styles.resultSection}>
          <Text style={styles.resultText}>{resultat}</Text>
        </View>
      )}

      {/* Afficher le tirage */}
      {numerosTirage.length > 0 && (
        <View style={styles.tirageSection}>
          <Text style={styles.sectionTitle}>Numéros Tirés:</Text>
          <Text>{numerosTirage.join(', ')}</Text>
          <Text>Numéro Chance: {numeroChanceTirage}</Text>
        </View>
      )}

      {/* Afficher le second tirage */}
      {displaySecondTirage && (
        <View style={styles.tirageSection}>
          <Text style={styles.sectionTitle}>Second Tirage:</Text>
          <Text>{numerosSecondTirage.join(', ')}</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  jackpot: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  numerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 40,
    marginRight: 5,
    textAlign: 'center',
  },
  grillesSection: {
    marginBottom: 20,
  },
  grille: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  secondTirage: {
    color: 'blue',
    marginTop: 5,
  },
  resultSection: {
    marginVertical: 20,
  },
  resultText: {
    fontSize: 16,
  },
  tirageSection: {
    marginBottom: 20,
  },
});