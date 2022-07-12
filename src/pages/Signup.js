import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../services";
import auth from "../store/Auth";
import asset1 from "../assets/asset1.svg";
import { SIGNUP_VALIDATION } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiFillCamera } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import NotifModal from "../components/signup/NotifModal";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const loginSuccess = auth((state) => state.loginSuccess);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SIGNUP_VALIDATION),
    defaultValues: {
      name: "",
      alamat: "",
      namaRektor: "",
      ktpRektor: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const ktpRektor = watch("ktpRektor");
  const submit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("file", values.ktpRektor[0]);
      const { data } = await API.uploadFile(formData);
      console.log(data);
      const res = await API.signup({
        name: values.name,
        alamat: values.alamat,
        namaRektor: values.namaRektor,
        ktpRektor: data.filename,
        email: values.email,
        password: values.password,
      });

      console.log(res.data);
      reset();
      onOpen();
      setError(null);
    } catch (error) {
      console.log(error.response?.data?.message);

      setError(error.response.data.message);
    }
  };

  return (
    <div className="p-5 w-full h-[100vh] bg-white flex justify-center items-center text-left gap-[60px]">
      <NotifModal isOpen={isOpen} onClose={onClose} />
      <div class="hidden md:block">
        {/* <div class="font-bold text-3xl">Campus Connect</div> */}
        <img src={asset1} className="max-h-[350px]" alt="" />
      </div>

      <div className="rounded-lg bg-gray-100 p-10 flex justify-start items-center flex-col space-y-6  min-w-[300px] max-w-[350px]">
        <h1 className="font-bold text-xl w-full">Signup as University</h1>

        <form
          className="p-2 flex flex-col w-full gap-4 overflow-y-auto max-h-[450px]"
          onSubmit={handleSubmit(submit)}
        >
          <FormControl isInvalid={errors.name} isDisabled={isSubmitting}>
            <FormLabel htmlFor="name">Nama Universitas</FormLabel>
            <Input id="name" placeholder="name" {...register("name")} />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.alamat} isDisabled={isSubmitting}>
            <FormLabel htmlFor="alamat">Alamat Universitas</FormLabel>
            <Input id="alamat" placeholder="alamat" {...register("alamat")} />
            <FormErrorMessage>
              {errors.alamat && errors.alamat.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.namaRektor} isDisabled={isSubmitting}>
            <FormLabel htmlFor="namaRektor">Nama Rektor</FormLabel>
            <Input
              id="namaRektor"
              placeholder="namaRektor"
              {...register("namaRektor")}
            />
            <FormErrorMessage>
              {errors.namaRektor && errors.namaRektor.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.ktpRektor} isDisabled={isSubmitting}>
            <FormLabel htmlFor="ktpRektor">
              KTP Rektor (untuk validasi)
            </FormLabel>
            <div class="flex justify-center overflow-hidden  items-center relative rounded-lg bg-gray-200 min-h-[100px] max-h-[200px] w-full">
              {ktpRektor && (
                <img
                  src={URL.createObjectURL(ktpRektor[0])}
                  className="w-full brightness-50"
                  alt=""
                />
              )}
              <label
                htmlFor="addFile"
                className={`cursor-pointer absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center h-10 w-10 text-white   bg-blue-500 hover:bg-blue-600 rounded-full transition-all`}
              >
                <AiFillCamera size="1.2rem" />
              </label>
            </div>
            <input
              className="hidden"
              type="file"
              {...register("ktpRektor")}
              id="addFile"
            />
            <FormErrorMessage>
              {errors.ktpRektor && errors.ktpRektor.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email} isDisabled={isSubmitting}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" placeholder="email" {...register("email")} />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} isDisabled={isSubmitting}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="password"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={errors.confirmPassword}
            isDisabled={isSubmitting}
          >
            <FormLabel htmlFor="confirmPassword">Confrim Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="confirmPassword"
              {...register("confirmPassword")}
            />
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
          {error && (
            <p
              className={`text-sm text-red-500  ${
                error ? "opacity-100" : "opacity-0"
              }`}
            >
              {error}
            </p>
          )}
          <Button
            w="100%"
            colorScheme="blue"
            className="shrink-0"
            isLoading={isSubmitting}
            type="submit"
          >
            SIGNUP
          </Button>
        </form>
        <div className="text-gray-500 mt-10">
          sudah punya akun?
          <Link to="/signin" className="inline ml-1 text-blue-500">
            Login sekarang
          </Link>
        </div>
      </div>
      {/* <div className="text-gray-500 mt-10">
        forgot your password?
        <p className="inline text-blue-500"> Reset Password</p>
      </div> */}
    </div>
  );
};

export default Signup;
