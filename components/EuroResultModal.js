import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatMontant } from '../utils/formatMontant';

const EuroResultModal = ({ modalVisible, resultatsGrilles, gainDernierTour, totalGains, meilleurGain, totalDepense, nombreTours, numerosTirage, etoilesTirage, setModalVisible }) => {
  const getGainColor = (gain) => {
    if (gain >= 1000) {
      return styles.gainHigh;
    } else if (gain >= 100) {
      return styles.gainMedium;
    } else {
      return styles.gainLow;
    }
  };

  return (
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
            <View style={styles.gainsInfoSection}>
              <Text style={styles.sectionTitleModal}>Résumé des Gains:</Text>
              <View style={styles.gainsInfo}>
                <Text style={styles.gainHighlightText}>💵 Gain de ce tirage: {formatMontant(gainDernierTour)}€</Text>
                <View style={styles.gainRow}>
                  <Text style={styles.gainLabel}>💰 Cumul des gains:</Text>
                  <Text style={styles.gainValue}>{formatMontant(totalGains)}€</Text>
                </View>
                <View style={styles.gainRow}>
                  <Text style={styles.gainLabel}>🏆 Meilleur gain:</Text>
                  <Text style={styles.gainValue}>{formatMontant(meilleurGain)}€</Text>
                </View>
                <View style={styles.gainRow}>
                  <Text style={styles.gainLabel}>💸 Total dépensé:</Text>
                  <Text style={styles.gainValue}>{formatMontant(totalDepense)}€</Text>
                </View>
                <View style={styles.gainRow}>
                  <Text style={styles.gainLabel}>🎟️ Nombre de tours:</Text>
                  <Text style={styles.gainValue}>{nombreTours}</Text>
                </View>
              </View>
            </View>

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

            <View style={styles.resultSection}>
              <Text style={styles.sectionTitleModal}>Résultats des Grilles:</Text>
              {resultatsGrilles.map((resultat, index) => (
                <View key={index} style={styles.resultGrille}>
                  <Text style={styles.resultGrilleTitle}>Grille {index + 1}:</Text>
                  <View style={styles.resultNumerosContainer}>
                    {resultat.numeros.map((num, idx) => {
                      const isFound = numerosTirage.includes(num);
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.numeroBallResult,
                            !isFound ? styles.numeroNonTrouve : styles.numeroTrouve,
                          ]}
                        >
                          <Text
                            style={[
                              styles.numeroTextResult,
                              !isFound ? styles.textNonTrouve : styles.textTrouve,
                            ]}
                          >
                            {num}
                          </Text>
                        </View>
                      );
                    })}
                    {resultat.etoiles.map((etoile, idx) => {
                      const isFound = etoilesTirage.includes(etoile);
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.etoileBallResult,
                            !isFound ? styles.etoileNonTrouve : styles.etoileTrouve,
                          ]}
                        >
                          <Text
                            style={[
                              styles.numeroTextResult,
                              !isFound ? styles.textEtoileNonTrouve : styles.textTrouve,
                            ]}
                          >
                            {etoile}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Afficher le gain par grille */}
                  {resultat.gain && (
                    <View style={[styles.gainContainer, getGainColor(resultat.gain)]}>
                      <FontAwesome name="star" size={16} color="#0055A4" style={{ marginRight: 5 }} />
                      <Text style={styles.gainText}>{formatMontant(resultat.gain)}€</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Styles pour le composant
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
  sectionTitleModal: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gainsInfoSection: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(240, 240, 255, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0055A4',
    width: '100%',
  },
  gainsInfo: {
    alignItems: 'center',
  },
  gainHighlightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  gainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    width: '100%',
  },
  gainLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  gainValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0055A4',
  },
  tirageSection: {
    marginBottom: 8,
    alignItems: 'center',
    borderColor: '#0055A4',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    width: '100%',
  },
  tirageNumeros: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroBallTirage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0055A4',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  etoileBallTirage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  numeroText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultSection: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    width: '100%',
    borderColor: '#0055A4',
    borderWidth: 1,
  },
  resultGrille: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0055A4',
  },
  resultGrilleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  resultNumerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 6,
  },
  numeroBallResult: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
  },
  numeroTrouve: {
    backgroundColor: '#0055A4',
    borderColor: '#0055A4',
  },
  numeroNonTrouve: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  etoileBallResult: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
  },
  etoileTrouve: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  etoileNonTrouve: {
    backgroundColor: '#FFD966', // Boules jaunes plus claires
    borderColor: '#FFD966',
  },
  numeroTextResult: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: 'transparent', 
  },
  gainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E11CC',
  },
  gainHigh: {
    backgroundColor: '#ffc107',
    color: '#FFFFFF',
  },
  gainMedium: {
    backgroundColor: '#ffc107',
    color: '#000000',
  },
  gainLow: {
    backgroundColor: '#ffc107',
    color: '#FFFFFF',
  },
});

export default EuroResultModal;
