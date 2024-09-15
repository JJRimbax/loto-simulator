import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatMontant } from '../utils/formatMontant';

const BalanceDisplay = ({ solde }) => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceBox}>
        <Text style={styles.soldeText}>
          💳 Solde: <Text style={styles.soldeAmount}>{formatMontant(solde)}€</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  balanceBox: {
    backgroundColor: '#0055A4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  soldeText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  soldeAmount: {
    fontSize: 18, // Taille du montant
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: '#E50000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default BalanceDisplay;
