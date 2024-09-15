import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';

const InfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Bouton pour fermer la modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
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
  modalTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000', 
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default InfoModal;
