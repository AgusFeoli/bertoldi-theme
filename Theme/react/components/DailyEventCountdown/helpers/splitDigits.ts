export const splitDigits = (value: number, size: number = 2): string[] => {

  const padded = String(value).padStart(size, '0')
  
  return padded.split('')

}
