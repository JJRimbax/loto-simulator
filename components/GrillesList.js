import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const GrillesList = ({ grilles, toggleSecondTirage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Grilles Jouées:</Text>
      {grilles.map((grille, index) => (
        <View key={index} style={styles.grille}>
          <View style={styles.grilleNumerosRow}>
            {grille.numeros.map((num, idx) => (
              <View key={idx} style={styles.numeroBallGrille}>
                <Text style={styles.numeroTextGrille}>{num}</Text>
              </View>
            ))}
            <View style={[styles.numeroBallGrille, styles.chanceBallGrille]}>
              <Text style={styles.numeroTextGrille}>{grille.chance}</Text>
            </View>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Second Tirage:</Text>
            <Switch
              value={grille.secondTirage}
              onValueChange={() => toggleSecondTirage(index)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={grille.secondTirage ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grille: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%', 
    alignItems: 'center',
  },
  grilleNumerosRow: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'nowrap', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, 
  },
  numeroBallGrille: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0055A4', 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: '#0055A4',
  },
  chanceBallGrille: {
    backgroundColor: '#E50000', 
    borderColor: '#E50000',
  },
  numeroTextGrille: {
    color: '#FFFFFF', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    marginRight: 10,
  },
});

export default GrillesList;
