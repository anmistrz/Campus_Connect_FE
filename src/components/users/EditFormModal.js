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
// import { MAHASISWA_VALIDATION } from "../../validation";
import API from "../../services";
import { pathFile } from "../../constants";

const EditFormModal = ({
  setData,
  value,
  isOpen,
  onClose,
  optionsFakultas,
  optionsProdi,
  isFetching,
  isVerified,
}) => {
  console.log(value);
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    // resolver: yupResolver(MAHASISWA_VALIDATION),
    defaultValues: {
      id: value.id,
      name: value.name,
      email: value.email,
      userType: value.userType,
      namaRektor: value.universitas.namaRektor,
      isVerified: value.universitas.isVerified,
      ktpRektor: value.universitas.ktpRektor,
      alamat: value.universitas.alamat,
      idUniversitas: value.idUniversitas,
    },
  });
  const idFakultas = watch("idFakultas");
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      if (values.isVerified === "true") values.isVerified = true;
      if (values.isVerified === "false") values.isVerified = false;
      console.log(values);
      console.log(typeof values.isVerified);
      const res = await API.updateVerified({
        id: values.id,
        name: values.name,
        email: values.email,
        userType: values.userType,
        isVerified: values.isVerified,
      });

      setData((prev) =>
        prev
          .map((oldVal) => (oldVal.id === value.id ? res.data.data : oldVal))
          .filter((oldVal) => oldVal.universitas.isVerified === isVerified)
      );
      // setData((prev) =>
      //   prev.filter((oldVal) => oldVal.universitas.isVerified === isVerified)
      // );
      toast({
        title: "Edit user success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Edit user failed",
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
          <ModalHeader>Edit Mahasiswa</ModalHeader>
          <ModalCloseButton disabled={isSubmitting} />
          <ModalBody>
            <FormControl
              mt={4}
              isInvalid={errors.statusMahasiswa}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="isVerified">Status Universitas</FormLabel>
              <Select
                id="isVerified"
                placeholder="Select option"
                {...register("isVerified")}
              >
                <option value={true}>verified</option>
                <option value={false}>unverified</option>
              </Select>
              <FormErrorMessage>
                {errors.isVerified && errors.isVerified.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={errors.name} isDisabled={true}>
              <FormLabel htmlFor="name">Nama Universitas</FormLabel>
              <Input id="name" placeholder="name" {...register("name")} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={errors.alamat} isDisabled={true}>
              <FormLabel htmlFor="alamat">Alamat</FormLabel>
              <Input id="alamat" placeholder="alamat" {...register("alamat")} />
              <FormErrorMessage>
                {errors.alamat && errors.alamat.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mt={4} isDisabled={true}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="email" {...register("email")} />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.namaRektor} mt={4} isDisabled={true}>
              <FormLabel htmlFor="namaRektor">namaRektor</FormLabel>
              <Input
                id="namaRektor"
                placeholder="namaRektor"
                {...register("namaRektor")}
              />
              <FormErrorMessage>
                {errors.namaRektor && errors.namaRektor.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="namaRektor">Ktp Rektor</FormLabel>

              <img
                className="rounded-lg w-full"
                src={
                  value.universitas.ktpRektor
                    ? pathFile + value.universitas.ktpRektor
                    : ""
                }
                alt=""
              />
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
