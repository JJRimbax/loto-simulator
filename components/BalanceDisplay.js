import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatMontant } from '../utils/formatMontant';

const BalanceDisplay = ({ solde }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.soldeText}>💳 Solde actuel: {formatMontant(solde)}€</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  soldeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default BalanceDisplay;
