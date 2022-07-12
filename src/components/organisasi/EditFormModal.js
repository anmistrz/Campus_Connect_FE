import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormHelperText,
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
import { ORGANISASI_VALIDATION } from "../../validation";
import API from "../../services";

const EditFormModal = ({ setData, value, isOpen, onClose }) => {
  console.log(value);
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ORGANISASI_VALIDATION),
    defaultValues: {
      id: value.id,
      name: value.name,
      email: value.email,
      userType: value.userType,
      idUserUniversitas: value.organisasi.idUserUniversitas,
      universitas: value.organisasi.universitas,
      idOrganisasi: value.idOrganisasi,
    },
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);
      const res = await API.updateUser(values);
      console.log(res.data);
      setData((prev) =>
        prev.map((oldVal) => (oldVal.id === value.id ? res.data.data : oldVal))
      );
      toast({
        title: "Edit organisasi success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Edit organisasi failed",
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent m={8}>
          <ModalHeader>Edit Organisasi</ModalHeader>
          <ModalCloseButton disabled={isSubmitting} />
          <ModalBody>
            <FormControl isInvalid={errors.name} isDisabled={isSubmitting}>
              <FormLabel htmlFor="name">Nama Organisasi</FormLabel>
              <Input id="name" placeholder="name" {...register("name")} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.email}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="email" {...register("email")} />
              <FormHelperText>
                Password akun organisasi akan otomatis digenerate random dan
                dikirimkan melalui email ini
              </FormHelperText>
              <FormErrorMessage>
                {errors.email && errors.email.message}
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
        </ModalContent>
      </form>
    </Modal>
  );
};
export default EditFormModal;
