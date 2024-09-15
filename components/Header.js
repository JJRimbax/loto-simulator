import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Header = ({ onInfoPress }) => {
  return (
    <View style={styles.header}>
      <FontAwesome name="ticket" size={32} color="#FFFFFF" style={styles.titleIcon} />
      <Text style={styles.title}>Simulateur de Loto</Text>
      <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
        <FontAwesome name="question-circle" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  titleIcon: {
    position: 'absolute',
    left: 10,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 24, 
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default Header;
