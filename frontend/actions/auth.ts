"use server"

import { registerUserService } from "@/lib/strapi"
import { FormState, SignupFormSchema } from "@/validations/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import z from "zod"

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
  httpOnly: true,
  domain: process.env.HOST ?? "localhost",
  secure: true
}

export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {

  const fields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validateFields = SignupFormSchema.safeParse(fields)
  if (!validateFields.success) {
    const flattenedErrors = z.flattenError(validateFields.error)

    console.log("Validation Errors:", flattenedErrors.fieldErrors);

    return {
      success: false,
      message: "Validation errors occurred.",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    }
  }

  const response = await registerUserService(validateFields.data)

  if (!response || response.error) {
    return {
      success: false,
      message: "Registration successful.",
      strapiErrors: response?.error ?? null,
      zodErrors: null,
      data: fields
    }
  }

  console.log("Registration Response:", response);

  const cookieStore = await cookies()
  cookieStore.set("jwt", response.jwt, cookieConfig)
  redirect("/dashboard")

  return {
    success: false,
    message: "Registration successful.",
    strapiErrors: null,
    zodErrors: null,
    data: fields
  }
}