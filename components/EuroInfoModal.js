import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const EuroInfoModal = ({ modalInfoVisible, setModalInfoVisible }) => {
  return (
    <Modal
      visible={modalInfoVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalInfoVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalInfoVisible(false)}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Informations du Jeu EuroMillions</Text>
            <Text style={styles.modalText}>
              EuroMillions est un jeu de loterie où vous devez choisir 5 numéros entre 1 et 50, 
              et 2 étoiles entre 1 et 12. Chaque grille coûte 2,50€, et vous avez l'option Étoile + 
              qui augmente vos gains de 12%.
            </Text>

            <Text style={styles.modalSubtitle}>Grille de Gains :</Text>

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Combinaison</Text>
                <Text style={styles.tableHeaderText}>Gain</Text>
              </View>

              {/* Jackpot */}
              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>5 Numéros + 2 Étoiles</Text>
                <Text style={styles.tableRowText}>Jackpot</Text>
              </View>

              {/* Autres gains */}
              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>5 Numéros + 1 Étoile</Text>
                <Text style={styles.tableRowText}>250 000€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>5 Numéros</Text>
                <Text style={styles.tableRowText}>35 000€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>4 Numéros + 2 Étoiles</Text>
                <Text style={styles.tableRowText}>2 500€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>4 Numéros + 1 Étoile</Text>
                <Text style={styles.tableRowText}>150€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>4 Numéros</Text>
                <Text style={styles.tableRowText}>35€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>3 Numéros + 2 Étoiles</Text>
                <Text style={styles.tableRowText}>80€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>3 Numéros + 1 Étoile</Text>
                <Text style={styles.tableRowText}>11€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>2 Numéros + 2 Étoiles</Text>
                <Text style={styles.tableRowText}>18€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>3 Numéros</Text>
                <Text style={styles.tableRowText}>8€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>1 Numéro + 2 Étoiles</Text>
                <Text style={styles.tableRowText}>7€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>2 Numéros + 1 Étoile</Text>
                <Text style={styles.tableRowText}>5€</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableRowText}>2 Numéros</Text>
                <Text style={styles.tableRowText}>3€</Text>
              </View>
            </View>

            <Text style={styles.modalText}>
              La mise de départ du jackpot est de 17 millions d'euros et peut atteindre jusqu'à 250 millions d'euros.{"\n"}{"\n"}
              Avec l'option Étoile +, vos gains peuvent augmenter de 12%.
            </Text>
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
    padding: 20,
    borderRadius: 10,
    width: '85%',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0055A4',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableRowText: {
    fontSize: 14,
    color: '#333',
  },
});

export default EuroInfoModal;
