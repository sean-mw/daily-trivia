const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  const buttonClass = [
    'border-black focus:border-black border-solid border-2 rounded-lg font-bold py-4 px-6 text-xl break-words',
    disabled ? 'cursor-default' : 'hover:bg-gray-200',
    className,
  ].join(' ')
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}

export default Button
