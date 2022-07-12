import React, { useState } from "react";
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
import { CHANGE_PASSWORD_VALIDATION } from "../validation";
// import { AiFillCamera } from "react-icons/ai";
import API from "../services";
import auth from "../store/Auth";

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
  const user = auth((state) => state.user);
  const [error, setError] = useState();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(CHANGE_PASSWORD_VALIDATION),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const close = () => {
    onClose();
    setError(null);
    reset();
  };

  async function onSubmit(values) {
    try {
      console.log(values);

      await API.updatePassword({
        id: user.id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast({
        title: "Change Password success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      close();
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
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
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton disabled={isSubmitting} />
          <ModalBody>
            <FormControl
              isInvalid={errors.oldPassword}
              isDisabled={isSubmitting}
              mt={4}
            >
              <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
              <Input
                type="password"
                id="oldPassword"
                placeholder="oldPassword"
                {...register("oldPassword")}
              />
              <FormErrorMessage>
                {errors.oldPassword && errors.oldPassword.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.newPassword}
              isDisabled={isSubmitting}
              mt={4}
            >
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input
                type="password"
                id="newPassword"
                placeholder="newPassword"
                {...register("newPassword")}
              />
              <FormErrorMessage>
                {errors.newPassword && errors.newPassword.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.confirmNewPassword}
              isDisabled={isSubmitting}
              mt={4}
            >
              <FormLabel htmlFor="confirmNewPassword">
                Retype New Password
              </FormLabel>
              <Input
                type="password"
                id="confirmNewPassword"
                placeholder="confirmNewPassword"
                {...register("confirmNewPassword")}
              />
              <FormErrorMessage>
                {errors.confirmNewPassword && errors.confirmNewPassword.message}
              </FormErrorMessage>
            </FormControl>
            {error && (
              <div className="mt-4  text-center w-full text-red-500">
                {error}
              </div>
            )}
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
