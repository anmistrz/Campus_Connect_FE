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

import auth from "../../store/Auth";
import API from "../../services";

import { ORGANISASI_VALIDATION } from "../../validation";

const CreateFormModal = ({ setData, isOpen, onClose }) => {
  const user = auth((state) => state.user);
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(ORGANISASI_VALIDATION),
    defaultValues: {
      name: "",
      email: "",
      userType: "organisasi", //organisasi ,organisasi, universitas, admin
      idUserUniversitas: user.id,
      universitas: user.name,
    },
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);
      const res = await API.createUser(values);
      setData((prev) => [res.data.data, ...prev]);

      toast({
        title: "Create organisasi success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Create organisasi failed",
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
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent m={8}>
          <ModalHeader>Create Organisasi</ModalHeader>
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

export default CreateFormModal;
