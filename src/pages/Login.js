import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../services";
import auth from "../store/Auth";
import asset1 from "../assets/asset1.svg";
import { Link } from "react-router-dom";

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
      setError(error.response.data.message);
    }
  };

  return (
    <div className="p-5 w-full h-[100vh] bg-white flex justify-center items-center text-left gap-[60px]">
      <div class="hidden md:block">
        {/* <div class="font-bold text-3xl">Campus Connect</div> */}
        <img src={asset1} className="max-h-[350px]" alt="" />
      </div>

      <div className="rounded-lg bg-gray-100 p-10 flex justify-start items-center flex-col space-y-6 min-w-[300px] max-w-[350px]">
        <div className="space-y-3">
          <h1 className="font-bold text-xl">Login to your account</h1>
          <p className="text-gray-400 text-sm">
            Enter your credential to acces your account
          </p>
          <a
            className="text-blue-500"
            href="https://docs.google.com/spreadsheets/d/1f2DXnmTtkCnnI6zL2y_p8e-k807KPe0YFMNWpz-o7_k/edit?usp=sharing"
          >
            List Users untuk login (link sementara)
          </a>
        </div>

        <form
          className=" flex flex-col w-full gap-4 p-2"
          onSubmit={handleSubmit(submit)}
        >
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
            isLoading={isSubmitting}
            type="submit"
          >
            LOGIN
          </Button>
        </form>

        <div className="text-gray-500 mt-10">
          Belum punya akun? Minta kampusmu untuk
          <Link to="/signup" className="inline text-blue-500">
            {" "}
            mendaftar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
