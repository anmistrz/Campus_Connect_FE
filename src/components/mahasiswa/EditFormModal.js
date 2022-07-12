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
  Select,
} from "@chakra-ui/react";
import { MAHASISWA_VALIDATION } from "../../validation";
import API from "../../services";

const EditFormModal = ({
  setData,
  value,
  isOpen,
  onClose,
  optionsFakultas,
  optionsProdi,
  isFetching,
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
    resolver: yupResolver(MAHASISWA_VALIDATION),
    defaultValues: {
      id: value.id,
      name: value.name,
      email: value.email,
      userType: "mahasiswa",
      semester: value.mahasiswa.semester,
      nim: value.mahasiswa.nim,
      statusMahasiswa: value.mahasiswa.statusMahasiswa,
      idUserUniversitas: value.mahasiswa.idUserUniversitas,
      universitas: value.mahasiswa.universitas,
      idFakultas: value.mahasiswa.idFakultas,
      idProdi: value.mahasiswa.idProdi,
      idMahasiswa: value.idMahasiswa,
    },
  });
  const idFakultas = watch("idFakultas");
  const close = () => {
    onClose();
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);
      const res = await API.updateUser(values);

      setData((prev) =>
        prev.map((oldVal) => (oldVal.id === value.id ? res.data.data : oldVal))
      );
      toast({
        title: "Edit mahasiswa success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Edit mahasiswa failed",
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
            <FormControl isInvalid={errors.name} isDisabled={isSubmitting}>
              <FormLabel htmlFor="name">Nama Mahasiswa</FormLabel>
              <Input id="name" placeholder="name" {...register("name")} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.nim}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="nim">NIM</FormLabel>
              <Input id="nim" placeholder="nim" {...register("nim")} />
              <FormErrorMessage>
                {errors.nim && errors.nim.message}
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
                Password akun mahasiswa akan otomatis digenerate random dan
                dikirimkan melalui email ini
              </FormHelperText>
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.semester}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="semester">Semester</FormLabel>
              <Input
                id="semester"
                placeholder="semester"
                {...register("semester")}
              />
              <FormErrorMessage>
                {errors.semester && errors.semester.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
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
                  optionsFakultas &&
                  optionsFakultas.map((val, i) => (
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
              mt={4}
              isInvalid={errors.idProdi}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="idProdi">Prodi</FormLabel>
              <Select
                id="idProdi"
                placeholder="Select option"
                {...register("idProdi")}
              >
                {!isFetching &&
                  optionsProdi &&
                  optionsProdi
                    .filter((val) => val.idFakultas === parseInt(idFakultas))
                    .map((val, i) => (
                      <option key={i} value={val.id}>
                        {val.namaProdi}
                      </option>
                    ))}
                {isFetching && <option>Loading...</option>}
              </Select>
              <FormErrorMessage>
                {errors.idProdi && errors.idProdi.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={errors.statusMahasiswa}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="statusMahasiswa">Status Mahasiswa</FormLabel>
              <Select
                id="statusMahasiswa"
                placeholder="Select option"
                {...register("statusMahasiswa")}
              >
                <option value="aktif">Aktif</option>
                <option value="alumni">alumni</option>
              </Select>
              <FormErrorMessage>
                {errors.statusMahasiswa && errors.statusMahasiswa.message}
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
