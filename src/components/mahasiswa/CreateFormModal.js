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
  FormHelperText,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Select,
} from "@chakra-ui/react";

import auth from "../../store/Auth";
import API from "../../services";

import { MAHASISWA_VALIDATION } from "../../validation";

const CreateFormModal = ({
  setData,
  isOpen,
  onClose,
  optionsFakultas,
  optionsProdi,
  isFetching,
}) => {
  const user = auth((state) => state.user);
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
      name: "",
      nim: "",
      email: "",
      semester: "",
      idFakultas: "",
      idProdi: "",
      statusMahasiswa: "",
      userType: "mahasiswa", //mahasiswa ,organisasi, universitas, admin
      universitas: user.name,
      idUserUniversitas: user.id,
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
      const res = await API.createUser(values);

      setData((prev) => [res.data.data, ...prev]);

      toast({
        title: "Create mahasiswa success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      toast({
        title: "Create mahasiswa failed",
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
          <ModalHeader>Create Mahasiswa</ModalHeader>
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
                {!idFakultas && <option>Pick Fakultas First</option>}
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

export default CreateFormModal;
