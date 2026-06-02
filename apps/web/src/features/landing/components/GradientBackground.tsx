export function GradientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[40%] -top-[30%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
      <div className="absolute -right-[30%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[100px] dark:bg-violet-600/10" />
      <div className="absolute bottom-0 left-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
