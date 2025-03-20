import { BadRequestException } from '@nestjs/common';
export const checkUpdate = <T extends Record<string, any>>(
  newData: T,
  oldData?: Partial<{ [K in keyof T]: T[K] | null }>,
) => {
  oldData = oldData ?? {};

  const updatedFields = Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => oldData?.[key] !== value),
  );

  if (Object.keys(updatedFields).length === 0) {
    throw new BadRequestException('No changes detected');
  }

  return updatedFields;
};
