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
  Select,
} from "@chakra-ui/react";
import auth from "../../store/Auth";
import API from "../../services";
import { PRODI_VALIDATION } from "../../validation";

const CreateFormModal = ({
  setData,
  isOpen,
  onClose,
  fakultas,
  isFetching,
}) => {
  const user = auth((state) => state.user);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(PRODI_VALIDATION),
    defaultValues: {
      namaProdi: "",
      idFakultas: "",
      idUserUniversitas: user.id,
    },
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);
      const res = await API.createProdi(values);
      setData((prev) => [res.data.data, ...prev]);

      toast({
        title: "Create prodi success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Create prodi failed",
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
        <ModalHeader>Create Prodi</ModalHeader>
        <ModalCloseButton disabled={isSubmitting} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl
              isInvalid={errors.idFakultas}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="idFakultas">Fakultas</FormLabel>
              <Select
                id="idFakultas"
                placeholder="Select option"
                {...register("idFakultas")}
              >
                {!isFetching &&
                  fakultas &&
                  fakultas.map((val, i) => (
                    <option key={i} value={val.id}>
                      {val.namaFakultas}
                    </option>
                  ))}
                {isFetching && <option>Loading...</option>}
              </Select>
              <FormErrorMessage>
                {errors.idFakultas && errors.idFakultas.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.namaProdi}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="namaProdi">Nama Prodi</FormLabel>
              <Input
                id="namaProdi"
                placeholder="namaProdi"
                {...register("namaProdi")}
              />
              <FormErrorMessage>
                {errors.namaProdi && errors.namaProdi.message}
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
