import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatMontant } from '../utils/formatMontant';

const ResultsModal = ({
  visible,
  onClose,
  isAnimating,
  gainDernierTour,
  totalGains,
  meilleurGain,
  totalDepense,
  nombreTours,
  numerosTirage,
  numeroChanceTirage,
  numerosSecondTirage,  // Assure-toi que ce prop est bien passé ici
  resultatsGrilles,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
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

                    {/* Afficher les numéros trouvés du second tirage si applicable */}
                    {resultat.secondTirage && numerosSecondTirage.length === 5 && (
                      <View style={styles.secondTirageSection}>
                        <Text style={styles.secondTirageTitle}>Résultat du Second Tirage:</Text>
                        <View style={styles.resultNumerosContainer}>
                          {resultat.numeros.map((num, idx) => {
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

                    {resultat.gain && (
                      <View style={styles.gainContainer}>
                        <FontAwesome name="star" size={16} color="#0055A4" style={{ marginRight: 5 }} />
                        <Text style={styles.gainText}>{formatMontant(resultat.gain)}€</Text>
                      </View>
                    )}

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
  );
};

const styles = StyleSheet.create({
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
  sectionTitleModal: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
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
  chanceBallTirageModal: {
    backgroundColor: '#E50000',
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
});

export default ResultsModal;
