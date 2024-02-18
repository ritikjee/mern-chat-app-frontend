"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Enter at least 1 letter" })
    .max(500, { message: "Message is too long" }),
});

function ChatInput({
  roomId,
  userId,
  token,
}: {
  roomId: string;
  userId: string;
  token: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isDisabled = isLoading || !form.formState.isValid;

  async function sendMessage(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/message/create-message`,
        {
          roomId,
          userId,
          text: values.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendMessage)} className="flex gap-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Start Typing" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isDisabled}>
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ChatInput;
