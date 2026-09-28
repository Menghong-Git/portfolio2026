export type ContactPayload = { name: string; email: string; subject: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const MESSAGE_MAX = 2000;

/** Shared by the form (instant feedback) and the API route (the real check). */
export function validateContact(form: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (form.name.length > 100) errors.name = "Keep your name under 100 characters.";
  if (!/^\S+@\S+\.\S+$/.test(form.email) || form.email.length > 200) errors.email = "Enter a valid email address.";
  if (form.subject.trim().length < 3) errors.subject = "Add a brief subject.";
  if (form.subject.length > 150) errors.subject = "Keep the subject under 150 characters.";
  if (form.message.trim().length < 20) errors.message = "Please share at least 20 characters.";
  if (form.message.length > MESSAGE_MAX) errors.message = `Keep the message under ${MESSAGE_MAX.toLocaleString()} characters.`;
  return errors;
}
