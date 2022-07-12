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
import auth from "../../store/Auth";
import API from "../../services";

const CreateFormModal = ({ setData, isOpen, onClose }) => {
  const user = auth((state) => state.user);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(FAKULTAS_VALIDATION),
    defaultValues: {
      namaFakultas: "",
      idUserUniversitas: user.id,
    },
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    console.log("asik");
    try {
      console.log(values);
      const res = await API.createFakultas(values);
      console.log(res.data);
      setData((prev) => [res.data.data, ...prev]);

      toast({
        title: "Create fakultas success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Create fakultas failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : close}
      isCentered
      m={20}
    >
      <ModalOverlay />
      <ModalContent m={8}>
        <ModalHeader>Create Fakultas</ModalHeader>
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
                placeholder="nama Fakultas"
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

export default CreateFormModal;
