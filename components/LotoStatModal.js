import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LotoStatModal = ({ visible, onClose, numeroStats, chanceStats }) => {
    
  const renderStats = (stats, color) => (
    <View style={styles.gridContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.gridItem}>
          <View style={[styles.numberCircle, color === 'blue' ? styles.circleBlue : styles.circleRed]}>
            <Text style={styles.numberText}>{stat.number}</Text>
          </View>
          <Text style={styles.countText}>{stat.count} fois</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Tendances des numéros Loto</Text>

          <ScrollView contentContainerStyle={styles.statsContainer}>

            <Text style={styles.sectionTitle}>Numéros (1-49)</Text>
            {renderStats(numeroStats, 'blue')}

            <Text style={styles.sectionTitle}>Numéro Chance (1-10)</Text>
            {renderStats(chanceStats, 'red')}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '80%',
    height: '70%',
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: '18%',
    margin: 5,
    alignItems: 'center',
  },
  numberCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  circleRed: {
    backgroundColor: '#E50000',
  },
  circleBlue: {
    backgroundColor: '#0055A4',
  },
});

export default LotoStatModal;
