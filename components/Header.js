import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Header = ({ onInfoPress }) => {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/Nouveau_logo_loto.png')} style={styles.logo} />
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
  logo: {
    width: 200, // Largeur du logo
    height: 80, // Hauteur du logo
    resizeMode: 'contain', // Ajuste l'image à la taille sans déformation
    marginVertical: 10,
  },
});

export default Header;
