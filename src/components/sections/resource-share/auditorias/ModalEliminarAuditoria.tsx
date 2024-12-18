import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { AuditoriaService } from 'data/services/AuditoriaService';

interface ModalEliminarAuditoriaProps {
  selectedRow: AuditoriaDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setModalMessage: (message: string) => void;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message?: string) => void;
}

const ModalEliminarAuditoria: React.FC<ModalEliminarAuditoriaProps> = ({
  selectedRow,
  modalMessage,
  openModal,
  isDeleted,
  setModalMessage,
  setOpenModal,
  setIsDeleted,
  onSuccessRegistro
}) => {
  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteAuditoria = async (idAuditoria: number) => {
    try {
      const response = await AuditoriaService.deleteAuditoria(idAuditoria);
      if (response.statusCode !== 204) {
        setModalMessage('Error al eliminar una auditoria');
        return;
      }
      setIsDeleted(true);
      onSuccessRegistro?.('La auditoria ha sido eliminado exitosamente');
    } catch (error) {
      setModalMessage('Ocurrió un error al intentar eliminar la auditoria');
      setIsDeleted(false);
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted ? handleCloseModal : () => handleDeleteAuditoria(selectedRow?.idAuditoria || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar una auditoria"
        message={modalMessage}
        confirmText={isDeleted ? null : 'Eliminar'}
        cancelText={isDeleted ? 'Cerrar' : 'Cancelar'}
      />
    </>
  );
};

export default ModalEliminarAuditoria;
