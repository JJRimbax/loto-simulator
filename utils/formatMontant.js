export const formatMontant = (montant) => {
    return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  