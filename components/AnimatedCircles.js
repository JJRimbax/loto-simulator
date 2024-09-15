import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const AnimatedCircles = ({ circleAnimations }) => {
  const [randomNumbers, setRandomNumbers] = useState(Array(6).fill(0)); 

  useEffect(() => {
    const intervalIds = [];

   
    circleAnimations.forEach((anim, index) => {
      const maxNumber = index === 5 ? 10 : 49;

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
  }, [circleAnimations]);

  return (
    <View style={styles.animationContainer}>
      <Text style={styles.animationText}>Tirage en cours...</Text>
      <View style={styles.animationCirclesContainer}>
        {circleAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.animationCircle,
              index === 5 ? styles.chanceBallTirage : null,
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
  animationText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
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
  chanceBallTirage: {
    backgroundColor: '#E50000',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnimatedCircles;
