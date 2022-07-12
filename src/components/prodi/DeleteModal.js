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
import API from "../../services";

const DeleteModal = ({ setData, id, isOpen, onClose }) => {
  console.log(id);
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(false);

  async function handleDelete() {
    setIsFetching(true);
    try {
      await API.deleteProdi(id);
      setData((prev) => prev.filter((val) => val.id !== id));
      toast({
        title: "Delete prodi success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Delete prodi failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      onClose();
    }
    setIsFetching(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={isFetching ? () => {} : onClose} isCentered>
      <ModalOverlay />
      <ModalContent m={8}>
        <ModalHeader>Delete Prodi</ModalHeader>
        <ModalCloseButton disabled={isFetching} />

        <ModalBody>Are you sure?</ModalBody>

        <ModalFooter>
          <Button
            onClick={handleDelete}
            mr={3}
            isLoading={isFetching}
            type="submit"
          >
            YES
          </Button>
          <Button
            colorScheme="blue"
            disabled={isFetching}
            onClick={isFetching ? null : onClose}
            variant="ghost"
          >
            NO
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default DeleteModal;
