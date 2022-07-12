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
import { STRUKTUR_ORGANISASI_VALIDATION } from "../../validation";
import auth from "../../store/Auth";
import API from "../../services";

const EditFormModal = ({
  setData,
  value,
  isOpen,
  onClose,
  optionsMahasiswa,
  isFetching,
}) => {
  console.log(value);
  const user = auth((state) => state.user);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(STRUKTUR_ORGANISASI_VALIDATION),
    defaultValues: {
      id: value.mahasiswa.idJabatan,
      namaJabatan: value.mahasiswa.jabatan.namaJabatan,
      idMahasiswa: value.idMahasiswa,
      idUserMahasiswa: value.id,
      namaOrganisasi: user.name,
      idUserOrganisasi: user.id,
    },
  });
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      values.idMahasiswa = optionsMahasiswa.filter(
        (val) => val.id === values.idUserMahasiswa
      )[0].idMahasiswa;
      console.log(values);
      const res = await API.updateJabatan(values);
      setData((prev) =>
        prev.map((oldVal) => (oldVal.id === value.id ? res.data.data : oldVal))
      );
      toast({
        title: "Edit struktur organisasi success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Edit struktur organisasi failed",
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
          <ModalHeader>Edit Struktur Organisasi</ModalHeader>
          <ModalCloseButton disabled={isSubmitting} />
          <ModalBody>
            <FormControl
              isInvalid={errors.namaJabatan}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="namaJabatan">namaJabatan</FormLabel>
              <Input
                id="namaJabatan"
                placeholder="namaJabatan"
                {...register("namaJabatan")}
              />
              <FormErrorMessage>
                {errors.namaJabatan && errors.namaJabatan.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={errors.idUserMahasiswa}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="idUserMahasiswa">Mahasiswa</FormLabel>
              <Select
                id="idUserMahasiswa"
                placeholder="Select option"
                {...register("idUserMahasiswa")}
              >
                {!isFetching &&
                  optionsMahasiswa &&
                  optionsMahasiswa.map((val, i) => (
                    <option key={i} value={val.id}>
                      {val.name}
                    </option>
                  ))}
                {isFetching && <option>Loading...</option>}
              </Select>
              <FormErrorMessage>
                {errors.idUserMahasiswa && errors.idUserMahasiswa.message}
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
