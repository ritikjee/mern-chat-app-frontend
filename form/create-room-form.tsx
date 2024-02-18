"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be greater than 3 character" })
    .max(255, { message: "Name must be less than 255 character" }),

  imageUrl: z
    .string()
    .optional()
    .default(
      "https://utfs.io/f/79561200-e86c-4fb8-8785-2d90ba3da4a2-ca7koy.jpg"
    ),
});

function CreateRoom({ userId, token }: { userId: string; token: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/create-room`,
        {
          userId,
          name: values.name,
          profile: values.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Room created");
      router.push(`/room`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Label>Profile Picture</Label>
        {!form.getValues("imageUrl") ? (
          <FormField
            control={form.control}
            name="imageUrl"
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
            src={form.getValues("imageUrl")}
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
                  placeholder="Enter title for your room"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                This is your public display name for your room.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default CreateRoom;
