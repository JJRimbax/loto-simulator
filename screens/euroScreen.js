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
import { FontAwesome } from '@expo/vector-icons';

const formatMontant = (montant) => montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function EuroScreen() {
  const [numerosInput, setNumerosInput] = useState(['', '', '', '', '']);
  const [etoilesInput, setEtoilesInput] = useState(['', '']);
  const [grilles, setGrilles] = useState([]);
  const [solde, setSolde] = useState(0);
  const [depot, setDepot] = useState('');
  const [resultatsGrilles, setResultatsGrilles] = useState([]);
  const [totalGains, setTotalGains] = useState(0);
  const [nombreTours, setNombreTours] = useState(0);
  const [totalDepense, setTotalDepense] = useState(0);
  const [meilleurGain, setMeilleurGain] = useState(0);
  const [jackpot, setJackpot] = useState(17000000);
  const [numerosTirage, setNumerosTirage] = useState([]);
  const [etoilesTirage, setEtoilesTirage] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [etoilePlus, setEtoilePlus] = useState(false); // Option Etoile +
  const [modalVisible, setModalVisible] = useState(false);
  const [grillesModalVisible, setGrillesModalVisible] = useState(false);
  const [modalGenererVisible, setModalGenererVisible] = useState(false);
  const [nombreGrillesAGenerer, setNombreGrillesAGenerer] = useState('');
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [gainDernierTour, setGainDernierTour] = useState(0);

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
      const etoilesUtilisateur = [...new Set(etoilesInput.map(num => parseInt(num)))];

      if (
        numerosUtilisateur.length !== 5 ||
        numerosUtilisateur.some(num => isNaN(num) || num < 1 || num > 50)
      ) {
        throw new Error('Veuillez entrer 5 numéros uniques entre 1 et 50.');
      }

      if (
        etoilesUtilisateur.length !== 2 ||
        etoilesUtilisateur.some(num => isNaN(num) || num < 1 || num > 12)
      ) {
        throw new Error('Veuillez entrer 2 étoiles entre 1 et 12.');
      }

      setGrilles((prevGrilles) => [
        ...prevGrilles,
        { numeros: numerosUtilisateur, etoiles: etoilesUtilisateur, etoilePlus }
      ]);

      setNumerosInput(['', '', '', '', '']);
      setEtoilesInput(['', '']);
      setEtoilePlus(false);
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
      setNombreGrillesAGenerer('');
      setEtoilePlus(false);
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
      (acc, grille) => acc + 2.5 + (grille.etoilePlus ? 1 : 0),
      0
    );

    if (solde < coutTotalGrilles) {
      Alert.alert('Erreur', 'Solde insuffisant pour jouer.');
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

      grilles.forEach((grille) => {
        const gain = calculerGains(
          grille.numeros,
          grille.etoiles,
          numerosTires,
          etoilesTires,
          grille.etoilePlus
        );
        const numerosTrouves = grille.numeros.filter(num => numerosTires.includes(num));
        const etoilesTrouvees = grille.etoiles.filter(etoile => etoilesTires.includes(etoile));

        let gainTotalGrille = 0;
        if (gain === 'Jackpot') {
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

  const getRandomUniqueNumbers = (count, min, max) => {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers);
  };

  const calculerGains = (numerosJoueur, etoilesJoueur, numerosTirage, etoilesTirage, etoilePlus) => {
    const nbNumerosCorrects = numerosJoueur.filter(num => numerosTirage.includes(num)).length;
    const nbEtoilesCorrectes = etoilesJoueur.filter(etoile => etoilesTirage.includes(etoile)).length;

    const gains = {
      '50': 'Jackpot',
      '51': 250000,
      '52': 35000,
      '42': 2500,
      '41': 150,
      '32': 80,
      '40': 35,
      '22': 18,
      '31': 11,
      '30': 8,
      '12': 7,
      '21': 5,
      '20': 3,
    };

    const key = `${nbNumerosCorrects}${nbEtoilesCorrectes}`;
    let gain = gains[key] || 0;

    if (etoilePlus && gain !== 'Jackpot') {
      gain = Math.floor(gain * 1.12); // Augmenter de 12%
    }

    return gain;
  };

  const flashNumeros = () => {
    setNumerosInput(getRandomUniqueNumbers(5, 1, 50).map(num => num.toString()));
  };

  const flashEtoiles = () => {
    setEtoilesInput(getRandomUniqueNumbers(2, 1, 12).map(num => num.toString()));
  };

  return (
    <View style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <FontAwesome name="ticket" size={32} color="#FFFFFF" style={styles.titleIcon} />
              <Text style={styles.title}>Simulateur Euromillion</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setModalInfoVisible(true)}
              >
                <FontAwesome name="question-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: jackpotAnimation }] }}>
              <Text style={styles.jackpot}>Jackpot: {formatMontant(jackpot)}€</Text>
            </Animated.View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Créer une Grille:</Text>

              <View>
                <Text style={styles.sectionTitle}>Numéros (1-50):</Text>
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

              <View>
                <Text style={styles.sectionTitle}>Étoiles (1-12):</Text>
                <View style={styles.numerosContainer}>
                  {etoilesInput.map((num, index) => (
                    <TextInput
                      key={index}
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={2}
                      value={num}
                      onChangeText={(text) => {
                        const newEtoiles = [...etoilesInput];
                        newEtoiles[index] = text.replace(/[^0-9]/g, '');
                        setEtoilesInput(newEtoiles);
                      }}
                    />
                  ))}
                  <TouchableOpacity style={styles.flashButtonYellow} onPress={flashEtoiles}>
                    <Text style={styles.flashButtonText}>Flash</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Option Étoile + (Augmente les gains de 12%)</Text>
                <Switch
                  value={etoilePlus}
                  onValueChange={setEtoilePlus}
                  trackColor={{ false: '#767577', true: '#FBC02D' }}
                  thumbColor={etoilePlus ? '#FFEB3B' : '#f4f3f4'}
                />
              </View>

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
              <TouchableOpacity
                style={styles.grillesButton}
                onPress={() => setGrillesModalVisible(true)}
              >
                <Text style={styles.buttonText}>Grilles Jouées ({grilles.length})</Text>
              </TouchableOpacity>
            )}

            {grilles.length > 0 && (
              <TouchableOpacity style={styles.resetButton} onPress={reinitialiserGrilles}>
                <Text style={styles.buttonText}>Réinitialiser les Grilles</Text>
              </TouchableOpacity>
            )}

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

            <View style={styles.soldeSectionMain}>
              <Text style={styles.soldeText}>💳 Solde actuel: {formatMontant(solde)}€</Text>
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={jouer}
              disabled={isAnimating}
            >
              <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>

            {isAnimating && (
              <View style={styles.animationContainer}>
                <Text style={styles.animationText}>Tirage en cours...</Text>
                <View style={styles.animationCirclesContainer}>
                  {circleAnimations.map((anim, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.animationCircle,
                        index === 6 ? styles.etoileBallTirage : null, // La dernière boule jaune
                        { opacity: anim },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modals */}
          <Modal
            visible={grillesModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setGrillesModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setGrillesModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>
                <ScrollView>
                  <Text style={styles.modalTitle}>Grilles Jouées:</Text>
                  {grilles.map((grille, index) => (
                    <View key={index} style={styles.grille}>
                      <View style={styles.grilleNumerosRow}>
                        {grille.numeros.map((num, idx) => (
                          <View key={idx} style={styles.numeroBallGrille}>
                            <Text style={styles.numeroTextGrille}>{num}</Text>
                          </View>
                        ))}
                        {grille.etoiles.map((etoile, idx) => (
                          <View key={idx} style={styles.etoileBallGrille}>
                            <Text style={styles.numeroTextGrille}>{etoile}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Étoile + :</Text>
                        <Switch
                          value={grille.etoilePlus}
                          disabled
                          trackColor={{ false: '#767577', true: '#FBC02D' }}
                          thumbColor={grille.etoilePlus ? '#FFEB3B' : '#f4f3f4'}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          <Modal
            visible={modalGenererVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalGenererVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
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

                <View style={styles.switchContainerModal}>
                  <Text style={styles.modalSwitchLabel}>Étoile + :</Text>
                  <Switch
                    value={etoilePlus}
                    onValueChange={setEtoilePlus}
                    trackColor={{ false: '#767577', true: '#FBC02D' }}
                    thumbColor={etoilePlus ? '#FFEB3B' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity style={styles.genererButtonModal} onPress={genererGrillesAleatoires}>
                  <Text style={styles.buttonText}>Générer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={modalVisible}
            transparent={true}
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

                <ScrollView>
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

                  {!isAnimating && numerosTirage.length > 0 && (
                    <View style={styles.tirageSection}>
                      <Text style={styles.sectionTitleModal}>Numéros Tirés:</Text>
                      <View style={styles.tirageNumeros}>
                        {numerosTirage.map((num, index) => (
                          <View key={index} style={styles.numeroBallTirage}>
                            <Text style={styles.numeroText}>{num}</Text>
                          </View>
                        ))}
                        {etoilesTirage.map((etoile, index) => (
                          <View key={index} style={styles.etoileBallTirage}>
                            <Text style={styles.numeroText}>{etoile}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

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
                            {resultat.etoiles.map((etoile, idx) => {
                              const estTrouveEtoile = resultat.etoilesTrouvees.includes(etoile);
                              return (
                                <View
                                  key={idx}
                                  style={[
                                    styles.etoileBallResult,
                                    estTrouveEtoile ? styles.etoileTrouve : styles.etoileNonTrouve
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.numeroTextResult,
                                      estTrouveEtoile ? styles.textTrouve : styles.textNonTrouve
                                    ]}
                                  >
                                    {etoile}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>

                          {resultat.gain && (
                            <View style={styles.gainContainer}>
                              <FontAwesome name="star" size={16} color="#0055A4" style={{ marginRight: 5 }} />
                              <Text style={styles.gainText}>{formatMontant(resultat.gain)}€</Text>
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
  flashButtonYellow: {
    backgroundColor: '#FFC107',
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
    backgroundColor: '#FFC107',
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
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  depotButton: {
    backgroundColor: '#FFC107',
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
  etoileBallTirage: {
    backgroundColor: '#FFC107',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 10,
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
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
  switchContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalSwitchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
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
  gainsInfoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  gainsInfo: {
    alignItems: 'center',
  },
  gainsTextHighlight: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  gainsText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 2,
  },
  tirageSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  tirageNumeros: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
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
  etoileBallTirage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
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
    width: '100%',
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
  etoileBallResult: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  numeroTrouve: {
    backgroundColor: '#0055A4',
    borderColor: '#0055A4',
  },
  etoileTrouve: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  numeroNonTrouve: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  etoileNonTrouve: {
    backgroundColor: '#f1c40f',
    borderColor: '#f1c40f',
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
});
