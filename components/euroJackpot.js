import React from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

const EuroJackpot = ({ jackpotAnimation, jackpot }) => {
  return (
    <Animated.View style={{ transform: [{ scale: jackpotAnimation }] }}>
      <Text style={styles.jackpot}>Jackpot: {jackpot.toLocaleString()}€</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  jackpot: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default EuroJackpot;
