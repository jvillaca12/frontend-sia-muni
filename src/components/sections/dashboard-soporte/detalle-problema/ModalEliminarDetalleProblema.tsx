import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import DetalleProblemaService from 'data/services/DetalleProblemaService';
import { MantenimientoService } from 'data/services/MantenimientoService';
import ModalDetalleProblemaPorMantenimiento from './ModalDetalleFalloMantenimiento';
import React, { useState } from 'react';

interface ModalEliminarDetalleProblemaProps {
  selectedRow: DetalleProblemaDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setModalMessage: (message: string) => void;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro?: (message?: string) => void;
}

const ModalEliminarDetalleProblema: React.FC<ModalEliminarDetalleProblemaProps> = ({
  selectedRow,
  modalMessage,
  openModal,
  isDeleted,
  setModalMessage,
  setOpenModal,
  setIsDeleted,
  onSuccessRegistro,
}) => {
  const [dataMantenimiento, setDataMantenimiento] = useState<MantenimientoDTO | null>(null);
  const [openModalM, setOpenModalM] = useState(false);
  const [modalMessageM, setModalMessageM] = useState('');

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalM = () => setOpenModalM(false);

  const handleDeleteDetalleProblema = async (idDetalleProblema: number) => {
    const response = await MantenimientoService.getMantenimientoDetalleProblema(idDetalleProblema);
    if (response && response.statusCode === 200) {
      setDataMantenimiento(response as MantenimientoDTO);
      setModalMessageM(
        `El Detalle Problema con el id ${idDetalleProblema} no puede ser eliminada, 
         ya que está asociada a un mantenimiento`,
      );
      setOpenModalM(true);
      setOpenModal(false);
    } else {
      await DetalleProblemaService.eliminarDetalleProblema(idDetalleProblema)
        .then(() => {
          onSuccessRegistro?.('El detalle problema ha sido eliminada exitosamente');
          setIsDeleted(true);
        })
        .catch((error) => {
          setModalMessage(error.message);
        });
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted
            ? handleCloseModal
            : () => handleDeleteDetalleProblema(selectedRow?.idDetalleProblema || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar Detalle Problema"
        message={modalMessage}
        confirmText={isDeleted ? null : 'Eliminar'}
        cancelText={isDeleted ? 'Cerrar' : 'Cancelar'}
      />
      <ModalDetalleProblemaPorMantenimiento
        open={openModalM}
        onClose={handleCloseModalM}
        title="Detalles del Mantenimiento"
        message={modalMessageM}
        data={dataMantenimiento}
        restablecerData={() => setDataMantenimiento(null)}
      />
    </>
  );
};

export default ModalEliminarDetalleProblema;
