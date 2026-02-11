"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familySchema, type FamilyInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFamily, updateFamily } from "@/actions/families";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FamilyFormProps {
  family?: {
    id: string;
    name: string;
    contactPerson: string | null;
    phone: string | null;
  };
  onSuccess?: () => void;
}

export function FamilyForm({ family, onSuccess }: FamilyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FamilyInput>({
    resolver: zodResolver(familySchema),
    defaultValues: family
      ? {
          name: family.name,
          contactPerson: family.contactPerson || "",
          phone: family.phone || "",
        }
      : {
          name: "",
          contactPerson: "",
          phone: "",
        },
  });

  const onSubmit = async (data: FamilyInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = family
        ? await updateFamily(family.id, data)
        : await createFamily(data);

      if (result.error) {
        setError(result.error);
      } else {
        reset();
        router.refresh();
        onSuccess?.();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Family Name"
        placeholder="e.g., Khan Family"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Contact Person (Optional)"
        placeholder="e.g., Ahmed Khan"
        error={errors.contactPerson?.message}
        {...register("contactPerson")}
      />

      <Input
        label="Phone (Optional)"
        placeholder="e.g., +92 300 1234567"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          {family ? "Update Family" : "Create Family"}
        </Button>
      </div>
    </form>
  );
}
