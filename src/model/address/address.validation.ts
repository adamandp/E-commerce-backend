import { z } from 'zod';
import {
  baseBoolean,
  baseUUID,
  createDTO,
  numberMinMax,
  stringMinMax,
} from 'src/utils/zodQuick';

const address = z
  .object({
    id: baseUUID('Address ID'),
    userId: baseUUID('User ID'),
    province: stringMinMax('Province', 1, 100),
    city: stringMinMax('City', 1, 100),
    subdistrict: stringMinMax('Subdistrict', 1, 100),
    village: stringMinMax('Village', 1, 100),
    postalCode: numberMinMax('Postal Code', 10000, 99999),
    address: stringMinMax('Address', 1, 100),
    isPrimary: baseBoolean('Is Primary'),
  })
  .strict();

const addressCreate = address.omit({ id: true });
const addressUpdate = address.partial().required();
const addressDelete = address.pick({ id: true, userId: true });

export class AddressCreateDTO extends createDTO(addressCreate) {}
export class AddressUpdateDTO extends createDTO(addressUpdate) {}
export class AddressDeleteDTO extends createDTO(addressDelete) {}
