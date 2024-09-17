import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const EuroMillionsHistoriqueModal = ({ modalVisible, setModalVisible, historiqueEuroMillions }) => {
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
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Historique des Tirages EuroMillions</Text>

            {/* Vérification si historiqueEuroMillions est défini et n'est pas vide */}
            {historiqueEuroMillions && historiqueEuroMillions.length > 0 ? (
              historiqueEuroMillions.map((tirage, index) => (
                <View key={index} style={styles.tirageContainer}>
                  <Text style={styles.tirageTitle}>Tirage {index + 1}</Text>
                  <View style={styles.numerosRow}>
                    {tirage.numerosTires.map((num, idx) => (
                      <View key={idx} style={styles.numeroBall}>
                        <Text style={styles.numeroText}>{num}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.etoilesRow}>
                    {tirage.etoilesTires.map((etoile, idx) => (
                      <View key={idx} style={styles.etoileBall}>
                        <Text style={styles.numeroText}>{etoile}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Aucun historique disponible</Text>
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
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  tirageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  tirageTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  numerosRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  etoilesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numeroBall: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#0055A4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  etoileBall: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  numeroText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});

export default EuroMillionsHistoriqueModal;
