import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const EuroAnimation = ({ circleAnimations, isAnimating }) => {
  const [randomNumbers, setRandomNumbers] = useState(Array(7).fill(0)); 

  useEffect(() => {
    if (!isAnimating) return;

    const intervalIds = [];


    circleAnimations.forEach((anim, index) => {
      const maxNumber = index < 5 ? 50 : 12; 

      const intervalId = setInterval(() => {
        const newRandomNumber = Math.floor(Math.random() * maxNumber) + 1;
        setRandomNumbers((prevNumbers) => {
          const newNumbers = [...prevNumbers];
          newNumbers[index] = newRandomNumber;
          return newNumbers;
        });
      }, 100); 

      intervalIds.push(intervalId);
    });

    return () => {
      intervalIds.forEach(clearInterval);
    };
  }, [circleAnimations, isAnimating]);

  if (!isAnimating) return null;

  return (
    <View style={styles.animationContainer}>
      <View style={styles.animationCirclesContainer}>
        {circleAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.animationCircle,
              index >= 5 ? styles.etoileBallTirage : null, 
              { opacity: anim },
            ]}
          >
            <Text style={styles.numberText}>{randomNumbers[index]}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  animationCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  animationCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0055A4', 
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etoileBallTirage: {
    backgroundColor: '#FFC107', 
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EuroAnimation;
