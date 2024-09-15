import React, { useEffect } from 'react';
import { Text, Animated, StyleSheet, View } from 'react-native';
import { formatMontant } from '../utils/formatMontant'; 

const JackpotDisplay = ({ jackpot, jackpotAnimation }) => {
  const colorAnimation = new Animated.Value(0); 
  const scaleAnimation = jackpotAnimation; 

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
        Animated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [colorAnimation, scaleAnimation]);


  const textColor = colorAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FFFFFF', '#FFD700', '#FFA500'], 
  });


  const getJackpotStyle = () => {
    if (jackpot >= 30000000) {
      return [styles.jackpotText, { color: textColor }];
    } else if (jackpot >= 20000000) {
      return [styles.jackpotText, { color: textColor }];
    } else if (jackpot >= 10000000) {
      return [styles.jackpotText, { color: textColor }];
    } else {
      return styles.jackpotTextWhite;
    }
  };

  const renderJackpotContent = () => {
    if (jackpot >= 20000000) {
      return (
        <Animated.Text style={getJackpotStyle()}>
          ★ Jackpot: {formatMontant(jackpot)}€ ★
        </Animated.Text>
      );
    } else {
      return <Animated.Text style={getJackpotStyle()}>Jackpot: {formatMontant(jackpot)}€</Animated.Text>;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.jackpotContainer, 
        { transform: [{ scale: scaleAnimation }] }
      ]}
    >
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

export default JackpotDisplay;
