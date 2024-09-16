import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';

const EuroGenererModal = ({
  modalGenererVisible,
  setModalGenererVisible,
  nombreGrillesAGenerer,
  setNombreGrillesAGenerer,
  etoilePlus,
  setEtoilePlus,
  genererGrillesAleatoires,
}) => {
  return (
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
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EuroGenererModal;
