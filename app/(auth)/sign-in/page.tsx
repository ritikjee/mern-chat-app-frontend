"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier must be at least 3 characters long" })
    .max(255, { message: "Identifier must be at most 255 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function SignInPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        values
      );

      toast.success("Sign in successful!");
      Cookies.set("horizon_auth_token", res.data.token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });

      router.push("/");

      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    } finally {
      form.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Horizon</CardTitle>
        <CardDescription>
          Please enter your credentials to log in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-5 md:w-96"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-10" type="submit">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center">
        Do not have an account?{" "}
        <Link href="/sign-up">
          {" "}
          <Button variant={"link"} className="p-1">
            Sign up
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default SignInPage;
