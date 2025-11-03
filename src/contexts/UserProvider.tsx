import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated } from "utils/commonFunctions";
import { getProfile } from "api/usersApi";
import LoadingSpinner from "components/LoadingSpinner";
import { UserResponse } from "interfaces/user.interface";
import MESSAGES from "constants/messageConstants";
import toastify from "utils/toastify";

type UserContextType = {
  user: UserResponse | null;
  isLoading: boolean;
  refetch: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refetch: () => {},
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(MESSAGES.ERROR.USE_USER_MUST_BE_USED_WITHIN_A_USER_PROVIDER.toString());
  }
  return context;
};

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);

      if (!isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await getProfile({});

      if (response?.success && response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      toastify(MESSAGES.ERROR.SOMETHING_WRONG.toString(), {
        type: "error",
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchUserProfile();
    };

    const handleAuthChange = () => {
      fetchUserProfile();
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("authChange", handleAuthChange);

    const interval = setInterval(() => {
      const isAuth = isAuthenticated();
      if (isAuth && !user) {
        fetchUserProfile();
      } else if (!isAuth && user) {
        setUser(null);
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
      clearInterval(interval);
    };
  }, [user]);

  const value = {
    user,
    isLoading,
    refetch,
  };

  if (isLoading && isAuthenticated()) {
    return <LoadingSpinner />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
