import TemplatePointers from "./TemplatePointers";

function LandingIntro() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="relative mb-12">
        <div className="absolute inset-0 blur-3xl bg-white/5 rounded-full scale-150" />
        <img
          src="/logoshortcut.png"
          className="w-24 h-24 relative z-10 grayscale brightness-200 opacity-80"
          alt="TicketMon-logo"
        />
      </div>

      <h1 className="text-4xl font-bold font-outfit tracking-tighter text-white mb-4">
        Everything you need,<br />
        <span className="opacity-40">nothing you don't.</span>
      </h1>

      <p className="text-white/30 text-sm max-w-[280px] leading-relaxed font-medium">
        Experience the next generation of support management with our minimalist interface.
      </p>
    </div>
  );
}

export default LandingIntro;
