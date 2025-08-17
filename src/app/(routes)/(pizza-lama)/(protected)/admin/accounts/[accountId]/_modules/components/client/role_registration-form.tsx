"use client"
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { redirect } from 'next/navigation'
import { RoleRegisterFormValues, roleRegisterSchema } from '@/schemas'
import { UserRole } from '@/data/data'
import { signUp } from '@/lib/auth-client'

import { toast } from 'sonner'

import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RoleRegistrationForm() {

  const form = useForm({
    resolver: zodResolver(roleRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.ADMIN
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const toastLoading = "Creating account..."
  const toastSuccess = "Registration successful! Redirecting...";
  const onSubmit = async (values: RoleRegisterFormValues) => {
    const toastId = toast.loading(toastLoading );
    try {
      const result = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role as UserRole,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed.");
      } else if (result.data?.user) {
        toast.success(toastSuccess);
        // Redirect after a short delay
        setTimeout(() => {
          redirect("/admin/accounts");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Name</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Email</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*****"
                        type="password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isSubmitting}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.ADMIN} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Administrator
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={UserRole.MODERATOR} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Moderator
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3">
              <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}