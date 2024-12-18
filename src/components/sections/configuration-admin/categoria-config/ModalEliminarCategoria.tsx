import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { useState } from 'react';
import ReusableModal from 'components/common/ResuableDialog';
import { CategoriaDTO } from 'data/interfaces/CategoriaDTO';
import CategoriaService from 'data/services/CategoriaService';

interface ModalEliminarCategoriaProps {
  selectedRow: CategoriaDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro?: (message?: string) => void;
}

const ModalEliminarCategoria: React.FC<ModalEliminarCategoriaProps> = ({
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

  const handleDeleteCategoria = async (id: number) => {
    const response = await CategoriaService.deleteCategoria(id);
    if (response && response.statusCode !== 204) {
      setModalMessageM(
        'La categoria no puede ser eliminada, porque esta en uso',
      );
      setOpenModalM(true);
      setOpenModal(false);
    } else {
      onSuccessRegistro?.('La categoria ha sido eliminada');
      setIsDeleted(true);
    }
  };
  
  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted ? handleCloseModal : () => handleDeleteCategoria(selectedRow?.id || 0)
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

export default ModalEliminarCategoria;