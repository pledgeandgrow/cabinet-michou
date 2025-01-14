'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ReCAPTCHA from "react-google-recaptcha";

type FormData = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
};

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    if (!recaptchaToken) {
      toast({
        title: "Erreur",
        description: "Veuillez cocher le captcha",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      toast({
        title: "Succès",
        description: "Votre message a bien été envoyé !",
      });
      reset();
      setRecaptchaToken(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: "destructive",
      });
    }
  };

  return (
    <section className="w-full mx-auto">
      <div className="text-center mb-8">
        <Badge
          variant={"outline"}
        >Contact</Badge>
        <h2 className="text-3xl font-extrabold text-blue-800 leading-tight">
          Envoyez-nous un message
        </h2>
        <p className="mt-4 text-gray-600">
          Nous vous répondrons dans les plus brefs délais
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nom" className="text-sm font-medium text-gray-700">
              Nom
            </label>
            <Input
              id="nom"
              {...register("nom", { required: "Le nom est requis" })}
              className={errors.nom ? "border-red-500" : ""}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm">{errors.nom.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="prenom" className="text-sm font-medium text-gray-700">
              Prénom
            </label>
            <Input
              id="prenom"
              {...register("prenom", { required: "Le prénom est requis" })}
              className={errors.prenom ? "border-red-500" : ""}
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm">{errors.prenom.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email invalide",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="telephone" className="text-sm font-medium text-gray-500">
              Téléphone
            </label>
            <Input
              id="telephone"
              {...register("telephone", { required: "Le téléphone est requis" })}
              className={errors.telephone ? "border-red-500" : ""}
            />
            {errors.telephone && (
              <p className="text-red-500 text-sm">{errors.telephone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="objet" className="text-sm font-medium text-gray-500">
            Objet
          </label>
          <Input
            id="objet"
            {...register("objet", { required: "L'objet est requis" })}
            className={errors.objet ? "border-red-500" : ""}
          />
          {errors.objet && (
            <p className="text-red-500 text-sm">{errors.objet.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-500">
            Message
          </label>
          <Textarea
            id="message"
            rows={5}
            {...register("message", { required: "Le message est requis" })}
            className={errors.message ? "border-red-500" : ""}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6Le4oswZAAAAAHiBVBnjI8A4eRHtabdU4-LYmJox"
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </section>
  );
}
