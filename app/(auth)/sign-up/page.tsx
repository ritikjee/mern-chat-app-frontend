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
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Identifier must be at least 3 characters long" })
    .max(255, { message: "Identifier must be at most 255 characters long" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),

  profilePic: z
    .string()
    .optional()
    .default(
      "https://utfs.io/f/4d1bcef1-133e-4cc8-945f-65cd57f57c6a-psn5nt.jpeg"
    ),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

function SignInPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      email: "",
      username: "",
      profilePic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        values
      );
      Cookies.set("horizon_auth_token", res.data.token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });

      toast.success("Account created successfully");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    } finally {
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl">Horizon</CardTitle>
        <CardDescription>
          Please enter your credentials to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-5 md:w-96"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Label>Profile Picture</Label>
            {!form.getValues("profilePic") ? (
              <FormField
                control={form.control}
                name="profilePic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(file) => {
                          field.onChange(file?.[0].url);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <Image
                src={form.getValues("profilePic")}
                alt="profile image"
                width={200}
                height={200}
                className="rounded-full mx-auto"
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John wiltman"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      disabled={loading}
                      {...field}
                    />
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
                    <Input
                      placeholder="Password"
                      type="password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-10" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center">
        Already have an account?{" "}
        <Link href="/sign-in">
          <Button variant={"link"} className="p-1">
            Sign in
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default SignInPage;
