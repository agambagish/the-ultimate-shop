export function UPILogo({ ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      {...props}
    >
      <title>UPI</title>
      <polygon fill="#388e3c" points="29,4 18,45 40,24" />
      <polygon fill="#f57c00" points="21,3 10,44 32,23" />
    </svg>
  );
}
