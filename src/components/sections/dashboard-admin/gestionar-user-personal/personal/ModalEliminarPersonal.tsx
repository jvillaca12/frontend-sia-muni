import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { useState } from 'react';
import ReusableModal from 'components/common/ResuableDialog';
import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import { PersonalService } from 'data/services/PersonalService';

interface ModalEliminarPersonalProps {
  selectedRow: PersonalDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro?: (message?: string) => void;
}

const ModalEliminarPersonal: React.FC<ModalEliminarPersonalProps> = ({
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

  const handleDeletePersonal = async (idPersonal: number) => {
    const response = await PersonalService.deletePersonal(idPersonal);
    if (response && response.statusCode !== 204) {
      setModalMessageM(
        'El personal no puede ser eliminado, porque tiene registros de mantenimiento',
      );
      setOpenModalM(true);
      setOpenModal(false);
    } else {
      onSuccessRegistro?.('El personal ha sido eliminado');
      setIsDeleted(true);
    }
  };
  
  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted ? handleCloseModal : () => handleDeletePersonal(selectedRow?.idPersonal || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar Personal"
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

export default ModalEliminarPersonal;
