import React from "react";
import {
  Input,
  Button,
  Avatar,
  FormControl,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import auth from "../../store/Auth";
import { MdInsertPhoto } from "react-icons/md";
import { useForm } from "react-hook-form";
import API from "../../services";
import { CREATE_POST_VALIDATION } from "../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { pathFile } from "../../constants";
import {} from "@chakra-ui/react";

const CreatePost = ({ setData }) => {
  const user = auth((state) => state.user);

  let idUserUniversitas;
  if (user.userType === "universitas") {
    idUserUniversitas = user.id;
  } else if (user.userType === "mahasiswa") {
    idUserUniversitas = user.mahasiswa.idUserUniversitas;
  } else if (user.userType === "organisasi") {
    idUserUniversitas = user.organisasi.idUserUniversitas;
  }

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(CREATE_POST_VALIDATION),
    defaultValues: {
      caption: "",
      image: "",
      isNews: "",
      idUser: user.id,
      idUserUniversitas,
    },
  });
  const toast = useToast();

  const image = watch("image");
  // console.log(image);
  async function onSubmit(values) {
    //setValue("image", inputImage);
    try {
      console.log(values);
      let filename = "";
      if (typeof values.image !== "string") {
        const formData = new FormData();
        formData.append("file", values.image[0]);
        const { data } = await API.uploadFile(formData);
        // console.log(data);
        filename = data.filename;
        console.log(filename);
      }

      const res = await API.createPost({
        idUser: user.id,
        materi: filename,
        caption: values.caption,
        isNews: values.isNews,
        idUserUniversitas: idUserUniversitas,
      });
      console.log(res.data);
      reset();
      toast({
        title: "Upload post success",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
      setData((prev) => [res.data.data, ...prev]);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      toast({
        title: "Upload post failed",
        description: "Something went wrong...",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  const removeSelectedImage = () => {
    setValue("image", "");
  };

  return (
    <div class="bg-white rounded-lg p-3 flex w-full  justify-center gap-3">
      <div class="flex flex-col justify-start">
        <Avatar
          src={user.profilePic !== "" ? pathFile + user.profilePic : ""}
          height={10}
          width={10}
        />
        <div class="flex-1"></div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        class="w-full flex flex-col gap-3"
      >
        <FormControl isInvalid={errors.caption} isDisabled={isSubmitting}>
          <Input
            id="caption"
            placeholder="Apa yang sedang anda pikirkan ?"
            {...register("caption")}
            borderRadius="full"
            className=""
          />
          <FormErrorMessage>
            {errors.caption && errors.caption.message}
          </FormErrorMessage>
        </FormControl>

        {image && (
          <>
            <img
              className="h-30"
              src={URL.createObjectURL(image[0])}
              alt="ssadas"
            />
            <Button
              onClick={removeSelectedImage}
              className=" text-white w-full cursor-pointer mt-1 p-15"
              colorScheme="red"
            >
              Remove This Image
            </Button>
          </>
        )}
        <div
          className={`grid  ${
            user.userType !== "mahasiswa" ? "grid-cols-3" : "grid-cols-2"
          }  gap-3`}
        >
          <label
            htmlFor="fileInput"
            className="bg-blue-500 cursor-pointer border-white rounded-full h-10  flex items-center justify-center  text-white "
          >
            <MdInsertPhoto />
            <input
              {...register("image")}
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
            />
            <p className="font-semibold">Photo</p>
          </label>
          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="messenger"
            borderRadius="full"
            variant="solid"
            onClick={() => {
              setValue("isNews", false);
            }}
          >
            Share
          </Button>
          {user?.userType !== "mahasiswa" && (
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="messenger"
              borderRadius="full"
              variant="solid"
              onClick={() => {
                setValue("isNews", true);
              }}
            >
              Share as News
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default CreatePost;
