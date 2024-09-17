import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}  // Ajout du logo ici
        style={styles.mainLogo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Choisissez un jeu :</Text>

      <TouchableOpacity
        style={styles.lotoButton}
        onPress={() => navigation.navigate('LotoScreen')}
      >
        <Image
          source={require('../assets/Nouveau_logo_loto.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.euroButton}
        onPress={() => navigation.navigate('EuroScreen')}
      >
        <Image
          source={require('../assets/Euromillions.png')}
          style={styles.euroLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C77AF', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainLogo: {  
    width: 350,
    height: 350,
    marginBottom: 20, 
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  lotoButton: {
    backgroundColor: '#0055A4',
    width: '80%',  
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, 
  },
  euroButton: {
    backgroundColor: '#0055A4',
    width: '80%',  
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
  euroLogo: {
    width: 230,  
    height: 90,
  },
});

export default HomeScreen;
