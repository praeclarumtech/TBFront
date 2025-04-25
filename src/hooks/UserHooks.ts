import { useEffect, useState } from "react";

interface TokenProps {
  token: string;
}

const getLoggedInUser = (): TokenProps | null => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return user as unknown as TokenProps;
  }
};

const useProfile = () => {
  const userProfileSession = getLoggedInUser();
  const token = userProfileSession?.token;
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedInUser();
    const token = userProfileSession?.token;
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };