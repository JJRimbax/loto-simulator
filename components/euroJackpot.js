import React, { useEffect } from 'react';
import { Text, Animated, StyleSheet, View } from 'react-native';

const EuroJackpot = ({ jackpotAnimation, jackpot }) => {
  const colorAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();


    Animated.loop(
      Animated.sequence([
        Animated.timing(jackpotAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(jackpotAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [colorAnimation, jackpotAnimation]);

  const textColor = colorAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FFFFFF', '#FFD700', '#FFA500'], 
  });

  const getJackpotStyle = () => {
    if (jackpot >= 100000000) {
      return [styles.jackpotText, { color: textColor }];
    } else {
      return [styles.jackpotTextWhite, { color: textColor }];
    }
  };

  const renderJackpotContent = () => {
    if (jackpot >= 100000000) {
      return (
        <Animated.Text style={getJackpotStyle()}>
          ★ Jackpot: {jackpot.toLocaleString()}€ ★
        </Animated.Text>
      );
    } else {
      return <Animated.Text style={getJackpotStyle()}>Jackpot: {jackpot.toLocaleString()}€</Animated.Text>;
    }
  };

  return (
    <Animated.View style={[styles.jackpotContainer, { transform: [{ scale: jackpotAnimation }] }]}>
      {renderJackpotContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  jackpotContainer: {
    marginBottom: 15,
  },
  jackpotText: {
    fontSize: 24, 
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  jackpotTextWhite: {
    fontSize: 24,
    color: '#FFFFFF', 
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default EuroJackpot;
