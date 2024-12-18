import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import React, { useState } from 'react';
import UserService from 'data/services/UserService';
import ReusableModal from 'components/common/ResuableDialog';
import { UsuarioDTO } from 'data/interfaces/UserDTO';

interface ModalEliminarUsuarioProps {
  selectedRow: UsuarioDTO | null;
  modalMessage: string;
  openModal: boolean;
  isDeleted: boolean;
  setOpenModal: (open: boolean) => void;
  setIsDeleted: (deleted: boolean) => void;
  onSuccessRegistro: (message?: string) => void;
}

const ModalEliminarUsuario: React.FC<ModalEliminarUsuarioProps> = ({
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

  const handleDeleteUsuario = async (idUsuario: number) => {
    const response = await UserService.deleteUser(idUsuario);
    if (response && response.statusCode !== 204) {
      setModalMessageM(
        'El usuario no puede ser eliminado, porque tiene registros en el sistema',
      );
      setOpenModalM(true);
      setOpenModal(false);
    } else {
      onSuccessRegistro?.('El usuario ha sido eliminado');
      setIsDeleted(true);
    }
  };

  return (
    <>
      <ReusableModalDouble
        open={openModal}
        onClick={
          isDeleted ? handleCloseModal : () => handleDeleteUsuario(selectedRow?.idUsuario || 0)
        }
        onClose={handleCloseModal}
        title="Eliminar Usuario"
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

export default React.memo(ModalEliminarUsuario);