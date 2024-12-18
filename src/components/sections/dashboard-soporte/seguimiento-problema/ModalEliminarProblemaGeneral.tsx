import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { useState } from 'react';
import ReusableModal from 'components/common/ResuableDialog';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import { ProblemaGeneralService } from 'data/services/ProblemaGeneralService';

interface ModalEliminarProblemaGeneralProps {
  selectedRow: ProblemaGeneralDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message?: string) => void;
}

const ModalEliminarProblemaGeneral: React.FC<ModalEliminarProblemaGeneralProps> = ({
  selectedRow,
  modalMessage,
  openModal,
  isDeleted,
  setOpenModal,
  setIsDeleted,
  onSuccessRegistro,
}) => {
  const [openModalM, setOpenModalM] = useState(false);
  const [modalMessageM, setModalMessageM] = useState('');

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalM = () => setOpenModalM(false);

  const handleDeleteProblemaGeneral = async (idProblemaGeneral: number) => {
    const response = await ProblemaGeneralService.deleteProblemaGeneral(idProblemaGeneral);
    if (response && response.statusCode !== 200) {
      setModalMessageM(
        `El seguimiento con el código ${selectedRow?.codigoProblemaGeneral} no puede ser eliminado, 
         porque tiene registros de detalle de problema`,
      );
      setOpenModalM(true);
      setOpenModal(false);
    } else {
      setIsDeleted(true);
      onSuccessRegistro?.('El seguimiento de problema general ha sido eliminado');
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted
            ? handleCloseModal
            : () => handleDeleteProblemaGeneral(selectedRow?.idProblemaGeneral || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar Seguimiento de Problema General"
        message={modalMessage}
        confirmText={isDeleted ? null : 'Eliminar'}
        cancelText={isDeleted ? 'Cerrar' : 'Cancelar'}
      />
      <ReusableModal
        open={openModalM}
        onClose={handleCloseModalM}
        title="Mensaje"
        message={modalMessageM}
      />
    </>
  );
};

export default ModalEliminarProblemaGeneral;
