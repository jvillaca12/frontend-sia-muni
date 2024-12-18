import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { MantenimientoService } from 'data/services/MantenimientoService';
import { useState } from 'react';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { AuditoriaService } from 'data/services/AuditoriaService';
import ModalAudiMantenimientoDetail from './DetalleAudiMantenimiento';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';

interface ModalEliminarMantenimientoProps {
  selectedRow: MantenimientoDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setModalMessage: (message: string) => void;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro?: (message?: string) => void;
}

const ModalEliminarMantenimiento: React.FC<ModalEliminarMantenimientoProps> = ({
  selectedRow,
  modalMessage,
  openModal,
  isDeleted,
  setModalMessage,
  setOpenModal,
  setIsDeleted,
  onSuccessRegistro,
}) => {
  const [dataAudiMantenimiento, setDataAudiMantenimiento] = useState<AuditoriaDTO[]>([]);
  const [openModalM, setOpenModalM] = useState(false);
  const [modalMessageM, setModalMessageM] = useState('');

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalM = () => setOpenModalM(false);

  const handleDeleteMantenimiento = async (idMantenimiento: number) => {
    try {
      const response = await AuditoriaService.getAudiMantenimiento(idMantenimiento);
      if (
        response &&
        response.statusCode === 200 &&
        response.auditoriaDTOList &&
        response.auditoriaDTOList.length > 0
      ) {
        setDataAudiMantenimiento(response.auditoriaDTOList as AuditoriaDTO[]);
        setModalMessageM(
          `El mantenimiento con el id ${idMantenimiento} no puede ser eliminado, ya que tiene auditorias asociadas`,
        );
        setOpenModalM(true);
        setOpenModal(false);
        setIsDeleted(false);
      } else {
        await MantenimientoService.deleteMantenimiento(idMantenimiento)
          .then(() => {
            setIsDeleted(true);
            onSuccessRegistro?.('El mantenimiento ha sido eliminado exitosamente');
          })
          .catch((error) => {
            setModalMessage(error.message);
          });
      }
    } catch (error) {
      setModalMessage('Ocurrió un error al intentar eliminar el mantenimiento');
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted
            ? handleCloseModal
            : () => handleDeleteMantenimiento(selectedRow?.idMantenimiento || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar un mantenimiento"
        message={modalMessage}
        confirmText={isDeleted ? null : 'Eliminar'}
        cancelText={isDeleted ? 'Cerrar' : 'Cancelar'}
      />
      <ModalAudiMantenimientoDetail
        open={openModalM}
        onClose={handleCloseModalM}
        title="Detalles de las Auditorias"
        message={modalMessageM}
        data={dataAudiMantenimiento}
        restablecerData={() => setDataAudiMantenimiento([])}
      />
    </>
  );
};

export default ModalEliminarMantenimiento;
