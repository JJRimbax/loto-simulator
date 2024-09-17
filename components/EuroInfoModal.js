import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const EuroInfoModal = ({ modalInfoVisible, setModalInfoVisible }) => {
  return (
    <Modal
      visible={modalInfoVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalInfoVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalInfoVisible(false)}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Informations du Jeu EuroMillions</Text>

            {/* Prix de la grille et option Étoile Plus */}
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Prix d'une grille :</Text> 2,50€
              {'\n'}
              <Text style={styles.boldText}>Option Étoile Plus :</Text> +1€
            </Text>

            <Text style={styles.modalSubtitle}>Grille de Gains :</Text>

            {/* Jackpot */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalTextSmall}>= Jackpot</Text>
            </View>

            {/* 5 Numéros + 1 Étoile */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 250 000€</Text>
            </View>

            {/* 5 Numéros */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 35 000€</Text>
            </View>

            {/* 4 Numéros + 2 Étoiles */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 2 500€</Text>
            </View>

            {/* 4 Numéros + 1 Étoile */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 150€</Text>
            </View>

            {/* 3 Numéros + 2 Étoiles */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 80€</Text>
            </View>

     {/* 3 Numéros */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 8€</Text>
            </View>

            {/* 1 Numéro + 2 Étoiles */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                <View style={[styles.ball, styles.blueBall]}>
                  <Text style={styles.ballText}>#</Text>
                </View>
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 7€</Text>
            </View>

            {/* 2 Numéros + 1 Étoile */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.yellowBall]}>
                  <Text style={styles.ballText}>★</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 5€</Text>
            </View>

            {/* 2 Numéros */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 3€</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#0055A4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',
    marginVertical: 5,
  },
  modalTextSmall: {
    fontSize: 14, // Reduced font size for better fit
    color: '#333333',
    textAlign: 'left',
    marginVertical: 5,
  },
  gainCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  numbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ball: {
    width: 25,  // Reduced ball size
    height: 25, // Reduced ball size
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  ballText: {
    color: '#FFFFFF',
    fontSize: 14, // Adjusted font size
    fontWeight: 'bold',
  },
  blueBall: {
    backgroundColor: '#0055A4',
  },
  yellowBall: {
    backgroundColor: '#FFC107',
  },
});

export default EuroInfoModal;
