'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { signIn } from '@/app/actions/auth';
import { signInSchema } from '@utils/auth/validation';
import { useError } from '@components/error/ErrorContext';
import type { z } from 'zod';

type FormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const t = useTranslations('signIn');
  const ts = useTranslations('serverErrors');
  const locale = useLocale();
  const { showError } = useError();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    const result = await signIn({ ...data, locale });
    if (result?.error) {
      const message = ts.has(result.error as never) ? ts(result.error as never) : result.error;
      showError(message, t('title'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

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
          autoComplete="current-password"
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

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="cursor-pointer disabled:cursor-not-allowed bg-foreground text-surface hover:bg-foreground-hover rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {t('submit')}
      </button>
    </form>
  );
}
