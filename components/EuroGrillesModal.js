import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Switch } from 'react-native';

const EuroGrillesModal = ({ grillesModalVisible, setGrillesModalVisible, grilles }) => {
  return (
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
  grilleNumerosRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
  etoileBallGrille: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  numeroTextGrille: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
});

export default EuroGrillesModal;
