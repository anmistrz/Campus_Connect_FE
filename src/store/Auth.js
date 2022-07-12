import create from "zustand";

const INITIAL_STATE = JSON.parse(localStorage.getItem("user")) || null;

const auth = create((set) => ({
  user: INITIAL_STATE,
  isFetching: false,
  loginStart: () => set(() => ({ isFetching: true })),
  loginSuccess: ({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
    set(() => ({ isFetching: false, user }));
  },
  updateProfilePic: (profilePic) => {
    set((state) => {
      state.user.profilePic = profilePic;
      localStorage.setItem("user", JSON.stringify(state.user));
      return { ...state.user };
    });
  },
  logout: () => {
    localStorage.setItem("user", null);
    set(() => ({ user: null }));
  },
}));

export default auth;
