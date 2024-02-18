import { cookies } from "next/headers";
import axios from "axios";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
  token: string;
}

export async function getServerSideUser(): Promise<User | null> {
  const Cookies = cookies();

  const token = Cookies.get("horizon_auth_token");
  if (!token) {
    return null;
  }

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/me`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    return {
      ...data,
      token: token.value,
    };
  } catch (error) {
    return null;
  }
}
