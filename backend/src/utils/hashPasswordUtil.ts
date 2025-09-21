import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';

const saltRounds = process.env.SALT_ROUNDS 
  ? parseInt(process.env.SALT_ROUNDS, 10) 
  : 10;

export const hashPassword = (password: string): string => {
  const salt = genSaltSync(saltRounds);
  return hashSync(password, salt);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};