import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ChanceNumberInput = ({ numeroChance, onChangeChance, onFlashPress }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Numéro Chance (1-10):</Text>
      <View style={styles.numerosContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={2}
          value={numeroChance}
          onChangeText={onChangeChance}
        />
        <TouchableOpacity style={styles.flashButton} onPress={onFlashPress}>
          <Text style={styles.flashButtonText}>Flash</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  flashButton: {
    backgroundColor: '#E50000', 
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
});

export default ChanceNumberInput;
