'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { signUp } from '@/app/actions/auth';
import { signUpSchema } from '@utils/auth/validation';
import type { z } from 'zod';

type FormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const t = useTranslations('signUp');
  const locale = useLocale();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const result = await signUp({
      email: data.email,
      password: data.password,
      locale,
    });
    if (result?.error) {
      setServerError(t(result.error as Parameters<typeof t>[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <p role="alert" className="text-method-delete text-sm">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t('emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          className="border-border bg-surface focus:border-foreground rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
        <p
          {...(errors.email && { role: 'alert' })}
          className="text-method-delete invisible min-h-4 text-xs aria-[hidden=false]:visible"
          aria-hidden={!errors.email}
        >
          {errors.email && typeof errors.email.message === 'string'
            ? t(errors.email.message as Parameters<typeof t>[0])
            : ''}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          {t('passwordLabel')}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={t('passwordPlaceholder')}
          {...register('password')}
          className="border-border bg-surface focus:border-foreground rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
        <p
          {...(errors.password && { role: 'alert' })}
          className="text-method-delete invisible min-h-4 text-xs aria-[hidden=false]:visible"
          aria-hidden={!errors.password}
        >
          {errors.password && typeof errors.password.message === 'string'
            ? t(errors.password.message as Parameters<typeof t>[0])
            : ''}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          {t('confirmLabel')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder={t('confirmPlaceholder')}
          {...register('confirmPassword')}
          className="border-border bg-surface focus:border-foreground rounded-lg border px-3 py-2 text-sm outline-hidden"
        />
        <p
          {...(errors.confirmPassword && { role: 'alert' })}
          className="text-method-delete invisible min-h-4 text-xs aria-[hidden=false]:visible"
          aria-hidden={!errors.confirmPassword}
        >
          {errors.confirmPassword &&
          typeof errors.confirmPassword.message === 'string'
            ? t(errors.confirmPassword.message as Parameters<typeof t>[0])
            : ''}
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="bg-foreground text-surface hover:bg-foreground-hover rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {t('submit')}
      </button>
    </form>
  );
}
