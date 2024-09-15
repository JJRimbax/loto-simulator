import React from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { formatMontant } from '../utils/formatMontant'; 

const JackpotDisplay = ({ jackpot, jackpotAnimation }) => {
  return (
    <Animated.View style={[styles.jackpotContainer, { transform: [{ scale: jackpotAnimation }] }]}>
      <Text style={styles.jackpotText}>Jackpot: {formatMontant(jackpot)}€</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  jackpotContainer: {
    marginBottom: 15,
  },
  jackpotText: {
    fontSize: 20, 
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default JackpotDisplay;
