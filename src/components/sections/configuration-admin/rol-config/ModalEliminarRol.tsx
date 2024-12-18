import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { RolDTO } from 'data/interfaces/RolDTO';
import { RolService } from 'data/services/RolService';
import { useState } from 'react';

interface ModalEliminarRolProps {
  selectedRow: RolDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message: string) => void;
}

const ModalEliminarRol: React.FC<ModalEliminarRolProps> = ({
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

  const handleDeleteRol = async (id: number) => {
    try {
      const response = await RolService.deleteRol(id);
      if (response && response.statusCode !== 204) {
        setModalMessageM('El rol no puede ser eliminada, porque esta en uso');
        setOpenModalM(true);
        setOpenModal(false);
      } else {
        onSuccessRegistro?.('El rol ha sido eliminado exitosamente');
        setIsDeleted(true);
      }
    } catch (error) {
      setModalMessageM('Ocurrió un error al intentar eliminar el rol');
      setIsDeleted(false);
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={isDeleted ? handleCloseModal : () => handleDeleteRol(selectedRow?.id || 0)}
        onClose={handleCloseModal}
        title="Eliminar un rol"
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

export default ModalEliminarRol;
