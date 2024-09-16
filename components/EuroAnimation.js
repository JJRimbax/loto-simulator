import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const EuroAnimation = ({ circleAnimations, isAnimating }) => {
  if (!isAnimating) return null;

  return (
    <View style={styles.animationContainer}>
      <Text style={styles.animationText}>Tirage en cours...</Text>
      <View style={styles.animationCirclesContainer}>
        {circleAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.animationCircle,
              index === 6 ? styles.etoileBallTirage : null,
              { opacity: anim },
            ]}
          />
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4',
    margin: 5,
  },
  etoileBallTirage: {
    backgroundColor: '#FFC107',
  },
});

export default EuroAnimation;
