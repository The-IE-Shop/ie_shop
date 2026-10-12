"use server";
import { z } from "zod";
import { Resend } from "resend";

// zod schema
const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(50, "Name too long."),
  lastName: z.string().trim().min(1, "Last name is required.").max(50, "Name too long."),
  email: z.string().trim().max(100, "Email cannont exceed 100 characters.").pipe(
    z.email("Please enter a valid email address")
  ),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000)
});

// Iniitalize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(prevState: any, formData: FormData) {
  
  const rawFields = {
    firstName: formData.get("contact-first-name") as string,
    lastName: formData.get("contact-last-name") as string,
    email: formData.get("contact-email") as string,
    message: formData.get("contact-message") as string
  } 

  const validatedFields = contactSchema.safeParse(rawFields);

  if(!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    const fieldErrors = flattened.fieldErrors;

    return {
      success: false,
      error: Object.values(fieldErrors).flat()[0] || "Invalid form data.",
    };
  };

  const { firstName, lastName, email, message } = validatedFields.data;

  try {
     
    await resend.emails.send({
      from: "Contact Form <contact@mail.theie.shop>",
      to: "dadigwu@gmail.com",
      replyTo: email,
      subject: `New E-Commerce Message ${firstName} ${lastName}`,
      text: `Sender: ${firstName} ${lastName} (${email}) \n\nMessage:\n${message}`,
    });

    return {
      success: true,
      error: null
    }
    
  } catch(err) {
    console.error("Failed to send message:", err);
    return {
      success: false,
      fallbackToMailto: true,
      error: null,
      validatedData: { firstName, lastName, email, message }
    }
  }
}