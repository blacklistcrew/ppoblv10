import { StatusType } from "@/types/transaction";

export const listStatus: StatusType[] = [
  {
    label: 'Failed',
    color: 'bg-red-600',
    desc: 'Failed to process',
  },
  {
    label: 'Process',
    color: 'bg-blue-500',
    desc: 'Waiting system to finish the transaction',
  },
  {
    label: 'Success',
    color: 'bg-green-400',
    desc: 'Transaction Success',
  },
  {
    label: 'Waiting',
    color: 'bg-orange-500',
    desc: 'Waiting payment by user',
  },
];

export const rupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}

export const toInteger = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(number)
}

export const toDouble = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(number)
}

export const filterNumber = (number: string) => {
  return number.replace(/[^0-9\.]+/g, "")
}