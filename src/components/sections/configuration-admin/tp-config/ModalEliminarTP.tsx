import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';
import TipoMantenimientoService from 'data/services/TipoMantenimientoService';
import { useState } from 'react';

interface ModalTipoMantePrioridadProps {
  selectedRow: TipoMantenimientoDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message: string) => void;
}

const ModalEliminarTP: React.FC<ModalTipoMantePrioridadProps> = ({
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
      const response = await TipoMantenimientoService.deleteTP(id);
      if (response && response.statusCode !== 204) {
        setModalMessageM('El tipo de mantenimiento no puede ser eliminada, ya que esta en uso');
        setOpenModalM(true);
        setOpenModal(false);
      } else {
        onSuccessRegistro?.('El tipo de mantenimiento ha sido eliminado exitosamente');
        setIsDeleted(true);
      }
    } catch (error) {
      setModalMessageM('Ocurrió un error al intentar eliminar el tipo de mantenimiento');
      setIsDeleted(false);
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={isDeleted ? handleCloseModal : () => handleDeletePrioridad(selectedRow?.id || 0)}
        onClose={handleCloseModal}
        title="Eliminar Tipo de Mantenimiento"
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

export default ModalEliminarTP;
