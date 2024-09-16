import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const EuroResultModal = ({ modalVisible, resultatsGrilles, gainDernierTour, totalGains, meilleurGain, totalDepense, nombreTours, numerosTirage, etoilesTirage, setModalVisible }) => {
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
                <Text style={styles.gainsTextHighlight}>💵 Gain de ce tirage: {gainDernierTour}€</Text>
                <Text style={styles.gainsText}>💰 Cumul des gains: {totalGains}€</Text>
                <Text style={styles.gainsText}>🏆 Meilleur gain: {meilleurGain}€</Text>
                <Text style={styles.gainsText}>💸 Total dépensé: {totalDepense}€</Text>
                <Text style={styles.gainsText}>🎟️ Nombre de tours: {nombreTours}</Text>
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
                    {resultat.numeros.map((num, idx) => (
                      <View
                        key={idx}
                        style={styles.numeroBallResult}
                      >
                        <Text style={styles.numeroTextResult}>{num}</Text>
                      </View>
                    ))}
                    {resultat.etoiles.map((etoile, idx) => (
                      <View
                        key={idx}
                        style={styles.etoileBallResult}
                      >
                        <Text style={styles.numeroTextResult}>{etoile}</Text>
                      </View>
                    ))}
                  </View>
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
  tirageSection: {
    marginBottom: 10,
    alignItems: 'center',
  },
  tirageNumeros: {
    flexDirection: 'row',
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
});

export default EuroResultModal;
