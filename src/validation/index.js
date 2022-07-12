import * as Yup from "yup";

export const FAKULTAS_VALIDATION = Yup.object().shape({
  namaFakultas: Yup.string().required("Required"),
});
export const PRODI_VALIDATION = Yup.object().shape({
  idFakultas: Yup.number().typeError("required").required("Required"),
  namaProdi: Yup.string().required("Required"),
});
export const MAHASISWA_VALIDATION = Yup.object().shape({
  name: Yup.string().required("Required"),
  nim: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  semester: Yup.number()
    .typeError("semester must be a number")
    .required("Required"),
  idFakultas: Yup.number().typeError("required").required("Required"),
  idProdi: Yup.number().typeError("required").required("Required"),
  statusMahasiswa: Yup.string().required("Required"),
  userType: Yup.string().required("Required"), //mahasiswa ,organisasi, universitas, admin
  idUserUniversitas: Yup.number().required("Required"),
});
export const PROFILE_VALIDATION = Yup.object().shape({
  name: Yup.string().required("Required"),
  bio: Yup.string(),
  link: Yup.string(),
  email: Yup.string().email().required("Required"),
  whatsapp: Yup.string(),
  instagram: Yup.string(),
  linkedin: Yup.string(),
  // nim: Yup.string().required("Required"),
  // semester: Yup.number()
  //   .typeError("semester must be a number")
  //   .required("Required"),
  // idFakultas: Yup.number().typeError("required").required("Required"),
  // idProdi: Yup.number().typeError("required").required("Required"),
  // statusMahasiswa: Yup.string().required("Required"),
  // userType: Yup.string().required("Required"), //mahasiswa ,organisasi, universitas, admin
  // idUserUniversitas: Yup.number().required("Required"),
});
export const ORGANISASI_VALIDATION = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  userType: Yup.string().required("Required"), //mahasiswa ,organisasi, universitas, admin
  idUserUniversitas: Yup.number().required("Required"),
});
export const STRUKTUR_ORGANISASI_VALIDATION = Yup.object().shape({
  idUserOrganisasi: Yup.number().typeError("required").required("Required"),
  // idMahasiswa: Yup.number().typeError("required").required("Required"),
  idUserMahasiswa: Yup.number().typeError("required").required("Required"),
  namaJabatan: Yup.string().required("Required"), //mahasiswa ,organisasi, universitas, admin
  namaOrganisasi: Yup.string().required("Required"), //mahasiswa ,organisasi, universitas, admin
});

export const CHANGE_PASSWORD_VALIDATION = Yup.object().shape({
  oldPassword: Yup.string().required("Required"),
  newPassword: Yup.string().required("Required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords didnt match")
    .required("Required"),
});
export const SIGNUP_VALIDATION = Yup.object().shape({
  name: Yup.string().required("Required"),
  alamat: Yup.string().required("Required"),
  namaRektor: Yup.string().required("Required"),
  // ktpRektor: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  password: Yup.string().required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords didnt match")
    .required("Required"),
});

export const CREATE_POST_VALIDATION = Yup.object().shape({
  caption: Yup.string().required("Required"),
});
