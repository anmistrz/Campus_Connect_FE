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
  Textarea,
  Select,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { PROFILE_VALIDATION } from "../../validation";
import { AiFillCamera } from "react-icons/ai";
import API from "../../services";
import auth from "../../store/Auth";
import { pathFile } from "../../constants";

const EditFormModal = ({
  setData,
  data,
  isOpen,
  onClose,
  getData,
  // optionsFakultas,
  // optionsProdi,
  // isFetching,
}) => {
  console.log(data);
  const updateProfilePic = auth((state) => state.updateProfilePic);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(PROFILE_VALIDATION),
    defaultValues: data,
  });
  const close = () => {
    onClose();
    reset();
  };

  const profilePic = watch("profilePic");
  console.log(typeof profilePic);
  async function onSubmit(values) {
    try {
      console.log(values);
      let filename = values.profilePic;
      if (typeof values.profilePic !== "string") {
        const formData = new FormData();
        formData.append("file", values.profilePic[0]);
        const { data } = await API.uploadFile(formData);
        filename = data.filename;
        updateProfilePic(filename);
      }

      await API.updateUserProfile({
        profilePic: filename,
        id: values.id,
        bio: values.bio,
        link: values.link,
        whatsapp: values.whatsapp,
        linkedin: values.linkedin,
        instagram: values.instagram,
      });
      getData();
      // setData({
      //   ...values,
      //   profilePic: filename,
      // });
      toast({
        title: "Edit profile success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      console.log(error);
      toast({
        title: "Edit profile failed",
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
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent m={8}>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton disabled={isSubmitting} />
          <ModalBody>
            <div className="relative m-auto h-[100px] w-[100px]">
              <Avatar
                height="100px"
                width="100px"
                src={
                  typeof profilePic === "string"
                    ? pathFile + profilePic
                    : profilePic &&
                      profilePic.length > 0 &&
                      URL.createObjectURL(profilePic[0])
                }
              />
              <label
                htmlFor="profilePic"
                className="bg-blue-500 cursor-pointer border-4 border-white rounded-full h-8 w-8 flex items-center justify-center right-0 bottom-0 absolute text-white hover:bg-blue-600"
              >
                <AiFillCamera />
                <input
                  id="profilePic"
                  type="file"
                  {...register("profilePic")}
                  className="hidden"
                />
              </label>
            </div>

            <FormControl isInvalid={errors.name} isDisabled={true}>
              <FormLabel htmlFor="name">Nama</FormLabel>
              <Input id="name" placeholder="name" {...register("name")} />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.bio}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <Textarea
                resize="vertical"
                id="bio"
                placeholder="bio"
                {...register("bio")}
              />
              <FormErrorMessage>
                {errors.bio && errors.bio.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.link}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="link">link</FormLabel>
              <Input id="link" placeholder="link" {...register("link")} />
              <FormErrorMessage>
                {errors.link && errors.link.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.email}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="email" {...register("email")} />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.whatsapp}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="whatsapp">No Whatsapp</FormLabel>
              <Input
                id="whatsapp"
                placeholder="whatsapp"
                {...register("whatsapp")}
              />
              <FormErrorMessage>
                {errors.whatsapp && errors.whatsapp.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.instagram}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="instagram">Username Instagram</FormLabel>
              <Input
                id="instagram"
                placeholder="instagram"
                {...register("instagram")}
              />
              <FormErrorMessage>
                {errors.instagram && errors.instagram.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.linkedin}
              mt={4}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="linkedin">Username LinkedIn</FormLabel>
              <Input
                id="linkedin"
                placeholder="linkedin"
                {...register("linkedin")}
              />
              <FormErrorMessage>
                {errors.linkedin && errors.linkedin.message}
              </FormErrorMessage>
            </FormControl>

            {/* <FormControl isInvalid={errors.nim} mt={4} isDisabled={true}>
              <FormLabel htmlFor="nim">NIM</FormLabel>
              <Input id="nim" placeholder="nim" {...register("nim")} />
              <FormErrorMessage>
                {errors.nim && errors.nim.message}
              </FormErrorMessage>
            </FormControl> */}

            {/* <FormControl
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
            </FormControl> */}

            {/* <FormControl
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
                  optionsFakultas.map((val) => (
                    <option value={val.id}>{val.name}</option>
                  ))}
                {isFetching && <option>Loading...</option>}
              </Select>
              <FormErrorMessage>
                {errors.idFakultas && errors.idFakultas.message}
              </FormErrorMessage>
            </FormControl> */}

            {/* <FormControl
              mt={4}
              isInvalid={errors.idProdi}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="idProdi">Profile</FormLabel>
              <Select
                id="idProdi"
                placeholder="Select option"
                {...register("idProdi")}
              >
                {!isFetching &&
                  optionsProdi &&
                  optionsProdi.map((val) => (
                    <option value={val.id}>{val.name}</option>
                  ))}
                {isFetching && <option>Loading...</option>}
              </Select>
              <FormErrorMessage>
                {errors.idProdi && errors.idProdi.message}
              </FormErrorMessage>
            </FormControl> */}

            {/* <FormControl
              mt={4}
              isInvalid={errors.statusMahasiswa}
              isDisabled={isSubmitting}
            >
              <FormLabel htmlFor="statusMahasiswa">Status Profile</FormLabel>
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
            </FormControl> */}
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
