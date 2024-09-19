import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get('window'); 

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUniqueNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(getRandomNumber(min, max));
  }
  return Array.from(numbers);
};

const AjouterModal = ({ visible, onClose, onAddGrille }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedChanceNumber, setSelectedChanceNumber] = useState(null);

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num]);
    } else {
      Alert.alert('Erreur', 'Vous ne pouvez sélectionner que 5 numéros.');
    }
  };

  const selectChanceNumber = (num) => {
    setSelectedChanceNumber(num);
  };

  const generateRandomGrille = () => {
    const randomNumbers = getRandomUniqueNumbers(5, 1, 49);
    const randomChanceNumber = getRandomNumber(1, 10);
    setSelectedNumbers(randomNumbers);
    setSelectedChanceNumber(randomChanceNumber);
  };

  const handleAddGrille = () => {
    if (selectedNumbers.length === 5 && selectedChanceNumber) {
      onAddGrille(selectedNumbers, selectedChanceNumber);
      onClose();
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner 5 numéros et 1 numéro chance.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sélectionnez vos numéros</Text>

          <ScrollView contentContainerStyle={styles.grid}>
            {[...Array(49).keys()].map(i => {
              const num = i + 1;
              const isSelected = selectedNumbers.includes(num);
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.numberCircle, isSelected && styles.selectedNumber]}
                  onPress={() => toggleNumber(num)}
                >
                  <Text style={[styles.numberText, isSelected && styles.selectedNumberText]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.modalTitle}>Numéro Chance</Text>
          <View style={styles.chanceGrid}>
            {[...Array(10).keys()].map(i => {
              const num = i + 1;
              const isSelected = selectedChanceNumber === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.numberCircle, styles.chanceCircle, isSelected && styles.selectedChanceNumber]}
                  onPress={() => selectChanceNumber(num)}
                >
                  <Text style={[styles.numberText, isSelected && styles.selectedNumberText]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.flashButton} onPress={generateRandomGrille}>
            <FontAwesome name="bolt" size={20} color="#fff" style={styles.flashIcon} />
            <Text style={styles.flashButtonText}>Flash</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleAddGrille}>
            <Text style={styles.addButtonText}>Ajouter Grille</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: width * 0.85, 
    height: height * 0.95,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  numberCircle: {
    width: width * 0.09, 
    height: width * 0.09, 
    borderRadius: (width * 0.1) / 2, 
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  chanceCircle: {
    backgroundColor: '#ddd',
  },
  selectedNumber: {
    backgroundColor: '#0055A4',
  },
  selectedChanceNumber: {
    backgroundColor: '#E50000',
  },
  numberText: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  selectedNumberText: {
    color: '#fff',
  },
  chanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  flashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0055A4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  flashIcon: {
    marginRight: 5,
  },
  flashButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#E50000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AjouterModal;
