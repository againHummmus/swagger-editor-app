import { describe, it, expect } from 'vitest';
import { signInSchema, signUpSchema } from './validation';

describe('signInSchema', () => {
  it('rejects empty email', () => {
    const result = signInSchema.safeParse({ email: '', password: 'Valid1!' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('validation.emailRequired');
    }
  });

  it('rejects invalid email', () => {
    const result = signInSchema.safeParse({
      email: 'notanemail',
      password: 'Valid1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('validation.emailInvalid');
    }
  });

  it('rejects empty password', () => {
    const result = signInSchema.safeParse({
      email: 'user@test.com',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'validation.passwordRequired'
      );
    }
  });

  it('accepts valid credentials', () => {
    const result = signInSchema.safeParse({
      email: 'user@test.com',
      password: 'anypass',
    });
    expect(result.success).toBe(true);
  });
});

describe('signUpSchema', () => {
  it('rejects short password', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'Ab1!',
      confirmPassword: 'Ab1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.passwordMinLength'
        )
      ).toBe(true);
    }
  });

  it('rejects password without digit', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'Abcdefgh!',
      confirmPassword: 'Abcdefgh!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.passwordDigit'
        )
      ).toBe(true);
    }
  });

  it('rejects password without letter', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: '12345678!',
      confirmPassword: '12345678!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.passwordLetter'
        )
      ).toBe(true);
    }
  });

  it('rejects password without special character', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'Abcdefg1',
      confirmPassword: 'Abcdefg1',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.passwordSpecial'
        )
      ).toBe(true);
    }
  });

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'ValidPass1!',
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.confirmMismatch'
        )
      ).toBe(true);
    }
  });

  it('accepts valid signup', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'ValidPass1!',
      confirmPassword: 'ValidPass1!',
    });
    expect(result.success).toBe(true);
  });

  it('supports Unicode letters (e.g. Cyrillic)', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'Привет1!',
      confirmPassword: 'Привет1!',
    });
    expect(result.success).toBe(true);
  });

  it('supports Unicode letters (e.g. Chinese)', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: '密码测试123!',
      confirmPassword: '密码测试123!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty confirmPassword', () => {
    const result = signUpSchema.safeParse({
      email: 'user@test.com',
      password: 'ValidPass1!',
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.message === 'validation.confirmRequired'
        )
      ).toBe(true);
    }
  });
});
