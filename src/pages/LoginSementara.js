import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../services";
import auth from "../store/Auth";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const loginSuccess = auth((state) => state.loginSuccess);

  const navigate = useNavigate();

  const [error, setError] = useState();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    // resolver: yupResolver(PRODI_VALIDATION),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (data) => {
    try {
      const res = await API.signin(data);
      loginSuccess({ user: res.data.data });

      navigate(res.data.data.userType === "admin" ? "/users" : "/home");
    } catch (error) {
      console.log(error.response.data.message);
      const message = ["password salah", "username tidak ditemukan"];
      if (message.includes(error.response.data.message)) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong...");
      }
    }
  };

  return (
    <div className="p-5 w-full h-[100vh] bg-gray-100 flex justify-center items-center text-center flex-col">
      <div className="rounded-lg bg-white p-10 flex justify-start items-center flex-col space-y-6">
        <div className="space-y-3">
          <h1 className="font-bold text-xl">Login Page Sementara</h1>
          <p className="text-gray-400 text-sm">
            Enter your credential to acces your account
          </p>
          <a
            className="text-blue-500"
            href="https://docs.google.com/spreadsheets/d/1f2DXnmTtkCnnI6zL2y_p8e-k807KPe0YFMNWpz-o7_k/edit?usp=sharing"
          >
            List Dummy User
          </a>
        </div>

        <form className="w-full space-y-6" onSubmit={handleSubmit(submit)}>
          {/* <FormControl isInvalid={errors.id} mt={4} isDisabled={isSubmitting}>
            <FormLabel htmlFor="id">Id</FormLabel>
            <Input id="id" placeholder="id" {...register("id")} />
            <FormErrorMessage>
              {errors.id && errors.id.message}
            </FormErrorMessage>
          </FormControl> */}
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
            isInvalid={errors.password}
            mt={4}
            isDisabled={isSubmitting}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="password"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <p
            className={`text-sm text-red-500  ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </p>
          <Button
            w="100%"
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            LOGIN
          </Button>
        </form>
      </div>
      <div className="text-gray-500 mt-10">
        forgot your password?
        <p className="inline text-blue-500"> Reset Password</p>
      </div>
    </div>
  );
};

export default Login;
