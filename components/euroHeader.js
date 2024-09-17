import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EuroHeader = ({ onInfoPress }) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')}>
        <FontAwesome name="arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>


      <Image
        source={require('../assets/Euromillions.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
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
    width: 270, 
    height: 100, 
    marginVertical: 10,
  },
});

export default EuroHeader;
