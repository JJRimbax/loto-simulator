import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NumberInput = ({ numeros, onChangeNumero, onFlashPress }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Numéros (1-49):</Text>
      <View style={styles.numerosContainer}>
        {numeros.map((num, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            value={num}
            onChangeText={(text) => onChangeNumero(index, text)}
          />
        ))}
        <TouchableOpacity style={styles.flashButtonBlue} onPress={onFlashPress}>
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
    flashButtonBlue: {
      backgroundColor: '#0055A4',
      paddingVertical: 12, // Hauteur ajustée
      paddingHorizontal: 15,
      borderRadius: 5,
      marginLeft: 5,
      height: 45, // Hauteur uniforme
      justifyContent: 'center',
    },
    flashButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });
  

export default NumberInput;
