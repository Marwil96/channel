export const getDomain = ({email}: {email:string}) => {
  return email.split('@')[1]
}