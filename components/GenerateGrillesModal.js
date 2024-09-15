import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Modal } from 'react-native';

const GenerateGrillesModal = ({
  visible,
  onClose,
  nombreGrillesAGenerer,
  setNombreGrillesAGenerer,
  secondTirageGenerer,
  setSecondTirageGenerer,
  onGeneratePress,
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
          {/* Bouton pour fermer la modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Générer des Grilles Aléatoires</Text>
          <TextInput
            style={styles.modalInput}
            keyboardType="numeric"
            value={nombreGrillesAGenerer}
            onChangeText={setNombreGrillesAGenerer}
            placeholder="Entrez un nombre de grilles à générer"
            placeholderTextColor="#AAAAAA"
          />

          {/* Switch pour le second tirage */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Second Tirage:</Text>
            <Switch
              value={secondTirageGenerer}
              onValueChange={setSecondTirageGenerer}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={secondTirageGenerer ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.genererButton} onPress={onGeneratePress}>
            <Text style={styles.buttonText}>Générer</Text>
          </TouchableOpacity>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
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
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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

export default GenerateGrillesModal;
