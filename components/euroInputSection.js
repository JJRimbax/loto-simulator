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

const { width, height } = Dimensions.get('window'); // Récupération des dimensions de l'écran

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUniqueNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(getRandomNumber(min, max));
  }
  return Array.from(numbers);
};

const EuroInputSection = ({ visible, onClose, onAddGrille }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num]);
    } else {
      Alert.alert('Erreur', 'Vous ne pouvez sélectionner que 5 numéros.');
    }
  };

  const toggleStar = (num) => {
    if (selectedStars.includes(num)) {
      setSelectedStars(selectedStars.filter(s => s !== num));
    } else if (selectedStars.length < 2) {
      setSelectedStars([...selectedStars, num]);
    } else {
      Alert.alert('Erreur', 'Vous ne pouvez sélectionner que 2 étoiles.');
    }
  };

  const generateRandomGrille = () => {
    const randomNumbers = getRandomUniqueNumbers(5, 1, 50);
    const randomStars = getRandomUniqueNumbers(2, 1, 12);
    setSelectedNumbers(randomNumbers);
    setSelectedStars(randomStars);
  };

  const handleAddGrille = () => {
    if (selectedNumbers.length === 5 && selectedStars.length === 2) {
      onAddGrille(selectedNumbers, selectedStars);
      onClose();
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner 5 numéros et 2 étoiles.');
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
            {[...Array(50).keys()].map(i => {
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

          <Text style={styles.modalTitle}>Sélectionnez vos étoiles</Text>
          <View style={styles.starGrid}>
            {[...Array(12).keys()].map(i => {
              const num = i + 1;
              const isSelected = selectedStars.includes(num);
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.numberCircle, styles.starCircle, isSelected && styles.selectedStar]}
                  onPress={() => toggleStar(num)}
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
    width: width * 0.85, // Largeur ajustée
    height: height * 0.9, // Hauteur ajustée à 90%
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
    width: width * 0.09, // Ajustement de la taille des cercles de numéros
    height: width * 0.09,
    borderRadius: (width * 0.09) / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  starCircle: {
    backgroundColor: '#ddd',
  },
  selectedNumber: {
    backgroundColor: '#0055A4',
  },
  selectedStar: {
    backgroundColor: '#FFD700',
  },
  numberText: {
    color: '#000',
    fontSize: width * 0.04, // Ajustement de la taille du texte
    fontWeight: 'bold',
  },
  selectedNumberText: {
    color: '#fff',
  },
  starGrid: {
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
    backgroundColor: '#FFD700',
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

export default EuroInputSection;
