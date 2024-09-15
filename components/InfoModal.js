import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';

const InfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Bouton pour fermer la modal */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>

          <ScrollView>
            <Text style={styles.modalTitle}>Informations sur le Jeu</Text>

            <Text style={styles.modalSectionTitle}>Prix par grille :</Text>
            <Text style={styles.modalText}>
              <Text style={styles.highlight}>- Grille simple : </Text>2€
              {'\n'}
              <Text style={styles.highlight}>- Option Second Tirage : </Text>+1€ par grille
            </Text>

            <Text style={styles.modalSectionTitle}>Gains possibles :</Text>

            {/* Affichage des combinaisons avec des boules colorées */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= Jackpot</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 100 000€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 1 000€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 400€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 50€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 20€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 10€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 4€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                <View style={[styles.ball, styles.blueBall]}>
                  <Text style={styles.ballText}>#</Text>
                </View>
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 2€ </Text>
            </View>

            {/* Nouveau cas pour un seul numéro chance */}
            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                <View style={[styles.ball, styles.redBall]}>
                  <Text style={styles.ballText}>+</Text>
                </View>
              </View>
              <Text style={styles.modalText}>= 2€ </Text>
            </View>

            <Text style={styles.modalSectionTitle}>Gains Second Tirage :</Text>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 100 000€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 1 000€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 10€</Text>
            </View>

            <View style={styles.gainCategory}>
              <View style={styles.numbersContainer}>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <View key={idx} style={[styles.ball, styles.blueBall]}>
                    <Text style={styles.ballText}>#</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.modalText}>= 2€</Text>
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
    maxHeight: '80%',
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',
    marginVertical: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  ballText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueBall: {
    backgroundColor: '#0055A4',
  },
  redBall: {
    backgroundColor: '#E50000',
  },
  highlight: {
    fontWeight: 'bold',
  },
});

export default InfoModal;
