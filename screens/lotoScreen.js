import React, { useState, useRef, useEffect } from 'react';
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
import { FontAwesome } from '@expo/vector-icons'; // Pour les icônes

// Fonction utilitaire pour formater les montants avec des espaces
const formatMontant = (montant) => {
  return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function LotoScreen() {
  // Variables d'état
  const [numerosInput, setNumerosInput] = useState(['', '', '', '', '']);
  const [numeroChanceInput, setNumeroChanceInput] = useState('');
  const [grilles, setGrilles] = useState([]);
  const [solde, setSolde] = useState(0);
  const [depot, setDepot] = useState('');
  const [resultatsGrilles, setResultatsGrilles] = useState([]); // Résultats détaillés des grilles
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
  const [grillesModalVisible, setGrillesModalVisible] = useState(false); // Modal pour les grilles jouées
  const [modalGenererVisible, setModalGenererVisible] = useState(false); // Modal pour générer les grilles
  const [nombreGrillesAGenerer, setNombreGrillesAGenerer] = useState('');
  const [secondTirageGenerer, setSecondTirageGenerer] = useState(false); // Switch pour le second tirage dans la modal de génération
  const [modalInfoVisible, setModalInfoVisible] = useState(false); // Modal pour les informations du jeu
  const [gainDernierTour, setGainDernierTour] = useState(0); // Nouveau : Gain du dernier tirage

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
          numerosTires,
          numeroChanceTire
        );
        const numerosTrouves = grille.numeros.filter(num =>
          numerosTires.includes(num)
        );

        // Vérifier si le numéro chance est trouvé
        const chanceTrouve = grille.chance === numeroChanceTire;

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

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            {/* Header avec le titre et le bouton d'information */}
            <View style={styles.header}>
              <FontAwesome name="ticket" size={32} color="#FFFFFF" style={styles.titleIcon} />
              <Text style={styles.title}>Simulateur de Loto</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setModalInfoVisible(true)}
              >
                <FontAwesome name="question-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Afficher le jackpot avec animation */}
            <Animated.View style={{ transform: [{ scale: jackpotAnimation }] }}>
              <Text style={styles.jackpot}>Jackpot: {formatMontant(jackpot)}€</Text>
            </Animated.View>

            {/* Section pour créer une grille */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Créer une Grille:</Text>

              {/* Entrée pour les numéros */}
              <View>
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
                  <TouchableOpacity style={styles.flashButtonBlue} onPress={flashNumeros}>
                    <Text style={styles.flashButtonText}>Flash</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Entrée pour le numéro chance */}
              <View>
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
            <View style={styles.soldeSectionMain}>
              <Text style={styles.soldeText}>💳 Solde actuel: {formatMontant(solde)}€</Text>
            </View>

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
              <View style={styles.animationContainer}>
                <Text style={styles.animationText}>Tirage en cours...</Text>
                <View style={styles.animationCirclesContainer}>
                  {circleAnimations.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.animationCircle,
                        index === 5 ? styles.chanceBallTirage : null, 
                        { opacity: anim },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modals */}
          {/* Modal pour les informations du jeu */}
          <Modal
            visible={modalInfoVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalInfoVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Bouton pour fermer la modal */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalInfoVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>

                <ScrollView>
                  <Text style={styles.modalTitle}>Informations sur le Jeu</Text>
                  <Text style={styles.modalText}>
                    Prix par grille :
                    {'\n'}- Grille simple : 2€
                    {'\n'}- Option Second Tirage : +1€ par grille
                    {'\n\n'}Gains possibles :
                    {'\n'}- 5 numéros + Numéro Chance : Jackpot
                    {'\n'}- 5 numéros : 100 000€
                    {'\n'}- 4 numéros + Numéro Chance : 1 000€
                    {'\n'}- 4 numéros : 400€
                    {'\n'}- 3 numéros + Numéro Chance : 50€
                    {'\n'}- 3 numéros : 20€
                    {'\n'}- 2 numéros + Numéro Chance : 10€
                    {'\n'}- 2 numéros : 4€
                    {'\n'}- 1 numéro + Numéro Chance ou Numéro Chance seul : 2€
                    {'\n\n'}Gains Second Tirage :
                    {'\n'}- 5 numéros : 100 000€
                    {'\n'}- 4 numéros : 1 000€
                    {'\n'}- 3 numéros : 10€
                    {'\n'}- 2 numéros : 2€
                  </Text>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Modal pour générer des grilles */}
          <Modal
            visible={modalGenererVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalGenererVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Bouton pour fermer la modal */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalGenererVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Générer des Grilles Aléatoires</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={nombreGrillesAGenerer}
                  onChangeText={(text) => setNombreGrillesAGenerer(text.replace(/[^0-9]/g, ''))}
                  placeholder="Entrez un nombre de grilles à générer"
                  placeholderTextColor="#AAAAAA"
                />

                {/* Switch pour le second tirage */}
                <View style={styles.switchContainerModal}>
                  <Text style={styles.modalSwitchLabel}>Second Tirage:</Text>
                  <Switch
                    value={secondTirageGenerer}
                    onValueChange={(value) => setSecondTirageGenerer(value)}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={secondTirageGenerer ? '#f5dd4b' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity style={styles.genererButtonModal} onPress={genererGrillesAleatoires}>
                  <Text style={styles.buttonText}>Générer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
                      <View style={styles.grilleNumerosRow}>
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
                  {/* Informations de gains dans la modal */}
                  {!isAnimating && (
                    <View style={styles.gainsInfoSection}>
                      <Text style={styles.sectionTitleModal}>Résumé des Gains:</Text>
                      <View style={styles.gainsInfo}>
                        <Text style={styles.gainsTextHighlight}>💵 Gain de ce tirage: {formatMontant(gainDernierTour)}€</Text>
                        <Text style={styles.gainsText}>💰 Cumul des gains: {formatMontant(totalGains)}€</Text>
                        <Text style={styles.gainsText}>🏆 Meilleur gain: {formatMontant(meilleurGain)}€</Text>
                        <Text style={styles.gainsText}>💸 Total dépensé: {formatMontant(totalDepense)}€</Text>
                        <Text style={styles.gainsText}>🎟️ Nombre de tours: {nombreTours}</Text>
                      </View>
                    </View>
                  )}

                  {/* Afficher les numéros tirés */}
                  {!isAnimating && numerosTirage.length > 0 && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitleModal}>Numéros Tirés:</Text>
                      <View style={styles.tirageNumeros}>
                        {numerosTirage.map((num, index) => (
                          <View key={index} style={styles.numeroBallTirage}>
                            <Text style={styles.numeroText}>{num}</Text>
                          </View>
                        ))}
                        <View style={[styles.numeroBallTirage, styles.chanceBallTirageModal]}>
                          <Text style={styles.numeroText}>{numeroChanceTirage}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Afficher le second tirage */}
                  {!isAnimating && numerosSecondTirage.length === 5 && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitleModal}>Second Tirage:</Text>
                      <View style={styles.tirageNumeros}>
                        {numerosSecondTirage.map((num, index) => (
                          <View key={index} style={styles.numeroBallTirage}>
                            <Text style={styles.numeroText}>{num}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Afficher les résultats détaillés des grilles */}
                  {resultatsGrilles.length > 0 && (
                    <View style={styles.resultSection}>
                      <Text style={styles.sectionTitleModal}>Résultats des Grilles:</Text>
                      {resultatsGrilles.map((resultat, index) => (
                        <View key={index} style={styles.resultGrille}>
                          <Text style={styles.resultGrilleTitle}>Grille {index + 1}:</Text>
                          <View style={styles.resultNumerosContainer}>
                            {resultat.numeros.map((num, idx) => {
                              const estTrouve = resultat.numerosTrouves.includes(num);
                              return (
                                <View
                                  key={idx}
                                  style={[
                                    styles.numeroBallResult,
                                    estTrouve ? styles.numeroTrouve : styles.numeroNonTrouve
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.numeroTextResult,
                                      estTrouve ? styles.textTrouve : styles.textNonTrouve
                                    ]}
                                  >
                                    {num}
                                  </Text>
                                </View>
                              );
                            })}
                            {/* Afficher le numéro chance avec la couleur conditionnelle */}
                            <View style={[
                              styles.numeroBallResult,
                              resultat.chanceTrouve ? styles.chanceBallResult : styles.chanceBallNonTrouve
                            ]}>
                              <Text style={[
                                styles.numeroTextResult,
                                resultat.chanceTrouve ? styles.textChanceResult : styles.textChanceNonTrouve
                              ]}>
                                {resultat.chance}
                              </Text>
                            </View>
                          </View>

                          {/* Afficher le second tirage pour cette grille */}
                          {resultat.secondTirage && numerosSecondTirage.length === 5 && (
                            <View style={styles.secondTirageSection}>
                              <Text style={styles.secondTirageTitle}>Résultat du Second Tirage:</Text>
                              <View style={styles.resultNumerosContainer}>
                                {numerosSecondTirage.map((num, idx) => {
                                  const estTrouveSecond = resultat.numerosSecondTrouves.includes(num);
                                  return (
                                    <View
                                      key={idx}
                                      style={[
                                        styles.numeroBallResult,
                                        estTrouveSecond ? styles.numeroTrouve : styles.numeroNonTrouve
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.numeroTextResult,
                                          estTrouveSecond ? styles.textTrouve : styles.textNonTrouve
                                        ]}
                                      >
                                        {num}
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            </View>
                          )}

                          {/* Afficher les gains principaux */}
                          {resultat.gain && (
                            <View style={styles.gainContainer}>
                              <FontAwesome name="star" size={16} color="#0055A4" style={{ marginRight: 5 }} />
                              <Text style={styles.gainText}>{formatMontant(resultat.gain)}€</Text>
                            </View>
                          )}

                          {/* Afficher les gains du second tirage */}
                          {resultat.gainSecond && (
                            <View style={styles.gainSecondContainer}>
                              <FontAwesome name="star" size={16} color="#E50000" style={{ marginRight: 5 }} />
                              <Text style={styles.gainSecondText}>{formatMontant(resultat.gainSecond)}€</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
    marginTop: 50,
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
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  titleIcon: {
    position: 'absolute',
    left: 10,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24, 
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  jackpot: {
    fontSize: 20, 
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
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitleModal: {
    fontSize: 16, 
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
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
  flashButton: {
    backgroundColor: '#E50000', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  flashButtonBlue: {
    backgroundColor: '#0055A4', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  flashButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, 
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
  animationContainer: {
    marginTop: 10, 
    alignItems: 'center',
  },
  animationText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  animationCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  animationCircle: {
    width: 30, 
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4',
    margin: 5,
  },
  chanceBallTirage: {
    backgroundColor: '#E50000', 
  },
  grille: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%', 
    alignItems: 'center',
  },
  grilleNumerosRow: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'nowrap', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, 
  },
  numeroBallGrille: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4', 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#0055A4',
  },
  chanceBallGrille: {
    backgroundColor: '#E50000', 
    borderColor: '#E50000',
  },
  numeroTextGrille: {
    color: '#FFFFFF', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  modalSwitchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
  tirageSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  numeroBallTirage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0055A4', 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  chanceBallTirageModal: {
    backgroundColor: '#E50000',
  },
  numeroText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gainsInfoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  gainsInfo: {
    alignItems: 'center',
  },
  gainsText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 2,
  },
  resultSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    width: '100%',
  },
  resultText: {
    fontSize: 14,
    color: '#333333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    maxHeight: '80%',
    alignItems: 'center',
    width: '90%', 
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 8,
    width: '80%', 
    marginVertical: 10,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'left',
    marginVertical: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
  tirageNumeros: {
    flexDirection: 'row',
    flexWrap: 'nowrap', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultGrille: {
    marginBottom: 15,
  },
  resultGrilleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  resultNumerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 5,
  },
  numeroBallResult: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#0055A4',
  },
  numeroTrouve: {
    backgroundColor: '#0055A4', 
    borderColor: '#0055A4',
  },
  numeroNonTrouve: {
    backgroundColor: '#6c757d', 
    borderColor: '#6c757d',
  },
  numeroTextResult: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textTrouve: {
    color: '#FFFFFF',
  },
  textNonTrouve: {
    color: '#FFFFFF',
  },
  chanceBallResult: {
    backgroundColor: '#E50000',
    borderColor: '#E50000',
  },
  chanceBallNonTrouve: {
    backgroundColor: 'rgba(229, 0, 0, 0.5)', 
    borderColor: 'rgba(229, 0, 0, 0.5)',
  },
  textChanceResult: {
    color: '#FFFFFF',
  },
  textChanceNonTrouve: {
    color: '#FFFFFF',
  },
  gainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#0055A4',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  gainText: {
    fontSize: 14,
    color: '#0055A4',
    fontWeight: 'bold',
  },
  gainSecondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#E50000',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  gainSecondText: {
    fontSize: 14,
    color: '#E50000',
    fontWeight: 'bold',
  },
  secondTirageSection: {
    marginTop: 10,
    marginBottom: 5,
  },
  secondTirageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  genererButtonModal: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
});
