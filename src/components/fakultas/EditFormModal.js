import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FAKULTAS_VALIDATION } from "../../validation";
import API from "../../services";

const EditFormModal = ({ setData, value, isOpen, onClose }) => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(FAKULTAS_VALIDATION),
    defaultValues: value,
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);
      await API.updateFakultas(values);
      setData((prev) =>
        prev.map((oldVal) => (oldVal.id === value.id ? values : oldVal))
      );
      toast({
        title: "Edit fakultas success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Edit fakultas failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={isSubmitting ? () => {} : close} isCentered>
      <ModalOverlay />
      <ModalContent m={8}>
        <ModalHeader>Edit Fakultas</ModalHeader>
        <ModalCloseButton disabled={isSubmitting} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl
              isInvalid={errors.namaFakultas}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="namaFakultas">Nama Fakultas</FormLabel>
              <Input
                id="namaFakultas"
                placeholder="namaFakultas"
                {...register("namaFakultas")}
              />
              <FormErrorMessage>
                {errors.namaFakultas && errors.namaFakultas.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={isSubmitting}
              type="submit"
            >
              SAVE
            </Button>
            <Button
              disabled={isSubmitting}
              onClick={isSubmitting ? null : close}
              variant="ghost"
            >
              CANCEL
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditFormModal;
