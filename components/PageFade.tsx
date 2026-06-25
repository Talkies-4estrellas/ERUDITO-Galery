export default function PageFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-page-in ${className}`}>
      {children}
    </div>
  );
}
