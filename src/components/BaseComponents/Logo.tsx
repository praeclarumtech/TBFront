function Logo({ className }: { className?: string }) {
  return <img src={"logo/logo.png"} alt="logo"  className={`h-[60px] ${className}`} />;
 }

export default Logo;