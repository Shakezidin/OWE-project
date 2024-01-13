import { getLoggedInUserData, resetStorageData } from "../utils/Helper";

const Auth = {
  isAuthenticated: false,
  authenticate() {
    return getLoggedInUserData() || false;
  },
  logOut() {
    resetStorageData();
    window.location.reload();
  },
};
export default Auth;
