"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { status } = useSession();
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status !== "unauthenticated") {
    return null;
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O campo e-mail é obrigatório"),
    password: Yup.string().required("O campo senha é obrigatório"),
  });

  async function handleSubmit(values, { resetForm }) {
    setFormSubmitting(true);
    try {
      signIn("Credentials", { ...values, redirect: false }).then(
        ({ error }) => {
          if (!error) {
            router.push("/");
          } else {
            setError(error.replace("Error: ", ""));
            setTimeout(() => {
              setError("");
            }, 3000);
            resetForm();
          }
          setFormSubmitting(false);
        }
      );
    } catch {
      setFormSubmitting(false);
      rederError("Erro ao criar conta, tente mais tarde!");
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form
            noValidate
            className="flex flex-col gap-2 p-4 border rounded border-zinc-300 min-w-[300px] bg-white"
          >
            <Input name="email" type="email" required />
            <Input name="Senha" type="password" required autoComplete="off" />
            <Button
              type="submit"
              text={isFormSubmitting ? "Carregando..." : "Entrar"}
              disabled={isFormSubmitting}
              className="bg-green-500 text-white rounded p-2 cursor-pointer"
            />
            {!values.email && !values.password && error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}
            <span className="text-xs text-zinc-500">
              Não possui uma conta?
              <strong className="text-zinc-700">
                <Link href="/register"> Inscreva-se</Link>
              </strong>
            </span>
          </Form>
        )}
      </Formik>
    </main>
  );
}
