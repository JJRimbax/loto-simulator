// EuroInputSection.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';

const EuroInputSection = ({ numerosInput, etoilesInput, flashNumeros, flashEtoiles, setNumerosInput, setEtoilesInput, etoilePlus, setEtoilePlus, ajouterGrille }) => {
  return (
    <View style={styles.inputSection}>
      <Text style={styles.sectionTitle}>Créer une Grille:</Text>

      <View>
        <Text style={styles.sectionTitle}>Numéros (1-50):</Text>
        <View style={styles.numerosContainer}>
          {numerosInput.map((num, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={2}
              value={num}
              onChangeText={(text) => {
                const newNumeros = [...numerosInput];
                newNumeros[index] = text.replace(/[^0-9]/g, '');
                setNumerosInput(newNumeros);
              }}
            />
          ))}
          <TouchableOpacity style={styles.flashButtonBlue} onPress={flashNumeros}>
            <Text style={styles.flashButtonText}>Flash</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Étoiles (1-12):</Text>
        <View style={styles.numerosContainer}>
          {etoilesInput.map((num, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={2}
              value={num}
              onChangeText={(text) => {
                const newEtoiles = [...etoilesInput];
                newEtoiles[index] = text.replace(/[^0-9]/g, '');
                setEtoilesInput(newEtoiles);
              }}
            />
          ))}
          <TouchableOpacity style={styles.flashButtonYellow} onPress={flashEtoiles}>
            <Text style={styles.flashButtonText}>Flash</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Option Étoile + (Augmente les gains de 12%)</Text>
        <Switch
          value={etoilePlus}
          onValueChange={setEtoilePlus}
          trackColor={{ false: '#767577', true: '#FBC02D' }}
          thumbColor={etoilePlus ? '#FFEB3B' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={ajouterGrille}>
        <Text style={styles.buttonText}>Ajouter Grille</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  numerosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 8,
    width: 45,
    margin: 3,
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  flashButtonYellow: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  flashButtonBlue: {
    backgroundColor: '#0055A4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 5,
  },
  flashButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
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

export default EuroInputSection;
