import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

const Header = ({ onInfoPress }) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10, 
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10, 
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default Header;
