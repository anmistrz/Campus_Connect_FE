import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";

const NotifModal = ({ setData, id, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m={8}>
        <ModalHeader>Akun berhasil didaftarkan!!</ModalHeader>
        <ModalCloseButton disabled={true} />

        <ModalBody>
          Data akun yang didaftarkan membutuhkan persetujuan dan validasi selama
          beberapa hari kerja oleh tim campus connect sebelum akun kamu aktif,
          pastikan kamu mengecek email yang sudah didaftarkan untuk menerima
          hasil validasi akun kamu
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            YES
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default NotifModal;
