interface FormErrorProps {
  error?: string[]
}

export function FormError({ error}: FormErrorProps)  {
  if (!error) return null;

  return error.map((errMsg, index) => (
    <p key={index} className="text-pink-500 text-xs italic mt-1 py-2">{errMsg}</p>
  ));
    
  
}