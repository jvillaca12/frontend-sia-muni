import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';
import PrioridadService from 'data/services/PrioridadService';
import { useState } from 'react';

interface ModalEliminarPrioridadProps {
  selectedRow: PrioridadDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message: string) => void;
}

const ModalEliminarPrioridad: React.FC<ModalEliminarPrioridadProps> = ({
  selectedRow,
  modalMessage,
  openModal,
  isDeleted,
  setOpenModal,
  setIsDeleted,
  onSuccessRegistro
}) => {
  const [openModalM, setOpenModalM] = useState(false);
  const [modalMessageM, setModalMessageM] = useState('');

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalM = () => setOpenModalM(false);

  const handleDeletePrioridad = async (id: number) => {
    try {
      const response = await PrioridadService.deletePrioridad(id);
      if (response && response.statusCode !== 204) {
        setModalMessageM('La prioridad no puede ser eliminada, porque esta en uso');
        setOpenModalM(true);
        setOpenModal(false);
      } else {
        onSuccessRegistro?.('La prioridad ha sido eliminada exitosamente');
        setIsDeleted(true);
      }
    } catch (error) {
      setModalMessageM('Ocurrió un error al intentar eliminar la prioridad');
      setIsDeleted(false);
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={isDeleted ? handleCloseModal : () => handleDeletePrioridad(selectedRow?.id || 0)}
        onClose={handleCloseModal}
        title="Eliminar una prioridad"
        message={modalMessage}
        confirmText={isDeleted ? null : 'Eliminar'}
        cancelText={isDeleted ? 'Cerrar' : 'Cancelar'}
      />
      <ReusableModal
        open={openModalM}
        onClose={handleCloseModalM}
        title="Detalles"
        message={modalMessageM}
      />
    </>
  );
};

export default ModalEliminarPrioridad;
